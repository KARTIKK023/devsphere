import type { Request, Response } from "express";

import { sendSuccess } from "../../core/http/response";

import {
  createArchitectureSchema,
  updateArchitectureSchema,
} from "./architecture.validation";

import {
  createArchitecture,
  deleteArchitecture,
  getArchitecture,
  listArchitectures,
  updateArchitecture,
} from "./architecture.service";

export async function listArchitecturesController(
  req: Request,
  res: Response
) {
  const architectures = await listArchitectures(
    req.auth!.organizationId.toString()
  );

  return sendSuccess(res, { architectures });
}

export async function createArchitectureController(
  req: Request,
  res: Response
) {
  const input = createArchitectureSchema.parse(req.body);

  const architecture = await createArchitecture(
    req.auth!.organizationId.toString(),
    req.auth!.userId.toString(),
    input
  );

  return sendSuccess(res, { architecture }, 201);
}

export async function getArchitectureController(
  req: Request,
  res: Response
) {
  const architecture = await getArchitecture(
    req.auth!.organizationId.toString(),
    String(req.params.architectureId)
  );

  return sendSuccess(res, { architecture });
}

export async function updateArchitectureController(
  req: Request,
  res: Response
) {
  const input = updateArchitectureSchema.parse(req.body);

  const architecture = await updateArchitecture(
    req.auth!.organizationId.toString(),
    String(req.params.architectureId),
    input
  );

  return sendSuccess(res, { architecture });
}

export async function deleteArchitectureController(
  req: Request,
  res: Response
) {
  await deleteArchitecture(
    req.auth!.organizationId.toString(),
    String(req.params.architectureId)
  );

  return sendSuccess(res, { deleted: true });
}
