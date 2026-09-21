import mongoose, {
  Schema,
  type Model,
} from "mongoose";

import type { Architecture } from "./architecture.types";

const architectureSchema = new Schema<Architecture>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },

    repositoryId: {
      type: Schema.Types.ObjectId,
      ref: "Repository",
      default: null,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },

    document: {
      type: Schema.Types.Mixed,
      default: () => ({
        elements: [],
        appState: {},
        files: {},
      }),
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

architectureSchema.index({
  organizationId: 1,
  updatedAt: -1,
});

export const ArchitectureModel: Model<Architecture> =
  mongoose.model<Architecture>(
    "Architecture",
    architectureSchema
  );
