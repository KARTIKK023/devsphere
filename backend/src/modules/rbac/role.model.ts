import mongoose, {
  Schema,
  type Model,
} from "mongoose";

import type {
  Role,
  SystemRole,
} from "./role.types";

const roleSchema = new Schema<Role>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      enum: [
        "OWNER",
        "MANAGER",
        "DEVELOPER",
      ] satisfies SystemRole[],
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    permissions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Permission",
      },
    ],

    isSystemRole: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const RoleModel: Model<Role> =
  mongoose.model<Role>("Role", roleSchema);