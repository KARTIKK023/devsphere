import { RoleModel } from "./role.model";
import { PermissionModel } from "./permission.model";

import type { SystemRole } from "./role.types";
import type { Types } from "mongoose";

export async function getRolesAndPermissions(
  roleIds: Types.ObjectId[]
) {
  const roles = await RoleModel.find({
    _id: {
      $in: roleIds,
    },
  });

  const roleNames = roles.map(
    (role) => role.name as SystemRole
  );

  const permissionIds = roles.flatMap(
    (role) => role.permissions
  );

  const permissions = await PermissionModel.find({
    _id: {
      $in: permissionIds,
    },
  });

  return {
    roles: roleNames,
    permissions: permissions.map(
      (permission) => permission.name
    ),
  };
}
