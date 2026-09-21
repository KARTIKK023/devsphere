import type { Request, Response } from "express";

import { sendSuccess } from "../../core/http/response";
import { updateOrganizationSchema } from "./organization.validation";
import {
  getMyOrganizations,
  getCurrentOrganization,
  getOrganizationMembers,
  updateOrganization,
  getAssignableRoles,
} from "./organization.service";

export async function getMyOrganizationsController(
  req: Request,
  res: Response
) {
  const organizations = await getMyOrganizations(
    req.auth!.userId.toString()
  );

  return sendSuccess(res, { organizations });
}

export async function getCurrentOrganizationController(
  req: Request,
  res: Response
) {
  const organization = await getCurrentOrganization(
    req.auth!.organizationId.toString()
  );

  return sendSuccess(res, { organization });
}

export async function getOrganizationMembersController(
  req: Request,
  res: Response
) {
  const members = await getOrganizationMembers(
    req.auth!.organizationId.toString()
  );

  return sendSuccess(res, { members });
}

export async function updateCurrentOrganizationController(
  req: Request,
  res: Response
) {
  const input = updateOrganizationSchema.parse(req.body);

  const organization = await updateOrganization(
    req.auth!.organizationId.toString(),
    input.name
  );

  return sendSuccess(res, { organization });
}

export async function getAssignableRolesController(
  _req: Request,
  res: Response
) {
  const roles = await getAssignableRoles();

  return sendSuccess(res, { roles });
}
