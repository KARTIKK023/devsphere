import type { Types } from "mongoose";

export interface Permission {
  _id: Types.ObjectId;

  name: string;

  description: string;

  resource: string;

  action: string;

  createdAt: Date;

  updatedAt: Date;
}