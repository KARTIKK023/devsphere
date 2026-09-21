import type { Types } from "mongoose";

export type MembershipStatus =
  | "ACTIVE"
  | "INVITED"
  | "SUSPENDED";

export interface Membership {
  _id: Types.ObjectId;

  userId: Types.ObjectId;

  organizationId: Types.ObjectId;

  roleIds: Types.ObjectId[];

  status: MembershipStatus;

  createdAt: Date;

  updatedAt: Date;
}