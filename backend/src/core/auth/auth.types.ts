import type { Types } from "mongoose";

import type { SystemRole } from "../../modules/rbac/role.types";

export interface AuthContext {
  userId: Types.ObjectId;
  sessionId: Types.ObjectId;

  organizationId: Types.ObjectId;

  roles: SystemRole[];

  permissions: string[];
}