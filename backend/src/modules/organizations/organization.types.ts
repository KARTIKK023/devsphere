import type { Types } from "mongoose";

export type OrganizationStatus =
  | "ACTIVE"
  | "SUSPENDED";

export interface Organization {
  _id: Types.ObjectId;

  name: string;

  slug: string;

  createdBy: Types.ObjectId;

  status: OrganizationStatus;

  createdAt: Date;

  updatedAt: Date;
}