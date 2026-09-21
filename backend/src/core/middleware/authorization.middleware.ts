import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { AppError } from "../errors/AppError";
import type { SystemRole } from "../../modules/rbac/role.types";

export function requirePermission(
  permission: string
) {
  return (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    if (!req.auth) {
      return next(
        new AppError(
          "Authentication required",
          401
        )
      );
    }

    const hasPermission =
      req.auth.permissions.includes(
        permission
      );

    if (!hasPermission) {
      return next(
        new AppError(
          "You do not have permission to perform this action",
          403
        )
      );
    }

    next();
  };
}

export function requireRole(role: SystemRole) {
  return (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    if (!req.auth) {
      return next(
        new AppError("Authentication required", 401)
      );
    }

    if (!req.auth.roles.includes(role)) {
      return next(
        new AppError(
          "You do not have permission to perform this action",
          403
        )
      );
    }

    next();
  };
}