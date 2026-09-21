import type { Request, Response } from "express";

import { sendSuccess } from "../../core/http/response";

import {
  connectRepositorySchema,
  repositoryFileQuerySchema,
  repositoryTreeQuerySchema,
} from "./repository.validation";

import {
  connectRepository,
  disconnectRepository,
  getRepository,
  getRepositoryFile,
  getRepositoryTree,
  listAvailableGithubRepositories,
  listRepositories,
  listRepositoryBranches,
} from "./repository.service";

export async function listAvailableRepositoriesController(
  req: Request,
  res: Response
) {
  const repositories = await listAvailableGithubRepositories(
    req.auth!.userId.toString()
  );

  return sendSuccess(res, { repositories });
}

export async function connectRepositoryController(
  req: Request,
  res: Response
) {
  const input = connectRepositorySchema.parse(req.body);

  const repository = await connectRepository(
    req.auth!.organizationId.toString(),
    req.auth!.userId.toString(),
    input.fullName
  );

  return sendSuccess(res, { repository }, 201);
}

export async function listRepositoriesController(
  req: Request,
  res: Response
) {
  const repositories = await listRepositories(
    req.auth!.organizationId.toString()
  );

  return sendSuccess(res, { repositories });
}

export async function getRepositoryController(
  req: Request,
  res: Response
) {
  const repository = await getRepository(
    req.auth!.organizationId.toString(),
    String(req.params.repositoryId)
  );

  return sendSuccess(res, { repository });
}

export async function disconnectRepositoryController(
  req: Request,
  res: Response
) {
  await disconnectRepository(
    req.auth!.organizationId.toString(),
    String(req.params.repositoryId)
  );

  return sendSuccess(res, { disconnected: true });
}

export async function getRepositoryTreeController(
  req: Request,
  res: Response
) {
  const query = repositoryTreeQuerySchema.parse(req.query);

  const tree = await getRepositoryTree(
    req.auth!.organizationId.toString(),
    String(req.params.repositoryId),
    query.ref
  );

  return sendSuccess(res, tree);
}

export async function getRepositoryFileController(
  req: Request,
  res: Response
) {
  const query = repositoryFileQuerySchema.parse(req.query);

  const file = await getRepositoryFile(
    req.auth!.organizationId.toString(),
    String(req.params.repositoryId),
    query.path,
    query.ref
  );

  return sendSuccess(res, file);
}

export async function listRepositoryBranchesController(
  req: Request,
  res: Response
) {
  const branches = await listRepositoryBranches(
    req.auth!.organizationId.toString(),
    String(req.params.repositoryId)
  );

  return sendSuccess(res, { branches });
}
