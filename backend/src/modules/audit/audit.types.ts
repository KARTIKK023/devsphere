import type { Types } from "mongoose";

export type AuditAction =
  | "AUTH_LOGIN"
  | "AUTH_LOGOUT"
  | "AUTH_LOGOUT_ALL"
  | "ORGANIZATION_CREATED"
  | "MEMBER_INVITED"
  | "MEMBER_JOINED"
  | "MEMBER_ROLE_CHANGED"
  | "MEMBER_REMOVED"
  | "RESOURCE_CREATED"
  | "RESOURCE_UPDATED"
  | "RESOURCE_DELETED"
  | "DEPLOYMENT_STARTED"
  | "DEPLOYMENT_COMPLETED"
  | "DEPLOYMENT_FAILED"
  | "AI_AGENT_EXECUTED";

export interface AuditLog {
  _id: Types.ObjectId;

  organizationId?: Types.ObjectId | null;

  userId?: Types.ObjectId | null;

  action: AuditAction;

  resource?: string | null;

  resourceId?: Types.ObjectId | null;

  metadata?: Record<string, unknown>;

  ipAddress?: string | null;

  userAgent?: string | null;

  createdAt: Date;
}