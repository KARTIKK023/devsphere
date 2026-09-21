import type { Types } from "mongoose";

export type UserStatus =
  | "ACTIVE"
  | "SUSPENDED"
  | "PENDING";

export interface User {
  _id: Types.ObjectId;

  name: string;

  email: string;

  passwordHash: string;

  avatar?: string | null;

  status: UserStatus;

  emailVerified: boolean;

  googleId?: string | null;

  githubId?: string | null;

  githubLogin?: string | null;

  /* Encrypted GitHub OAuth access token used for the repository integration. */
  githubAccessToken?: string | null;

  githubTokenScopes?: string[];

  githubConnectedAt?: Date | null;

  createdAt: Date;

  updatedAt: Date;
}