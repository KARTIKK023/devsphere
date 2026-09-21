import { AppError } from "../../core/errors/AppError";

import { SubscriptionModel } from "./subscription.model";
import { SubscriptionPlanModel } from "./plan.model";

export async function getOrganizationSubscription(
  organizationId: string
) {
  const subscription = await SubscriptionModel.findOne({
    organizationId,
    status: {
      $in: ["ACTIVE", "TRIALING"],
    },
  });

  if (!subscription) {
    return null;
  }

  const plan = await SubscriptionPlanModel.findById(
    subscription.planId
  );

  if (!plan) {
    throw new AppError("Subscription plan not found", 500);
  }

  return {
    id: subscription._id.toString(),
    status: subscription.status,
    startedAt: subscription.startedAt,
    expiresAt: subscription.expiresAt ?? null,
    plan: {
      id: plan._id.toString(),
      code: plan.code,
      name: plan.name,
      description: plan.description,
      features: plan.features,
    },
  };
}
