import { connectDatabase } from "../config/database";

import { UserModel } from "../modules/users/user.model";
import { OrganizationModel } from "../modules/organizations/organization.model";
import { MembershipModel } from "../modules/memberships/membership.model";
import { RoleModel } from "../modules/rbac/role.model";
import { SubscriptionPlanModel } from "../modules/billing/plan.model";
import { SubscriptionModel } from "../modules/billing/subscription.model";

import {
  PlatformAdminModel,
} from "../modules/platform/platform-admin.model";

import {
  hashPassword,
} from "../core/security/password";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function createUniqueSlug(
  name: string
): Promise<string> {
  const baseSlug = generateSlug(name);

  let slug = baseSlug;
  let counter = 1;

  while (await OrganizationModel.exists({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

/*
 * Platform admins authenticate through the normal login flow, which
 * requires an active organization membership. Provision a personal
 * workspace for admins that do not have one yet.
 */
async function ensureWorkspace(userId: string, name: string) {
  const existingMembership =
    await MembershipModel.findOne({
      userId,
      status: "ACTIVE",
    });

  if (existingMembership) {
    return;
  }

  const [freePlan, ownerRole] = await Promise.all([
    SubscriptionPlanModel.findOne({ code: "FREE" }),
    RoleModel.findOne({
      name: "OWNER",
      isSystemRole: true,
    }),
  ]);

  if (!freePlan || !ownerRole) {
    throw new Error(
      "Run `npm run seed` before creating a platform admin"
    );
  }

  const organization = await OrganizationModel.create({
    name: `${name}'s Workspace`,
    slug: await createUniqueSlug(
      `${name}-workspace`
    ),
    createdBy: userId,
  });

  await SubscriptionModel.create({
    organizationId: organization._id,
    planId: freePlan._id,
    status: "ACTIVE",
    startedAt: new Date(),
  });

  await MembershipModel.create({
    userId,
    organizationId: organization._id,
    roleIds: [ownerRole._id],
    status: "ACTIVE",
  });
}

async function run() {
  await connectDatabase();

  const email =
    process.env.PLATFORM_ADMIN_EMAIL;

  const password =
    process.env.PLATFORM_ADMIN_PASSWORD;

  const name =
    process.env.PLATFORM_ADMIN_NAME ??
    "DevSphere Admin";

  if (!email || !password) {
    throw new Error(
      "PLATFORM_ADMIN_EMAIL and PLATFORM_ADMIN_PASSWORD are required"
    );
  }

  let user =
    await UserModel.findOne({
      email: email.toLowerCase(),
    });

  if (!user) {
    user = await UserModel.create({
      name,
      email: email.toLowerCase(),
      passwordHash:
        await hashPassword(password),
      status: "ACTIVE",
      emailVerified: true,
    });
  }

  await ensureWorkspace(
    user._id.toString(),
    user.name
  );

  const existingAdmin =
    await PlatformAdminModel.findOne({
      userId: user._id,
    });

  if (existingAdmin) {
    console.log(
      "Platform admin already exists"
    );

    process.exit(0);
  }

  await PlatformAdminModel.create({
    userId: user._id,
    role: "SUPER_ADMIN",
    isActive: true,
  });

  console.log(
    `Platform admin created: ${user.email}`
  );

  process.exit(0);
}

run().catch((error) => {
  console.error(
    "Failed to create platform admin:",
    error
  );

  process.exit(1);
});
