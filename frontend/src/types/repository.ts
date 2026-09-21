export type RepositoryFile = {
  name: string;
  type: "file" | "folder";
  path: string;
  children?: RepositoryFile[];
};

export type RepositoryFileContent = {
  path: string;
  language: string;
  content: string;
  size?: number;
};

export type Repository = {
  id: string;
  name: string;
  fullName: string;
  owner: string;
  private: boolean;
  defaultBranch: string;
  language: string | null;
  description: string | null;
  htmlUrl: string;
  cloneUrl: string | null;
  provider: "GITHUB";
  status: "CONNECTED" | "ERROR";
  lastSyncedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type GithubRepository = {
  id: string;
  name: string;
  fullName: string;
  owner: string;
  private: boolean;
  defaultBranch: string;
  language: string | null;
  description: string | null;
  htmlUrl: string;
  stars: number;
  updatedAt: string;
};

export type RepositoryTreeEntry = {
  path: string;
  type: "file" | "folder";
  size: number | null;
};

export type RepositoryTree = {
  ref: string;
  truncated: boolean;
  files: RepositoryTreeEntry[];
};
