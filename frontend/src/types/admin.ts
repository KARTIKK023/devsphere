export type AdminOrganizationStatus =
  | "ACTIVE"
  | "SUSPENDED";

export type AdminUserStatus =
  | "ACTIVE"
  | "SUSPENDED"
  | "PENDING";

export type AdminProvider =
  | "EMAIL"
  | "GOOGLE"
  | "GITHUB";

export type AdminOrganization = {
  id: string;
  name: string;
  slug: string;
  status: AdminOrganizationStatus;
  createdAt: string;
  memberCount: number;
  plan: string | null;
  planName: string | null;
  owner: {
    id: string;
    name: string;
    email: string;
  } | null;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  status: AdminUserStatus;
  emailVerified: boolean;
  createdAt: string;
  providers: AdminProvider[];
  isPlatformAdmin: boolean;
};

export type RecentOrganization = {
  id: string;
  name: string;
  status: AdminOrganizationStatus;
  createdAt: string;
};

export type RecentUser = {
  id: string;
  name: string;
  email: string;
  status: AdminUserStatus;
  createdAt: string;
};

export type PlatformStats = {
  organizations: {
    total: number;
    active: number;
    suspended: number;
    new30d: number;
  };
  users: {
    total: number;
    active: number;
    suspended: number;
    new30d: number;
  };
  memberships: {
    active: number;
  };
  subscriptions: {
    total: number;
    premium: number;
    free: number;
  };
  recentOrganizations: RecentOrganization[];
  recentUsers: RecentUser[];
};