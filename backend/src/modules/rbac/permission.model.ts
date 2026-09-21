import mongoose, {
  Schema,
  type Model,
} from "mongoose";

import type { Permission } from "./permission.types";

const permissionSchema =
  new Schema<Permission>(
    {
      name: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },

      description: {
        type: String,
        required: true,
        trim: true,
      },

      resource: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
      },

      action: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
      },
    },
    {
      timestamps: true,
    }
  );

permissionSchema.index({
  resource: 1,
  action: 1,
});

export const PermissionModel: Model<Permission> =
  mongoose.model<Permission>(
    "Permission",
    permissionSchema
  );