export type ArchitectureDocument = {
  elements: unknown[];
  appState: Record<string, unknown>;
  files: Record<string, unknown>;
};

export type Architecture = {
  id: string;
  title: string;
  description: string;
  repositoryId: string | null;
  repositoryName: string | null;
  repositoryFullName: string | null;
  document: ArchitectureDocument;
  createdBy: {
    id: string;
    name: string;
  } | null;
  createdAt: string;
  updatedAt: string;
};
