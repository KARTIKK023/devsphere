import type { Types } from "mongoose";

export type RepositoryStatus = "CONNECTED" | "ERROR";

export type RepositoryProvider = "GITHUB";

export interface Repository {
  _id: Types.ObjectId;

  organizationId: Types.ObjectId;

  connectedBy: Types.ObjectId;

  provider: RepositoryProvider;

  githubRepoId: string;

  name: string;

  fullName: string;

  owner: string;

  private: boolean;

  defaultBranch: string;

  language?: string | null;

  description?: string | null;

  htmlUrl: string;

  cloneUrl?: string | null;

  status: RepositoryStatus;

  lastSyncedAt?: Date | null;

  createdAt: Date;

  updatedAt: Date;
}
