import mongoose, {
  Schema,
  type Model,
} from "mongoose";

import type { Session } from "./session.types";

const sessionSchema = new Schema<Session>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    tokenVersion: {
      type: Number,
      default: 0,
    },

    device: {
      type: new Schema(
        {
          browser: { type: String, default: "" },
          os: { type: String, default: "" },
          deviceType: {
            type: String,
            enum: ["desktop", "mobile", "tablet"],
            default: "desktop",
          },
        },
        { _id: false }
      ),
      default: null,
    },

    lastActiveAt: {
      type: Date,
      default: null,
      index: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },

  {
    timestamps: true,
  }
);

sessionSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

export const SessionModel: Model<Session> =
  mongoose.model<Session>(
    "Session",
    sessionSchema
  );