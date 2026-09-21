import {
  getPrimaryRole,
  hasAnyPermission,
  hasPermission,
  isOwner,
} from "@/lib/permissions";

import { useAuthStore } from "@/store/auth.store";

export function usePermissions() {
  const permissions = useAuthStore(
    (state) => state.permissions
  );
  const roles = useAuthStore((state) => state.roles);
  const isPlatformAdmin = useAuthStore(
    (state) => state.isPlatformAdmin
  );

  return {
    permissions,
    roles,
    isPlatformAdmin,
    primaryRole: getPrimaryRole(roles),
    isOwner: isOwner(roles),
    can: (permission?: string) =>
      hasPermission(permissions, permission),
    canAny: (required?: string[]) =>
      hasAnyPermission(permissions, required),
  };
}
