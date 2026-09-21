import mongoose, {
  Schema,
  type Model,
} from "mongoose";

import type {
  Subscription,
  SubscriptionStatus,
} from "./subscription.types";

const subscriptionSchema =
  new Schema<Subscription>(
    {
      organizationId: {
        type: Schema.Types.ObjectId,
        ref: "Organization",
        required: true,
        unique: true,
        index: true,
      },

      planId: {
        type: Schema.Types.ObjectId,
        ref: "SubscriptionPlan",
        required: true,
      },

      status: {
        type: String,
        required: true,
        enum: [
          "ACTIVE",
          "CANCELED",
          "PAST_DUE",
          "TRIALING",
        ] satisfies SubscriptionStatus[],
      },

      startedAt: {
        type: Date,
        required: true,
      },

      expiresAt: {
        type: Date,
        default: null,
      },
    },

    {
      timestamps: true,
    }
  );

export const SubscriptionModel:
  Model<Subscription> =
  mongoose.model<Subscription>(
    "Subscription",
    subscriptionSchema
  );