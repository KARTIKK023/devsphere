import type { Request, Response } from "express";

import { sendSuccess } from "../../core/http/response";
import { getOrganizationSubscription } from "./billing.service";

export async function getCurrentSubscriptionController(
  req: Request,
  res: Response
) {
  const subscription = await getOrganizationSubscription(
    req.auth!.organizationId.toString()
  );

  return sendSuccess(res, { subscription });
}
