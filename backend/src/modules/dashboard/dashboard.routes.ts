import { Router } from "express";

import { getDashboardOverviewController } from "./dashboard.controller";
import { authenticate } from "../../core/middleware/auth.middleware";

const router = Router();

router.get(
  "/",
  authenticate,
  getDashboardOverviewController
);

export default router;
