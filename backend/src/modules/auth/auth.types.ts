import type { Types } from "mongoose";

export interface AuthTokenPayload {
  userId: string;
  sessionId: string;
  organizationId: string;
}

export type OAuthProvider =
  | "GOOGLE"
  | "GITHUB";

export interface OAuthProfile {
  provider: OAuthProvider;
  providerId: string;
  email: string;
  name: string;
  avatar?: string | null;
  login?: string | null;
  accessToken?: string | undefined;
  scope?: string | undefined;
}