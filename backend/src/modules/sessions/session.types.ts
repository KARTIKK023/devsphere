import type { Types } from "mongoose";

import type { SessionDevice } from "../../core/security/device";

export interface Session {
  _id: Types.ObjectId;

  userId: Types.ObjectId;

  organizationId: Types.ObjectId;

  tokenVersion: number;

  device?: SessionDevice | undefined;

  lastActiveAt: Date | null;

  expiresAt: Date;

  createdAt: Date;
  updatedAt: Date;
}