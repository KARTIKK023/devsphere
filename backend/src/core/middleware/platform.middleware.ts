import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { AppError } from "../errors/AppError";

import {
  PlatformAdminModel,
} from "../../modules/platform/platform-admin.model";

export function requirePlatformAdmin(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  if (!req.auth) {
    return next(
      new AppError(
        "Authentication required",
        401
      )
    );
  }

  PlatformAdminModel.findOne({
    userId: req.auth.userId,
    isActive: true,
  })
    .then((admin) => {
      if (!admin) {
        return next(
          new AppError(
            "Platform administrator access required",
            403
          )
        );
      }

      next();
    })
    .catch(next);
}