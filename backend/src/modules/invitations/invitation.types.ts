import type { Types } from "mongoose";

import type { SystemRole } from "../rbac/role.types";

export type InvitationStatus =
  | "PENDING"
  | "ACCEPTED"
  | "EXPIRED"
  | "REVOKED";

export interface Invitation {
  _id: Types.ObjectId;

  organizationId: Types.ObjectId;

  email: string;

  roleId: Types.ObjectId;

  invitedBy: Types.ObjectId;

  tokenHash: string;

  status: InvitationStatus;

  expiresAt: Date;

  acceptedAt?: Date | null;

  createdAt: Date;
  updatedAt: Date;
}