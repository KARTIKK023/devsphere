import type { ReactNode } from "react";

import { usePermissions } from "@/hooks/use-permissions";

import type { SystemRole } from "@/types/auth";

type CanProps = {
  permission?: string;
  anyOf?: string[];
  role?: SystemRole;
  platformAdmin?: boolean;
  fallback?: ReactNode;
  children: ReactNode;
};

export function Can({
  permission,
  anyOf,
  role,
  platformAdmin,
  fallback = null,
  children,
}: CanProps) {
  const { can, canAny, roles, isPlatformAdmin } =
    usePermissions();

  let allowed = true;

  if (allowed && permission) {
    allowed = can(permission);
  }

  if (allowed && anyOf) {
    allowed = canAny(anyOf);
  }

  if (allowed && role) {
    allowed = roles.includes(role);
  }

  if (allowed && platformAdmin) {
    allowed = isPlatformAdmin;
  }

  return <>{allowed ? children : fallback}</>;
}
