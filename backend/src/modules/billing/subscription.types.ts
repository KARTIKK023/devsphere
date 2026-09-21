import type { Types } from "mongoose";

export type SubscriptionStatus =
  | "ACTIVE"
  | "CANCELED"
  | "PAST_DUE"
  | "TRIALING";

export interface Subscription {
  _id: Types.ObjectId;

  organizationId: Types.ObjectId;

  planId: Types.ObjectId;

  status: SubscriptionStatus;

  startedAt: Date;

  expiresAt?: Date | null;

  createdAt: Date;
  updatedAt: Date;
}