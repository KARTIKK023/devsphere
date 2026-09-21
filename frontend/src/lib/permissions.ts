import type { SystemRole } from "@/types/auth";

export const ROLE_PRIORITY: SystemRole[] = [
  "OWNER",
  "MANAGER",
  "DEVELOPER",
];

export function getPrimaryRole(
  roles: SystemRole[]
): SystemRole | null {
  return (
    ROLE_PRIORITY.find((role) => roles.includes(role)) ??
    null
  );
}

export function hasPermission(
  permissions: string[],
  permission?: string
): boolean {
  if (!permission) {
    return true;
  }

  return permissions.includes(permission);
}

export function hasAnyPermission(
  permissions: string[],
  required?: string[]
): boolean {
  if (!required || required.length === 0) {
    return true;
  }

  return required.some((permission) =>
    permissions.includes(permission)
  );
}

export function isOwner(roles: SystemRole[]): boolean {
  return roles.includes("OWNER");
}

export const ROLE_LABELS: Record<SystemRole, string> = {
  OWNER: "Owner",
  MANAGER: "Manager",
  DEVELOPER: "Developer",
};
