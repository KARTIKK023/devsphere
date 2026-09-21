import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { AppError } from "../errors/AppError";

import {
  SubscriptionModel,
} from "../../modules/billing/subscription.model";

import {
  SubscriptionPlanModel,
} from "../../modules/billing/plan.model";

export function requireEntitlement(
  feature: string
) {
  return async (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.auth) {
        return next(
          new AppError(
            "Authentication required",
            401
          )
        );
      }

      const subscription =
        await SubscriptionModel.findOne({
          organizationId:
            req.auth.organizationId,
          status: {
            $in: ["ACTIVE", "TRIALING"],
          },
        });

      if (!subscription) {
        return next(
          new AppError(
            "No active subscription found",
            403
          )
        );
      }

      const plan =
        await SubscriptionPlanModel.findById(
          subscription.planId
        );

      if (!plan) {
        return next(
          new AppError(
            "Subscription plan not found",
            403
          )
        );
      }

      if (!plan.features.includes(feature)) {
        return next(
          new AppError(
            `The ${feature} feature requires a different subscription plan`,
            403
          )
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}