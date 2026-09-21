import { Router } from "express";

import {
  listOrganizationsController,
  listUsersController,
  platformStatsController,
  updateOrganizationStatusController,
  updateUserStatusController,
} from "./platform-admin.controller";

import { authenticate } from "../../core/middleware/auth.middleware";
import { requirePlatformAdmin } from "../../core/middleware/platform.middleware";

const router = Router();

router.use(authenticate, requirePlatformAdmin);

router.get(
  "/organizations",
  listOrganizationsController
);

router.patch(
  "/organizations/:organizationId",
  updateOrganizationStatusController
);

router.get("/users", listUsersController);

router.patch(
  "/users/:userId",
  updateUserStatusController
);

router.get("/stats", platformStatsController);

export default router;
