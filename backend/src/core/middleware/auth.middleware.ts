import type {
  Request,
  Response,
  NextFunction,
} from "express";

import mongoose from "mongoose";

import { AppError } from "../errors/AppError";
import { verifyAccessToken } from "../security/jwt";

import { SessionModel } from "../../modules/sessions/session.model";
import { UserModel } from "../../modules/users/user.model";
import { MembershipModel } from "../../modules/memberships/membership.model";
import { RoleModel } from "../../modules/rbac/role.model";
import { PermissionModel } from "../../modules/rbac/permission.model";

export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const authHeader =
      req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      throw new AppError(
        "Authentication required",
        401
      );
    }

    const token =
      authHeader.substring(7);

    const payload =
      verifyAccessToken(token);

    if (
      !mongoose.Types.ObjectId.isValid(
        payload.userId
      ) ||
      !mongoose.Types.ObjectId.isValid(
        payload.sessionId
      )
    ) {
      throw new AppError(
        "Invalid authentication token",
        401
      );
    }

    const session =
      await SessionModel.findOne({
        _id: payload.sessionId,
        userId: payload.userId,
        organizationId: payload.organizationId,
      });

    if (!session) {
      throw new AppError(
        "Session expired or revoked",
        401
      );
    }

    if (
      session.expiresAt.getTime() <
      Date.now()
    ) {
      throw new AppError(
        "Session expired",
        401
      );
    }

    const user =
      await UserModel.findById(
        payload.userId
      );

    if (!user) {
      throw new AppError(
        "User not found",
        401
      );
    }

    if (user.status !== "ACTIVE") {
      throw new AppError(
        "User account is not active",
        403
      );
    }

    const membership =
      await MembershipModel.findOne({
        userId: user._id,
        organizationId: payload.organizationId,
        status: "ACTIVE",
      });

    if (!membership) {
      throw new AppError(
        "No active organization membership",
        403
      );
    }

    const roles =
      await RoleModel.find({
        _id: {
          $in: membership.roleIds,
        },
      });

    const roleNames =
      roles.map((role) => role.name);

    const permissionIds =
      roles.flatMap(
        (role) => role.permissions
      );

    const permissions =
      await PermissionModel.find({
        _id: {
          $in: permissionIds,
        },
      });

    const permissionNames =
      permissions.map(
        (permission) => permission.name
      );

    req.auth = {
      userId: user._id,
      sessionId: session._id,

      organizationId:
        membership.organizationId,

      roles: roleNames,

      permissions: permissionNames,
    };

    next();
  } catch (error) {
    next(error);
  }
}