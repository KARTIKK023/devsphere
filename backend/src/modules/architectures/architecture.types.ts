import type { Types } from "mongoose";

export type ArchitectureDocument = {
  elements: unknown[];
  appState: Record<string, unknown>;
  files: Record<string, unknown>;
};

export interface Architecture {
  _id: Types.ObjectId;

  organizationId: Types.ObjectId;

  repositoryId?: Types.ObjectId | null;

  title: string;

  description: string;

  document: ArchitectureDocument;

  createdBy: Types.ObjectId;

  createdAt: Date;

  updatedAt: Date;
}
