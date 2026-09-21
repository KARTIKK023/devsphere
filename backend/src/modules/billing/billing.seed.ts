import {
  SubscriptionPlanModel,
} from "./plan.model";

const freeFeatures = [
  "projects",
  "repositories",
  "architecture",
];

const premiumFeatures = [
  "projects",
  "repositories",
  "architecture",
  "deployments",
  "meetings",
  "decisions",
  "ai-agent",
];

export async function seedBilling() {
  await SubscriptionPlanModel.findOneAndUpdate(
    { code: "FREE" },
    {
      code: "FREE",
      name: "Free",
      description:
        "Basic DevSphere workspace",
      features: freeFeatures,
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );

  await SubscriptionPlanModel.findOneAndUpdate(
    { code: "PREMIUM" },
    {
      code: "PREMIUM",
      name: "Premium",
      description:
        "Full DevSphere development workspace",
      features: premiumFeatures,
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );

  console.log(
    "Subscription plans seeded"
  );
}