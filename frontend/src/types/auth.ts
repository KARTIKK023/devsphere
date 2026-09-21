export type SystemRole =
  | "OWNER"
  | "MANAGER"
  | "DEVELOPER";

export type PlatformRole =
  | "SUPER_ADMIN"
  | "SUPPORT_ADMIN";

export type UserStatus =
  | "ACTIVE"
  | "SUSPENDED"
  | "PENDING";

export type OAuthProviders = {
  google: boolean;
  github: boolean;
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  status?: UserStatus;
  emailVerified?: boolean;
  providers?: OAuthProviders;
  githubConnected?: boolean;
};

export type Organization = {
  id: string;
  name: string;
  slug: string;
  roleIds?: string[];
  memberCount?: number;
  createdAt?: string;
};

export type PlanCode = "FREE" | "PREMIUM";

export type Subscription = {
  id: string;
  status: string;
  startedAt: string;
  expiresAt: string | null;
  plan: {
    id: string;
    code: PlanCode;
    name: string;
    description: string;
    features: string[];
  };
};

export type AuthContext = {
  user: User;
  organization: Organization;
  organizations: Organization[];
  roles: SystemRole[];
  permissions: string[];
  subscription: Subscription | null;
  isPlatformAdmin?: boolean;
};

export type LoginResponse = AuthContext & {
  accessToken: string;
};

export type SignupResponse = AuthContext & {
  accessToken: string;
};

export type SessionDevice = {
  browser: string;
  os: string;
  deviceType: "desktop" | "mobile" | "tablet";
};

export type SessionSummary = {
  id: string;
  isCurrent: boolean;
  device: SessionDevice | null;
  lastActiveAt: string | null;
  startedAt: string;
  createdAt: string;
  expiresAt: string;
  organization: {
    id: string;
    name: string;
    slug: string;
  } | null;
};

export type Member = {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  status: string;
  roles: SystemRole[];
  membershipId: string;
  joinedAt: string;
};

export type AssignableRole = {
  name: SystemRole;
  description: string;
};

/* Standard backend response envelope. */
export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiMessage = {
  success: true;
  message: string;
};
