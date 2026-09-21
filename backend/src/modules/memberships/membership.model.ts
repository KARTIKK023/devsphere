import mongoose, {
  Schema,
  type Model,
} from "mongoose";

import type {
  Membership,
  MembershipStatus,
} from "./membership.types";

const membershipSchema =
  new Schema<Membership>(
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      organizationId: {
        type: Schema.Types.ObjectId,
        ref: "Organization",
        required: true,
        index: true,
      },

      roleIds: [
        {
          type: Schema.Types.ObjectId,
          ref: "Role",
        },
      ],

      status: {
        type: String,
        enum: [
          "ACTIVE",
          "INVITED",
          "SUSPENDED",
        ] satisfies MembershipStatus[],
        default: "ACTIVE",
      },
    },
    {
      timestamps: true,
    }
  );

membershipSchema.index(
  {
    userId: 1,
    organizationId: 1,
  },
  {
    unique: true,
  }
);

export const MembershipModel: Model<Membership> =
  mongoose.model<Membership>(
    "Membership",
    membershipSchema
  );