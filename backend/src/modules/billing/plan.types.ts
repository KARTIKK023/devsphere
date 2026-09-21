import type { Types } from "mongoose";

export type PlanCode =
  | "FREE"
  | "PREMIUM";

export interface SubscriptionPlan {
  _id: Types.ObjectId;

  code: PlanCode;

  name: string;

  description: string;

  features: string[];

  createdAt: Date;
  updatedAt: Date;
}