import mongoose, {
  Schema,
  type Model,
} from "mongoose";

import type {
  SubscriptionPlan,
  PlanCode,
} from "./plan.types";

const planSchema =
  new Schema<SubscriptionPlan>(
    {
      code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        enum: [
          "FREE",
          "PREMIUM",
        ] satisfies PlanCode[],
      },

      name: {
        type: String,
        required: true,
        trim: true,
      },

      description: {
        type: String,
        required: true,
        trim: true,
      },

      features: [
        {
          type: String,
          trim: true,
          lowercase: true,
        },
      ],
    },

    {
      timestamps: true,
    }
  );

export const SubscriptionPlanModel:
  Model<SubscriptionPlan> =
  mongoose.model<SubscriptionPlan>(
    "SubscriptionPlan",
    planSchema
  );