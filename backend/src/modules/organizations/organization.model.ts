import mongoose, {
  Schema,
  type Model,
} from "mongoose";

import type {
  Organization,
  OrganizationStatus,
} from "./organization.types";

const organizationSchema =
  new Schema<Organization>(
    {
      name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 120,
      },

      slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
      },

      createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      status: {
        type: String,
        enum: [
          "ACTIVE",
          "SUSPENDED",
        ] satisfies OrganizationStatus[],
        default: "ACTIVE",
      },
    },
    {
      timestamps: true,
    }
  );

export const OrganizationModel: Model<Organization> =
  mongoose.model<Organization>(
    "Organization",
    organizationSchema
  );