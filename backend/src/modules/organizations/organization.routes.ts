import { Router } from "express";

import {
  getMyOrganizationsController,
  getCurrentOrganizationController,
  getOrganizationMembersController,
  updateCurrentOrganizationController,
  getAssignableRolesController,
} from "./organization.controller";

import { authenticate } from "../../core/middleware/auth.middleware";
import {
  requirePermission,
  requireRole,
} from "../../core/middleware/authorization.middleware";

const router = Router();

router.get("/mine", authenticate, getMyOrganizationsController);

router.get(
  "/current",
  authenticate,
  getCurrentOrganizationController
);

router.patch(
  "/current",
  authenticate,
  requireRole("OWNER"),
  updateCurrentOrganizationController
);

router.get(
  "/members",
  authenticate,
  requirePermission("member:read"),
  getOrganizationMembersController
);

router.get(
  "/roles",
  authenticate,
  requirePermission("member:invite"),
  getAssignableRolesController
);

export default router;
