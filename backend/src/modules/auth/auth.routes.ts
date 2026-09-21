import { Router } from "express";

import {
  signupController,
  loginController,
  meController,
  switchOrganizationController,
  logoutController,
  logoutAllController,
  sessionsController,
  updateProfileController,
  changePasswordController,
  revokeSessionController,
} from "./auth.controller";

import {
  oauthProvidersController,
  oauthRedirectController,
  oauthCallbackController,
  disconnectGithubController,
} from "./oauth.controller";

import { authRateLimiter } from "../../core/middleware/rate-limit.middleware";
import { authenticate } from "../../core/middleware/auth.middleware";

const router = Router();

router.post("/signup", authRateLimiter, signupController);
router.post("/login", authRateLimiter, loginController);

/* OAuth */
router.get("/oauth/providers", oauthProvidersController);
router.get(
  "/oauth/google",
  oauthRedirectController("GOOGLE")
);
router.get(
  "/oauth/google/callback",
  oauthCallbackController("GOOGLE")
);
router.get(
  "/oauth/github",
  oauthRedirectController("GITHUB")
);
router.get(
  "/oauth/github/callback",
  oauthCallbackController("GITHUB")
);

/* Session */
router.post("/logout", authenticate, logoutController);
router.post("/logout-all", authenticate, logoutAllController);
router.get("/me", authenticate, meController);
router.patch("/me", authenticate, updateProfileController);
router.patch(
  "/password",
  authenticate,
  changePasswordController
);
router.delete(
  "/integrations/github",
  authenticate,
  disconnectGithubController
);
router.get("/sessions", authenticate, sessionsController);
router.delete(
  "/sessions/:sessionId",
  authenticate,
  revokeSessionController
);
router.post(
  "/switch-organization",
  authenticate,
  switchOrganizationController
);

export default router;
