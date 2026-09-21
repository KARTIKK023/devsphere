import { create } from "zustand";

import {
  api,
  setUnauthorizedHandler,
} from "@/lib/api";
import {
  deleteMessage,
  getData,
  patchData,
  patchMessage,
  postData,
} from "@/lib/api-client";

import type {
  AuthContext,
  LoginResponse,
  Organization,
  SignupResponse,
  Subscription,
  SystemRole,
  User,
} from "@/types/auth";

const ACCESS_TOKEN_KEY = "devsphere_access_token";

export function getStoredAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function saveAccessToken(token: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

function clearAccessToken(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

type AuthState = {
  user: User | null;
  organization: Organization | null;
  organizations: Organization[];
  roles: SystemRole[];
  permissions: string[];
  subscription: Subscription | null;
  isPlatformAdmin: boolean;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  signup: (
    name: string,
    email: string,
    password: string
  ) => Promise<void>;

  login: (
    email: string,
    password: string
  ) => Promise<void>;

  fetchMe: () => Promise<void>;

  fetchOrganizations: () => Promise<void>;

  switchOrganization: (
    organizationId: string
  ) => Promise<void>;

  updateProfile: (input: {
    name?: string;
    avatar?: string | null;
  }) => Promise<void>;

  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;

  revokeSession: (sessionId: string) => Promise<void>;

  setAccessToken: (token: string) => Promise<void>;

  logout: () => Promise<void>;

  logoutAll: () => Promise<void>;

  clearAuth: () => void;
};

function applyAuthContext(
  data: AuthContext,
  accessToken: string
): Partial<AuthState> {
  return {
    user: data.user,
    organization: data.organization,
    organizations:
      data.organizations ?? [data.organization],
    roles: data.roles ?? [],
    permissions: data.permissions ?? [],
    subscription: data.subscription ?? null,
    isPlatformAdmin: data.isPlatformAdmin ?? false,
    accessToken,
    isAuthenticated: true,
  };
}

const CLEARED_AUTH_STATE: Pick<
  AuthState,
  | "user"
  | "organization"
  | "organizations"
  | "roles"
  | "permissions"
  | "subscription"
  | "isPlatformAdmin"
  | "accessToken"
  | "isAuthenticated"
> = {
  user: null,
  organization: null,
  organizations: [],
  roles: [],
  permissions: [],
  subscription: null,
  isPlatformAdmin: false,
  accessToken: null,
  isAuthenticated: false,
};

const storedToken = getStoredAccessToken();

export const useAuthStore = create<AuthState>((set, get) => ({
  ...CLEARED_AUTH_STATE,

  accessToken: storedToken,
  isAuthenticated: Boolean(storedToken),
  isLoading: false,

  clearAuth: () => {
    clearAccessToken();

    set(CLEARED_AUTH_STATE);
  },

  signup: async (name, email, password) => {
    set({ isLoading: true });

    try {
      const data = await postData<SignupResponse>(
        "/auth/signup",
        { name, email, password }
      );

      saveAccessToken(data.accessToken);

      set(applyAuthContext(data, data.accessToken));
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true });

    try {
      const data = await postData<LoginResponse>(
        "/auth/login",
        { email, password }
      );

      saveAccessToken(data.accessToken);

      set(applyAuthContext(data, data.accessToken));
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMe: async () => {
    const token = get().accessToken;

    if (!token) {
      set(CLEARED_AUTH_STATE);

      return;
    }

    set({ isLoading: true });

    try {
      const data = await getData<AuthContext>(
        "/auth/me"
      );

      set(applyAuthContext(data, token));
    } catch (error) {
      const status = (
        error as {
          response?: { status?: number };
        }
      )?.response?.status;

      if (status === 401) {
        get().clearAuth();
      }

      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchOrganizations: async () => {
    const data = await getData<{
      organizations: Organization[];
    }>("/organizations/mine");

    set({ organizations: data.organizations ?? [] });
  },

  switchOrganization: async (organizationId) => {
    set({ isLoading: true });

    try {
      const data = await postData<LoginResponse>(
        "/auth/switch-organization",
        { organizationId }
      );

      saveAccessToken(data.accessToken);

      set(applyAuthContext(data, data.accessToken));
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfile: async (input) => {
    const data = await patchData<{ user: User }>(
      "/auth/me",
      input
    );

    set({ user: data.user });
  },

  changePassword: async (
    currentPassword,
    newPassword
  ) => {
    await patchMessage("/auth/password", {
      currentPassword,
      newPassword,
    });
  },

  revokeSession: async (sessionId) => {
    await deleteMessage(
      `/auth/sessions/${sessionId}`
    );
  },

  setAccessToken: async (token) => {
    saveAccessToken(token);

    set({ accessToken: token });

    await get().fetchMe();
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      get().clearAuth();
    }
  },

  logoutAll: async () => {
    try {
      await api.post("/auth/logout-all");
    } finally {
      get().clearAuth();
    }
  },
}));

setUnauthorizedHandler(() => {
  useAuthStore.getState().clearAuth();
});
