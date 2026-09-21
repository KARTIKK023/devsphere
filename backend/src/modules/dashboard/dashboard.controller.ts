import type { Request, Response } from "express";

import { sendSuccess } from "../../core/http/response";
import { getDashboardOverview } from "./dashboard.service";

export async function getDashboardOverviewController(
  req: Request,
  res: Response
) {
  const overview = await getDashboardOverview(
    req.auth!.organizationId.toString()
  );

  return sendSuccess(res, overview);
}
