import express from "express";
import cors from "cors";
import helmet from "helmet";


import { env } from "./config/env";
import { errorMiddleware } from "./core/middleware/error.middleware";
import invitationRoutes from "./modules/invitations/invitation.routes";
import organizationRoutes from "./modules/organizations/organization.routes";
import authRoutes from "./modules/auth/auth.routes";
import billingRoutes from "./modules/billing/billing.routes";
import platformAdminRoutes from "./modules/platform/platform-admin.routes";
import repositoryRoutes from "./modules/repositories/repository.routes";
import architectureRoutes from "./modules/architectures/architecture.routes";
import dashboardRoutes from "./modules/dashboard/dashboard.routes";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "10mb",
  })
);

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "DevSphere API is running",
  });
});

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/invitations",
  invitationRoutes
);

app.use(
  "/api/organizations",
  organizationRoutes
);

app.use(
  "/api/billing",
  billingRoutes
);

app.use(
  "/api/admin",
  platformAdminRoutes
);

app.use(
  "/api/repositories",
  repositoryRoutes
);

app.use(
  "/api/architectures",
  architectureRoutes
);

app.use(
  "/api/dashboard",
  dashboardRoutes
);

app.use(errorMiddleware);

export default app;