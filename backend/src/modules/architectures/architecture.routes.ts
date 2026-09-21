import { Router } from "express";

import {
  createArchitectureController,
  deleteArchitectureController,
  getArchitectureController,
  listArchitecturesController,
  updateArchitectureController,
} from "./architecture.controller";

import { authenticate } from "../../core/middleware/auth.middleware";
import { requirePermission } from "../../core/middleware/authorization.middleware";

const router = Router();

router.use(authenticate);

router.get(
  "/",
  requirePermission("architecture:read"),
  listArchitecturesController
);

router.post(
  "/",
  requirePermission("architecture:create"),
  createArchitectureController
);

router.get(
  "/:architectureId",
  requirePermission("architecture:read"),
  getArchitectureController
);

router.patch(
  "/:architectureId",
  requirePermission("architecture:update"),
  updateArchitectureController
);

router.delete(
  "/:architectureId",
  requirePermission("architecture:delete"),
  deleteArchitectureController
);

export default router;
