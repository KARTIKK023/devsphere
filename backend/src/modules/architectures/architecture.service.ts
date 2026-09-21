import mongoose from "mongoose";

import { AppError } from "../../core/errors/AppError";

import { ArchitectureModel } from "./architecture.model";
import { RepositoryModel } from "../repositories/repository.model";

import type { Architecture } from "./architecture.types";
import type {
  CreateArchitectureInput,
  UpdateArchitectureInput,
} from "./architecture.validation";

type PopulatedArchitecture = Omit<
  Architecture,
  "repositoryId" | "createdBy"
> & {
  repositoryId?: {
    _id?: mongoose.Types.ObjectId;
    name?: string;
    fullName?: string;
  } | null;
  createdBy?: {
    _id?: mongoose.Types.ObjectId;
    name?: string;
  } | null;
};

function serializeArchitecture(
  architecture: PopulatedArchitecture
) {
  return {
    id: architecture._id.toString(),
    title: architecture.title,
    description: architecture.description,
    repositoryId: architecture.repositoryId?._id
      ? architecture.repositoryId._id.toString()
      : null,
    repositoryName:
      architecture.repositoryId?.name ?? null,
    repositoryFullName:
      architecture.repositoryId?.fullName ?? null,
    document: architecture.document,
    createdBy: architecture.createdBy?._id
      ? {
          id: architecture.createdBy._id.toString(),
          name: architecture.createdBy.name ?? "",
        }
      : null,
    createdAt: architecture.createdAt,
    updatedAt: architecture.updatedAt,
  };
}

async function assertRepositoryInOrganization(
  organizationId: string,
  repositoryId: string
) {
  if (!mongoose.Types.ObjectId.isValid(repositoryId)) {
    throw new AppError("Invalid repository ID", 400);
  }

  const repository = await RepositoryModel.findOne({
    _id: repositoryId,
    organizationId,
  });

  if (!repository) {
    throw new AppError("Repository not found", 404);
  }
}

async function findArchitecture(
  organizationId: string,
  architectureId: string
) {
  if (!mongoose.Types.ObjectId.isValid(architectureId)) {
    throw new AppError("Invalid architecture ID", 400);
  }

  const architecture = await ArchitectureModel.findOne({
    _id: architectureId,
    organizationId,
  })
    .populate("repositoryId")
    .populate("createdBy", "name email");

  if (!architecture) {
    throw new AppError("Architecture not found", 404);
  }

  return architecture as unknown as PopulatedArchitecture;
}

export async function listArchitectures(
  organizationId: string
) {
  const architectures = await ArchitectureModel.find({
    organizationId,
  })
    .populate("repositoryId")
    .populate("createdBy", "name email")
    .sort({ updatedAt: -1 });

  return architectures.map((architecture) =>
    serializeArchitecture(
      architecture as unknown as PopulatedArchitecture
    )
  );
}

export async function createArchitecture(
  organizationId: string,
  userId: string,
  input: CreateArchitectureInput
) {
  if (input.repositoryId) {
    await assertRepositoryInOrganization(
      organizationId,
      input.repositoryId
    );
  }

  const architecture = await ArchitectureModel.create({
    organizationId,
    repositoryId: input.repositoryId ?? null,
    title: input.title,
    description: input.description ?? "",
    document: {
      elements: [],
      appState: {},
      files: {},
    },
    createdBy: userId,
  });

  const populated = await architecture.populate([
    { path: "repositoryId" },
    { path: "createdBy", select: "name email" },
  ]);

  return serializeArchitecture(
    populated as unknown as PopulatedArchitecture
  );
}

export async function getArchitecture(
  organizationId: string,
  architectureId: string
) {
  const architecture = await findArchitecture(
    organizationId,
    architectureId
  );

  return serializeArchitecture(architecture);
}

export async function updateArchitecture(
  organizationId: string,
  architectureId: string,
  input: UpdateArchitectureInput
) {
  if (!mongoose.Types.ObjectId.isValid(architectureId)) {
    throw new AppError("Invalid architecture ID", 400);
  }

  if (input.repositoryId) {
    await assertRepositoryInOrganization(
      organizationId,
      input.repositoryId
    );
  }

  const architecture = await ArchitectureModel.findOne({
    _id: architectureId,
    organizationId,
  });

  if (!architecture) {
    throw new AppError("Architecture not found", 404);
  }

  if (input.title !== undefined) {
    architecture.title = input.title;
  }

  if (input.description !== undefined) {
    architecture.description = input.description;
  }

  if (input.repositoryId !== undefined) {
    architecture.repositoryId = input.repositoryId
      ? new mongoose.Types.ObjectId(input.repositoryId)
      : null;
  }

  if (input.document !== undefined) {
    architecture.document = input.document;
  }

  await architecture.save();

  const populated = await architecture.populate([
    { path: "repositoryId" },
    { path: "createdBy", select: "name email" },
  ]);

  return serializeArchitecture(
    populated as unknown as PopulatedArchitecture
  );
}

export async function deleteArchitecture(
  organizationId: string,
  architectureId: string
) {
  if (!mongoose.Types.ObjectId.isValid(architectureId)) {
    throw new AppError("Invalid architecture ID", 400);
  }

  const result = await ArchitectureModel.deleteOne({
    _id: architectureId,
    organizationId,
  });

  if (result.deletedCount === 0) {
    throw new AppError("Architecture not found", 404);
  }

  return { deleted: true };
}
