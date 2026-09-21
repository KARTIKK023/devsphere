import mongoose, {
  Schema,
  type Model,
} from "mongoose";

import type { AuditLog } from "./audit.types";

const auditLogSchema =
  new Schema<AuditLog>(
    {
      organizationId: {
        type: Schema.Types.ObjectId,
        ref: "Organization",
        default: null,
        index: true,
      },

      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null,
        index: true,
      },

      action: {
        type: String,
        required: true,
        index: true,
      },

      resource: {
        type: String,
        default: null,
      },

      resourceId: {
        type: Schema.Types.ObjectId,
        default: null,
      },

      metadata: {
        type: Schema.Types.Mixed,
        default: {},
      },

      ipAddress: {
        type: String,
        default: null,
      },

      userAgent: {
        type: String,
        default: null,
      },
    },

    {
      timestamps: {
        createdAt: true,
        updatedAt: false,
      },
    }
  );

export const AuditLogModel: Model<AuditLog> =
  mongoose.model<AuditLog>(
    "AuditLog",
    auditLogSchema
  );