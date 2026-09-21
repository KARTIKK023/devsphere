import mongoose from "mongoose";

import { AppError } from "../../core/errors/AppError";

import { OrganizationModel } from "../organizations/organization.model";
import { UserModel } from "../users/user.model";
import { MembershipModel } from "../memberships/membership.model";
import { SubscriptionModel } from "../billing/subscription.model";
import { PlatformAdminModel } from "./platform-admin.model";

import type { UserStatus } from "../users/user.types";
import type { OrganizationStatus } from "../organizations/organization.types";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export async function listOrganizations() {
  const organizations = await OrganizationModel.find().sort(
    { createdAt: -1 }
  );

  return Promise.all(
    organizations.map(async (organization) => {
      const [memberCount, subscription, owner] =
        await Promise.all([
          MembershipModel.countDocuments({
            organizationId: organization._id,
            status: "ACTIVE",
          }),
          SubscriptionModel.findOne({
            organizationId: organization._id,
          }).populate("planId"),
          UserModel.findById(
            organization.createdBy
          ).select("name email"),
        ]);

      const plan = subscription?.planId as unknown as {
        code?: string;
        name?: string;
      } | null;

      return {
        id: organization._id.toString(),
        name: organization.name,
        slug: organization.slug,
        status: organization.status,
        createdAt: organization.createdAt,
        memberCount,
        plan: plan?.code ?? null,
        planName: plan?.name ?? null,
        owner: owner
          ? {
              id: owner._id.toString(),
              name: owner.name,
              email: owner.email,
            }
          : null,
      };
    })
  );
}

export async function listUsers() {
  const users = await UserModel.find()
    .sort({ createdAt: -1 })
    .select("-passwordHash");

  const [adminUserIds] = await Promise.all([
    PlatformAdminModel.distinct("userId", {
      isActive: true,
    }),
  ]);

  const adminSet = new Set(
    adminUserIds.map((id) => String(id))
  );

  return users.map((user) => {
    const providers: string[] = [];

    if (user.passwordHash) {
      providers.push("EMAIL");
    }

    if (user.googleId) {
      providers.push("GOOGLE");
    }

    if (user.githubId) {
      providers.push("GITHUB");
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatar: user.avatar ?? null,
      status: user.status,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      providers,
      isPlatformAdmin: adminSet.has(
        user._id.toString()
      ),
    };
  });
}

export async function updateOrganizationStatus(
  organizationId: string,
  status: OrganizationStatus
) {
  if (
    !mongoose.Types.ObjectId.isValid(
      organizationId
    )
  ) {
    throw new AppError("Invalid organization ID", 400);
  }

  const organization =
    await OrganizationModel.findByIdAndUpdate(
      organizationId,
      { status },
      { new: true }
    );

  if (!organization) {
    throw new AppError("Organization not found", 404);
  }

  return {
    id: organization._id.toString(),
    name: organization.name,
    status: organization.status,
  };
}

export async function updateUserStatus(
  userId: string,
  status: UserStatus
) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError("Invalid user ID", 400);
  }

  const user = await UserModel.findByIdAndUpdate(
    userId,
    { status },
    { new: true }
  );

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    status: user.status,
  };
}

export async function getPlatformStats() {
  const thirtyDaysAgo = new Date(
    Date.now() - THIRTY_DAYS_MS
  );

  const [
    totalOrganizations,
    activeOrganizations,
    suspendedOrganizations,
    newOrganizations30d,
    totalUsers,
    activeUsers,
    suspendedUsers,
    newUsers30d,
    activeMemberships,
    subscriptions,
    recentOrganizations,
    recentUsers,
  ] = await Promise.all([
    OrganizationModel.countDocuments(),
    OrganizationModel.countDocuments({
      status: "ACTIVE",
    }),
    OrganizationModel.countDocuments({
      status: "SUSPENDED",
    }),
    OrganizationModel.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    }),
    UserModel.countDocuments(),
    UserModel.countDocuments({ status: "ACTIVE" }),
    UserModel.countDocuments({ status: "SUSPENDED" }),
    UserModel.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    }),
    MembershipModel.countDocuments({
      status: "ACTIVE",
    }),
    SubscriptionModel.find({ status: "ACTIVE" }).populate(
      "planId"
    ),
    OrganizationModel.find()
      .sort({ createdAt: -1 })
      .limit(5),
    UserModel.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("-passwordHash"),
  ]);

  let premiumSubscriptions = 0;
  let freeSubscriptions = 0;

  for (const subscription of subscriptions) {
    const plan = subscription.planId as unknown as {
      code?: string;
    } | null;

    if (plan?.code === "PREMIUM") {
      premiumSubscriptions += 1;
    } else {
      freeSubscriptions += 1;
    }
  }

  return {
    organizations: {
      total: totalOrganizations,
      active: activeOrganizations,
      suspended: suspendedOrganizations,
      new30d: newOrganizations30d,
    },
    users: {
      total: totalUsers,
      active: activeUsers,
      suspended: suspendedUsers,
      new30d: newUsers30d,
    },
    memberships: {
      active: activeMemberships,
    },
    subscriptions: {
      total: subscriptions.length,
      premium: premiumSubscriptions,
      free: freeSubscriptions,
    },
    recentOrganizations: recentOrganizations.map(
      (organization) => ({
        id: organization._id.toString(),
        name: organization.name,
        status: organization.status,
        createdAt: organization.createdAt,
      })
    ),
    recentUsers: recentUsers.map((user) => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      status: user.status,
      createdAt: user.createdAt,
    })),
  };
}
