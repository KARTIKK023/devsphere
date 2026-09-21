import { AppError } from "../../core/errors/AppError";
import {
  generateSecureToken,
  hashToken,
} from "../../core/security/token";

import { UserModel } from "../users/user.model";
import { RoleModel } from "../rbac/role.model";
import {
  MembershipModel,
} from "../memberships/membership.model";

import {
  InvitationModel,
} from "./invitation.model";

import type {
  SystemRole,
} from "../rbac/role.types";

export async function createInvitation(
  organizationId: string,
  invitedBy: string,
  email: string,
  roleName: SystemRole
) {
  const existingUser =
    await UserModel.findOne({
      email,
    });

  if (existingUser) {
    const existingMembership =
      await MembershipModel.findOne({
        userId: existingUser._id,
        organizationId,
      });

    if (existingMembership) {
      throw new AppError(
        "User is already a member of this organization",
        409
      );
    }
  }

  const role =
    await RoleModel.findOne({
      name: roleName,
      isSystemRole: true,
    });

  if (!role) {
    throw new AppError(
      "Requested role does not exist",
      400
    );
  }

  const existingInvitation =
    await InvitationModel.findOne({
      organizationId,
      email,
      status: "PENDING",
      expiresAt: {
        $gt: new Date(),
      },
    });

  if (existingInvitation) {
    throw new AppError(
      "A pending invitation already exists",
      409
    );
  }

  const token =
    generateSecureToken();

  const tokenHash =
    hashToken(token);

  const expiresAt = new Date(
    Date.now() +
      7 * 24 * 60 * 60 * 1000
  );

  const invitation =
    await InvitationModel.create({
      organizationId,
      email,
      roleId: role._id,
      invitedBy,
      tokenHash,
      status: "PENDING",
      expiresAt,
    });

  /*
   * Email sending will be added later.
   *
   * For development we return the token.
   */
  return {
    invitationId:
      invitation._id,

    email,

    role: role.name,

    expiresAt,

    token,
  };
};

export async function acceptInvitation(
  token: string,
  userId: string
) {
  const tokenHash =
    hashToken(token);

  const invitation =
    await InvitationModel.findOne({
      tokenHash,
      status: "PENDING",
    });

  if (!invitation) {
    throw new AppError(
      "Invalid or revoked invitation",
      400
    );
  }

  if (
    invitation.expiresAt.getTime() <
    Date.now()
  ) {
    invitation.status = "EXPIRED";

    await invitation.save();

    throw new AppError(
      "Invitation has expired",
      400
    );
  }

  const user =
    await UserModel.findById(userId);

  if (!user) {
    throw new AppError(
      "User not found",
      404
    );
  }

  if (
    user.email.toLowerCase() !==
    invitation.email.toLowerCase()
  ) {
    throw new AppError(
      "Invitation email does not match the authenticated user",
      403
    );
  }

  const existingMembership =
    await MembershipModel.findOne({
      userId,
      organizationId:
        invitation.organizationId,
    });

  if (existingMembership) {
    throw new AppError(
      "User is already a member of this organization",
      409
    );
  }

  await MembershipModel.create({
    userId,
    organizationId:
      invitation.organizationId,
    roleIds: [invitation.roleId],
    status: "ACTIVE",
  });

  invitation.status = "ACCEPTED";
  invitation.acceptedAt = new Date();

  await invitation.save();

  return {
    organizationId:
      invitation.organizationId,
    roleId: invitation.roleId,
  };
}