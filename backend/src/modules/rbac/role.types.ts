import type { Types } from "mongoose";

export type SystemRole =
  | "OWNER"
  | "MANAGER"
  | "DEVELOPER";

export interface Role {
  _id: Types.ObjectId;

  name: SystemRole;

  description: string;

  permissions: Types.ObjectId[];

  isSystemRole: boolean;

  createdAt: Date;

  updatedAt: Date;
}