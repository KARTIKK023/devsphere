import { Router } from "express";

import { authenticate } from "../../core/middleware/auth.middleware";
import { getCurrentSubscriptionController } from "./billing.controller";

const router = Router();

router.get(
  "/subscription",
  authenticate,
  getCurrentSubscriptionController
);

export default router;
