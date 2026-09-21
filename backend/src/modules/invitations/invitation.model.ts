import mongoose, {
  Schema,
  type Model,
} from "mongoose";

import type {
  Invitation,
  InvitationStatus,
} from "./invitation.types";

const invitationSchema =
  new Schema<Invitation>(
    {
      organizationId: {
        type: Schema.Types.ObjectId,
        ref: "Organization",
        required: true,
        index: true,
      },

      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true,
      },

      roleId: {
        type: Schema.Types.ObjectId,
        ref: "Role",
        required: true,
      },

      invitedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      tokenHash: {
        type: String,
        required: true,
        unique: true,
      },

      status: {
        type: String,
        required: true,
        enum: [
          "PENDING",
          "ACCEPTED",
          "EXPIRED",
          "REVOKED",
        ] satisfies InvitationStatus[],
        default: "PENDING",
      },

      expiresAt: {
        type: Date,
        required: true,
        index: true,
      },

      acceptedAt: {
        type: Date,
        default: null,
      },
    },

    {
      timestamps: true,
    }
  );

invitationSchema.index(
  {
    organizationId: 1,
    email: 1,
    status: 1,
  }
);

export const InvitationModel:
  Model<Invitation> =
  mongoose.model<Invitation>(
    "Invitation",
    invitationSchema
  );