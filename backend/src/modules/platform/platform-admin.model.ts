import mongoose, {
  Schema,
  type Model,
} from "mongoose";

import type {
  PlatformAdmin,
  PlatformRole,
} from "./platform-admin.types";

const platformAdminSchema =
  new Schema<PlatformAdmin>(
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
        index: true,
      },

      role: {
        type: String,
        required: true,
        enum: [
          "SUPER_ADMIN",
          "SUPPORT_ADMIN",
        ] satisfies PlatformRole[],
      },

      isActive: {
        type: Boolean,
        default: true,
      },
    },

    {
      timestamps: true,
    }
  );

export const PlatformAdminModel:
  Model<PlatformAdmin> =
  mongoose.model<PlatformAdmin>(
    "PlatformAdmin",
    platformAdminSchema
  );