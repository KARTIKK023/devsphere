import "dotenv/config";
import { z } from "zod";

const optionalString = z
  .string()
  .trim()
  .min(1)
  .optional();

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),

  MONGODB_URI: z
    .string()
    .min(1, "MONGODB_URI is required"),

  FRONTEND_URL: z
    .string()
    .url()
    .default("http://localhost:5173"),

  /* Public base URL of this API, used to build OAuth redirect URIs. */
  BACKEND_URL: z
    .string()
    .url()
    .default("http://localhost:5002"),

  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET must be at least 32 characters"),

  JWT_EXPIRES_IN: z
    .string()
    .default("7d"),

  /* Key used to encrypt provider access tokens at rest. Falls back to JWT_SECRET. */
  TOKEN_ENCRYPTION_KEY: z
    .string()
    .min(32, "TOKEN_ENCRYPTION_KEY must be at least 32 characters")
    .optional(),

  /* OAuth providers are optional; the matching login button is hidden when unset. */
  GOOGLE_CLIENT_ID: optionalString,
  GOOGLE_CLIENT_SECRET: optionalString,

  GITHUB_CLIENT_ID: optionalString,
  GITHUB_CLIENT_SECRET: optionalString,
});

export const env = envSchema.parse(process.env);

/*
 * Normalize base URLs: strip trailing slashes so CORS origin matching (exact),
 * OAuth callback construction, and redirect URLs stay consistent even when a
 * `FRONTEND_URL`/`BACKEND_URL` like `https://example.com/` is provided.
 */
env.FRONTEND_URL = env.FRONTEND_URL.replace(/\/+$/, "");
env.BACKEND_URL = env.BACKEND_URL.replace(/\/+$/, "");