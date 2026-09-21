import { Router } from "express";

import {
  connectRepositoryController,
  disconnectRepositoryController,
  getRepositoryController,
  getRepositoryFileController,
  getRepositoryTreeController,
  listAvailableRepositoriesController,
  listRepositoriesController,
  listRepositoryBranchesController,
} from "./repository.controller";

import { authenticate } from "../../core/middleware/auth.middleware";
import { requirePermission } from "../../core/middleware/authorization.middleware";

const router = Router();

router.use(authenticate);

router.get(
  "/available",
  requirePermission("repository:read"),
  listAvailableRepositoriesController
);

router.get(
  "/",
  requirePermission("repository:read"),
  listRepositoriesController
);

router.post(
  "/",
  requirePermission("repository:create"),
  connectRepositoryController
);

router.get(
  "/:repositoryId",
  requirePermission("repository:read"),
  getRepositoryController
);

router.delete(
  "/:repositoryId",
  requirePermission("repository:delete"),
  disconnectRepositoryController
);

router.get(
  "/:repositoryId/tree",
  requirePermission("repository:read"),
  getRepositoryTreeController
);

router.get(
  "/:repositoryId/contents",
  requirePermission("repository:read"),
  getRepositoryFileController
);

router.get(
  "/:repositoryId/branches",
  requirePermission("repository:read"),
  listRepositoryBranchesController
);

export default router;
