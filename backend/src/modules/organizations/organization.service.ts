import mongoose from "mongoose";

import { AppError } from "../../core/errors/AppError";

import { OrganizationModel } from "./organization.model";
import { MembershipModel } from "../memberships/membership.model";
import { UserModel } from "../users/user.model";
import { RoleModel } from "../rbac/role.model";
import { getOrganizationSubscription } from "../billing/billing.service";

import type { SystemRole } from "../rbac/role.types";

export async function getMyOrganizations(userId: string) {
  const memberships = await MembershipModel.find({
    userId,
    status: "ACTIVE",
  }).populate("organizationId");

  return memberships.flatMap((membership) => {
    const organization = membership.organizationId as unknown as {
      _id?: mongoose.Types.ObjectId;
      name?: string;
      slug?: string;
    } | null;

    if (!organization?._id) {
      return [];
    }

    return [
      {
        id: organization._id.toString(),
        name: organization.name ?? "",
        slug: organization.slug ?? "",
        roleIds: membership.roleIds.map((roleId) =>
          roleId.toString()
        ),
      },
    ];
  });
}

export async function getCurrentOrganization(
  organizationId: string
) {
  const organization = await OrganizationModel.findById(
    organizationId
  );

  if (!organization) {
    throw new AppError("Organization not found", 404);
  }

  const [memberCount, subscription] = await Promise.all([
    MembershipModel.countDocuments({
      organizationId,
      status: "ACTIVE",
    }),
    getOrganizationSubscription(organizationId),
  ]);

  return {
    id: organization._id.toString(),
    name: organization.name,
    slug: organization.slug,
    createdAt: organization.createdAt,
    memberCount,
    subscription,
  };
}

export async function getOrganizationMembers(
  organizationId: string
) {
  const memberships = await MembershipModel.find({
    organizationId,
    status: "ACTIVE",
  })
    .populate("userId")
    .populate("roleIds");

  return memberships.flatMap((membership) => {
    const user = membership.userId as unknown as {
      _id?: mongoose.Types.ObjectId;
      name?: string;
      email?: string;
      avatar?: string | null;
      status?: string;
    } | null;

    if (!user?._id) {
      return [];
    }

    const roles = (
      membership.roleIds as unknown as Array<{
        name?: SystemRole;
      }>
    )
      .map((role) => role.name)
      .filter((name): name is SystemRole => Boolean(name));

    return [
      {
        id: user._id.toString(),
        name: user.name ?? "",
        email: user.email ?? "",
        avatar: user.avatar ?? null,
        status: user.status ?? "ACTIVE",
        roles,
        membershipId: membership._id.toString(),
        joinedAt: membership.createdAt,
      },
    ];
  });
}

export async function updateOrganization(
  organizationId: string,
  name: string
) {
  const organization = await OrganizationModel.findByIdAndUpdate(
    organizationId,
    { name },
    { new: true }
  );

  if (!organization) {
    throw new AppError("Organization not found", 404);
  }

  return {
    id: organization._id.toString(),
    name: organization.name,
    slug: organization.slug,
  };
}

export async function getAssignableRoles() {
  const roles = await RoleModel.find({
    isSystemRole: true,
  }).select("name description");

  return roles.map((role) => ({
    name: role.name,
    description: role.description,
  }));
}
