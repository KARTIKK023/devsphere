import { Router } from "express";

import {
  createInvitationController,
  acceptInvitationController,
} from "./invitation.controller";

import {
  authenticate,
} from "../../core/middleware/auth.middleware";

import {
  requirePermission,
} from "../../core/middleware/authorization.middleware";

const router = Router();

router.post(
  "/",
  authenticate,
  requirePermission("member:invite"),
  createInvitationController
);

router.post(
  "/accept",
  authenticate,
  acceptInvitationController
);

export default router;