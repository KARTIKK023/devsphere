import type { Types } from "mongoose";

export type PlatformRole =
  | "SUPER_ADMIN"
  | "SUPPORT_ADMIN";

export interface PlatformAdmin {
  _id: Types.ObjectId;

  userId: Types.ObjectId;

  role: PlatformRole;

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}