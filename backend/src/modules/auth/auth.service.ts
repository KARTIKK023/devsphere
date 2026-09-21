import crypto from "crypto";
import mongoose from "mongoose";

import { AppError } from "../../core/errors/AppError";
import { hashPassword, comparePassword } from "../../core/security/password";
import { encryptSecret } from "../../core/security/encryption";
import { signAccessToken } from "../../core/security/jwt";
import { getSessionExpiration } from "../../core/security/session-expiration";

import { UserModel } from "../users/user.model";
import { OrganizationModel } from "../organizations/organization.model";
import { MembershipModel } from "../memberships/membership.model";
import { RoleModel } from "../rbac/role.model";
import { SessionModel } from "../sessions/session.model";
import { SubscriptionPlanModel } from "../billing/plan.model";
import { SubscriptionModel } from "../billing/subscription.model";
import { PlatformAdminModel } from "../platform/platform-admin.model";
import { getMyOrganizations } from "../organizations/organization.service";
import { getOrganizationSubscription } from "../billing/billing.service";
import { getRolesAndPermissions } from "../rbac/access";

import type { LoginInput, SignupInput } from "./auth.validation";
import type { SystemRole } from "../rbac/role.types";
import type { OAuthProfile } from "./auth.types";
import type { SessionDevice } from "../../core/security/device";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function createUniqueSlug(name: string): Promise<string> {
  const baseSlug = generateSlug(name);

  let slug = baseSlug;
  let counter = 1;

  while (await OrganizationModel.exists({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

function serializeUser(user: {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  avatar?: string | null;
  status: string;
  emailVerified?: boolean;
  googleId?: string | null;
  githubId?: string | null;
  githubAccessToken?: string | null;
}) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    avatar: user.avatar ?? null,
    status: user.status,
    emailVerified: user.emailVerified ?? false,
    providers: {
      google: Boolean(user.googleId),
      github: Boolean(user.githubId),
    },
    githubConnected: Boolean(user.githubAccessToken),
  };
}

function applyGithubCredentials(
  user: {
    githubLogin?: string | null;
    githubAccessToken?: string | null;
    githubTokenScopes?: string[];
    githubConnectedAt?: Date | null;
  },
  profile: OAuthProfile
) {
  if (profile.provider !== "GITHUB" || !profile.accessToken) {
    return;
  }

  user.githubAccessToken = encryptSecret(profile.accessToken);
  user.githubConnectedAt = new Date();
  user.githubTokenScopes = profile.scope
    ? profile.scope.split(/[,\s]+/).filter(Boolean)
    : ["read:user", "user:email", "repo"];

  if (profile.login) {
    user.githubLogin = profile.login;
  }
}

function serializeOrganization(organization: {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
}) {
  return {
    id: organization._id.toString(),
    name: organization.name,
    slug: organization.slug,
  };
}

async function createSession(
  userId: mongoose.Types.ObjectId | string,
  organizationId: mongoose.Types.ObjectId | string,
  device?: SessionDevice
) {
  return SessionModel.create({
    userId,
    organizationId,
    tokenVersion: 0,
    device,
    lastActiveAt: new Date(),
    expiresAt: getSessionExpiration(),
  });
}

async function buildAuthPayload(input: {
  user: {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    avatar?: string | null;
    status: string;
    emailVerified?: boolean;
    googleId?: string | null;
    githubId?: string | null;
  };
  organization: {
    _id: mongoose.Types.ObjectId;
    name: string;
    slug: string;
  };
  sessionId: mongoose.Types.ObjectId;
  roles: SystemRole[];
  permissions: string[];
}) {
  const [organizations, subscription] = await Promise.all([
    getMyOrganizations(input.user._id.toString()),
    getOrganizationSubscription(input.organization._id.toString()),
  ]);

  const accessToken = signAccessToken({
    userId: input.user._id.toString(),
    sessionId: input.sessionId.toString(),
    organizationId: input.organization._id.toString(),
  });

  return {
    user: serializeUser(input.user),
    organization: serializeOrganization(input.organization),
    organizations,
    roles: input.roles,
    permissions: input.permissions,
    subscription,
    accessToken,
  };
}

async function getActiveMembershipContext(
  userId: string,
  organizationId: string
) {
  const membership = await MembershipModel.findOne({
    userId,
    organizationId,
    status: "ACTIVE",
  });

  if (!membership) {
    throw new AppError("No active organization membership", 403);
  }

  const organization = await OrganizationModel.findById(organizationId);

  if (!organization) {
    throw new AppError("Organization not found", 404);
  }

  if (organization.status === "SUSPENDED") {
    throw new AppError(
      "This organization has been suspended",
      403
    );
  }

  const access = await getRolesAndPermissions(membership.roleIds);

  return {
    membership,
    organization,
    ...access,
  };
}

export async function signup(
  input: SignupInput,
  device?: SessionDevice
) {
  const [freePlan, ownerRole] = await Promise.all([
    SubscriptionPlanModel.findOne({ code: "FREE" }),
    RoleModel.findOne({ name: "OWNER", isSystemRole: true }),
  ]);

  if (!freePlan) {
    throw new AppError("FREE subscription plan has not been seeded", 500);
  }

  if (!ownerRole) {
    throw new AppError("OWNER role has not been seeded", 500);
  }

  const existingUser = await UserModel.findOne({
    email: input.email,
  });

  if (existingUser) {
    throw new AppError("An account with this email already exists", 409);
  }

  const passwordHash = await hashPassword(input.password);

  const user = await UserModel.create({
    name: input.name,
    email: input.email,
    passwordHash,
    status: "ACTIVE",
    emailVerified: false,
  });

  const organization = await OrganizationModel.create({
    name: `${input.name}'s Workspace`,
    slug: await createUniqueSlug(`${input.name}-workspace`),
    createdBy: user._id,
  });

  await SubscriptionModel.create({
    organizationId: organization._id,
    planId: freePlan._id,
    status: "ACTIVE",
    startedAt: new Date(),
  });

  await MembershipModel.create({
    userId: user._id,
    organizationId: organization._id,
    roleIds: [ownerRole._id],
    status: "ACTIVE",
  });

  const session = await createSession(
    user._id,
    organization._id,
    device
  );

  return buildAuthPayload({
    user,
    organization,
    sessionId: session._id,
    roles: ["OWNER"],
    permissions: (
      await getRolesAndPermissions([ownerRole._id])
    ).permissions,
  });
}

export async function login(
  input: LoginInput,
  device?: SessionDevice
) {
  const user = await UserModel.findOne({
    email: input.email,
  });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  if (user.status !== "ACTIVE") {
    throw new AppError("Your account is not active", 403);
  }

  const validPassword = await comparePassword(
    input.password,
    user.passwordHash
  );

  if (!validPassword) {
    throw new AppError("Invalid email or password", 401);
  }

  const memberships = await MembershipModel.find({
    userId: user._id,
    status: "ACTIVE",
  });

  if (memberships.length === 0) {
    throw new AppError(
      "User does not belong to an active organization",
      403
    );
  }

  const activeMembership = memberships[0];

  if (!activeMembership) {
    throw new AppError("No active membership found", 403);
  }

  const context = await getActiveMembershipContext(
    user._id.toString(),
    activeMembership.organizationId.toString()
  );

  const session = await createSession(
    user._id,
    context.organization._id,
    device
  );

  return buildAuthPayload({
    user,
    organization: context.organization,
    sessionId: session._id,
    roles: context.roles,
    permissions: context.permissions,
  });
}

export async function getCurrentAuth(
  userId: string,
  organizationId: string,
  sessionId: string
) {
  const user = await UserModel.findById(userId).select(
    "_id name email avatar status emailVerified googleId githubId githubLogin githubAccessToken"
  );

  if (!user) {
    throw new AppError("Authentication context is invalid", 401);
  }

  const context = await getActiveMembershipContext(userId, organizationId);

  const [organizations, subscription, platformAdmin] = await Promise.all([
    getMyOrganizations(userId),
    getOrganizationSubscription(organizationId),
    PlatformAdminModel.findOne({
      userId: user._id,
      isActive: true,
    }),
  ]);

  return {
    user: serializeUser(user),
    organization: serializeOrganization(context.organization),
    organizations,
    roles: context.roles,
    permissions: context.permissions,
    subscription,
    isPlatformAdmin: Boolean(platformAdmin),
    session: {
      id: sessionId,
    },
  };
}

export async function switchOrganization(
  userId: string,
  currentSessionId: string,
  organizationId: string,
  device?: SessionDevice
) {
  if (!mongoose.Types.ObjectId.isValid(organizationId)) {
    throw new AppError("Invalid organization ID", 400);
  }

  const user = await UserModel.findById(userId);

  if (!user) {
    throw new AppError("User not found", 401);
  }

  const context = await getActiveMembershipContext(userId, organizationId);

  await SessionModel.deleteOne({
    _id: currentSessionId,
    userId,
  });

  const session = await createSession(
    userId,
    context.organization._id,
    device
  );

  return buildAuthPayload({
    user,
    organization: context.organization,
    sessionId: session._id,
    roles: context.roles,
    permissions: context.permissions,
  });
}

export async function listSessions(userId: string, currentSessionId: string) {
  const sessions = await SessionModel.find({
    userId,
    expiresAt: {
      $gt: new Date(),
    },
  })
    .populate("organizationId")
    .sort({ createdAt: -1 });

  return sessions.map((session) => {
    const organization = session.organizationId as unknown as {
      _id?: mongoose.Types.ObjectId;
      name?: string;
      slug?: string;
    } | null;

    return {
      id: session._id.toString(),
      isCurrent: session._id.toString() === currentSessionId,
      device: session.device ?? null,
      startedAt: session.createdAt,
      lastActiveAt: session.lastActiveAt,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
      organization: organization?._id
        ? {
            id: organization._id.toString(),
            name: organization.name ?? "",
            slug: organization.slug ?? "",
          }
        : null,
    };
  });
}

export async function logout(sessionId: string, userId: string) {
  await SessionModel.deleteOne({
    _id: sessionId,
    userId,
  });
}

export async function logoutAllSessions(userId: string) {
  await SessionModel.deleteMany({
    userId,
  });
}

export async function revokeSession(
  userId: string,
  sessionId: string
) {
  if (!mongoose.Types.ObjectId.isValid(sessionId)) {
    throw new AppError("Invalid session ID", 400);
  }

  const result = await SessionModel.deleteOne({
    _id: sessionId,
    userId,
  });

  if (result.deletedCount === 0) {
    throw new AppError("Session not found", 404);
  }

  return { revoked: true };
}

export async function updateProfile(
  userId: string,
  input: {
    name?: string | undefined;
    avatar?: string | null | undefined;
  }
) {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (input.name !== undefined) {
    user.name = input.name;
  }

  if (input.avatar !== undefined) {
    user.avatar = input.avatar;
  }

  await user.save();

  return serializeUser(user);
}

export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
) {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const validPassword = await comparePassword(
    currentPassword,
    user.passwordHash
  );

  if (!validPassword) {
    throw new AppError(
      "Current password is incorrect",
      400
    );
  }

  const samePassword = await comparePassword(
    newPassword,
    user.passwordHash
  );

  if (samePassword) {
    throw new AppError(
      "New password must be different from the current password",
      400
    );
  }

  user.passwordHash = await hashPassword(
    newPassword
  );

  await user.save();

  return { updated: true };
}

export async function loginWithOAuth(
  profile: OAuthProfile,
  device?: SessionDevice
) {
  const email = profile.email.toLowerCase();

  let user =
    profile.provider === "GOOGLE"
      ? await UserModel.findOne({
          googleId: profile.providerId,
        })
      : await UserModel.findOne({
          githubId: profile.providerId,
        });

  if (!user) {
    user = await UserModel.findOne({ email });

    if (user) {
      if (profile.provider === "GOOGLE") {
        user.googleId = profile.providerId;
      } else {
        user.githubId = profile.providerId;
      }

      if (!user.avatar && profile.avatar) {
        user.avatar = profile.avatar;
      }

      applyGithubCredentials(user, profile);

      user.emailVerified = true;

      await user.save();
    }
  }

  if (!user) {
    const [freePlan, ownerRole] = await Promise.all([
      SubscriptionPlanModel.findOne({
        code: "FREE",
      }),
      RoleModel.findOne({
        name: "OWNER",
        isSystemRole: true,
      }),
    ]);

    if (!freePlan) {
      throw new AppError(
        "FREE subscription plan has not been seeded",
        500
      );
    }

    if (!ownerRole) {
      throw new AppError(
        "OWNER role has not been seeded",
        500
      );
    }

    const oauthId =
      profile.provider === "GOOGLE"
        ? { googleId: profile.providerId }
        : { githubId: profile.providerId };

    user = await UserModel.create({
      name: profile.name,
      email,
      passwordHash: await hashPassword(
        crypto.randomBytes(32).toString("hex")
      ),
      avatar: profile.avatar ?? null,
      status: "ACTIVE",
      emailVerified: true,
      ...oauthId,
    });

    const organization = await OrganizationModel.create({
      name: `${profile.name}'s Workspace`,
      slug: await createUniqueSlug(
        `${profile.name}-workspace`
      ),
      createdBy: user._id,
    });

    await SubscriptionModel.create({
      organizationId: organization._id,
      planId: freePlan._id,
      status: "ACTIVE",
      startedAt: new Date(),
    });

    await MembershipModel.create({
      userId: user._id,
      organizationId: organization._id,
      roleIds: [ownerRole._id],
      status: "ACTIVE",
    });

    const session = await createSession(
      user._id,
      organization._id,
      device
    );

    return buildAuthPayload({
      user,
      organization,
      sessionId: session._id,
      roles: ["OWNER"],
      permissions: (
        await getRolesAndPermissions([ownerRole._id])
      ).permissions,
    });
  }

  if (profile.provider === "GITHUB") {
    applyGithubCredentials(user, profile);

    if (profile.accessToken) {
      await user.save();
    }
  }

  if (user.status !== "ACTIVE") {
    throw new AppError(
      "Your account is not active",
      403
    );
  }

  const membership = await MembershipModel.findOne({
    userId: user._id,
    status: "ACTIVE",
  });

  if (!membership) {
    throw new AppError(
      "User does not belong to an active organization",
      403
    );
  }

  const context = await getActiveMembershipContext(
    user._id.toString(),
    membership.organizationId.toString()
  );

  const session = await createSession(
    user._id,
    context.organization._id,
    device
  );

  return buildAuthPayload({
    user,
    organization: context.organization,
    sessionId: session._id,
    roles: context.roles,
    permissions: context.permissions,
  });
}
