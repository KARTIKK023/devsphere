import mongoose, {
  Schema,
  type Model,
} from "mongoose";

import type {
  User,
  UserStatus,
} from "./user.types";

const userSchema = new Schema<User>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    avatar: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: [
        "ACTIVE",
        "SUSPENDED",
        "PENDING",
      ] satisfies UserStatus[],
      default: "ACTIVE",
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    googleId: {
      type: String,
      default: undefined,
      unique: true,
      sparse: true,
    },

    githubId: {
      type: String,
      default: undefined,
      unique: true,
      sparse: true,
    },

    githubLogin: {
      type: String,
      default: null,
    },

    githubAccessToken: {
      type: String,
      default: null,
    },

    githubTokenScopes: {
      type: [String],
      default: [],
    },

    githubConnectedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel: Model<User> =
  mongoose.model<User>("User", userSchema);