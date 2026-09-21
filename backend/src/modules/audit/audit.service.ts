import type {
  Types,
} from "mongoose";

import {
  AuditLogModel,
} from "./audit.model";

import type {
  AuditAction,
} from "./audit.types";

interface CreateAuditLogInput {
  organizationId?: Types.ObjectId | null;

  userId?: Types.ObjectId | null;

  action: AuditAction;

  resource?: string | null;

  resourceId?: Types.ObjectId | null;

  metadata?: Record<string, unknown>;

  ipAddress?: string | null;

  userAgent?: string | null;
}

export async function createAuditLog(
  input: CreateAuditLogInput
) {
  return AuditLogModel.create(input);
}