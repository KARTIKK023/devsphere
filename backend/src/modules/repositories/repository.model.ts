import mongoose, {
  Schema,
  type Model,
} from "mongoose";

import type {
  Repository,
  RepositoryStatus,
} from "./repository.types";

const repositorySchema = new Schema<Repository>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    connectedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    provider: {
      type: String,
      enum: ["GITHUB"],
      default: "GITHUB",
    },

    githubRepoId: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    owner: {
      type: String,
      required: true,
      trim: true,
    },

    private: {
      type: Boolean,
      default: false,
    },

    defaultBranch: {
      type: String,
      default: "main",
    },

    language: {
      type: String,
      default: null,
    },

    description: {
      type: String,
      default: null,
    },

    htmlUrl: {
      type: String,
      required: true,
    },

    cloneUrl: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ["CONNECTED", "ERROR"] satisfies RepositoryStatus[],
      default: "CONNECTED",
    },

    lastSyncedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

repositorySchema.index(
  { organizationId: 1, githubRepoId: 1 },
  { unique: true }
);

export const RepositoryModel: Model<Repository> =
  mongoose.model<Repository>(
    "Repository",
    repositorySchema
  );
