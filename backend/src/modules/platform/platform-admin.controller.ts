import type {
  Request,
  Response,
} from "express";

import { z } from "zod";

import { sendSuccess } from "../../core/http/response";

import {
  getPlatformStats,
  listOrganizations,
  listUsers,
  updateOrganizationStatus,
  updateUserStatus,
} from "./platform-admin.service";

const statusSchema = z.object({
  status: z.enum(["ACTIVE", "SUSPENDED"]),
});

export async function listOrganizationsController(
  _req: Request,
  res: Response
) {
  const organizations = await listOrganizations();

  return sendSuccess(res, { organizations });
}

export async function listUsersController(
  _req: Request,
  res: Response
) {
  const users = await listUsers();

  return sendSuccess(res, { users });
}

export async function platformStatsController(
  _req: Request,
  res: Response
) {
  const stats = await getPlatformStats();

  return sendSuccess(res, stats);
}

export async function updateOrganizationStatusController(
  req: Request,
  res: Response
) {
  const input = statusSchema.parse(req.body);

  const organization =
    await updateOrganizationStatus(
      String(req.params.organizationId ?? ""),
      input.status
    );

  return sendSuccess(res, { organization });
}

export async function updateUserStatusController(
  req: Request,
  res: Response
) {
  const input = statusSchema.parse(req.body);

  const user = await updateUserStatus(
    String(req.params.userId ?? ""),
    input.status
  );

  return sendSuccess(res, { user });
}
