import type { Request, Response } from "express";

import { env } from "../../config/env";
import { AppError } from "../../core/errors/AppError";
import { sendSuccess } from "../../core/http/response";

import { loginWithOAuth } from "./auth.service";
import { disconnectGithub } from "../repositories/github-token.service";
import { getDeviceInfo } from "../../core/security/device";

import {
  exchangeGithubCode,
  exchangeGoogleCode,
  getAuthorizationUrl,
  getConfiguredProviders,
  isProviderConfigured,
  verifyOAuthState,
} from "./oauth.service";

import type { OAuthProvider } from "./auth.types";

function frontendUrl(
  path: string,
  params?: Record<string, string>
): string {
  const url = new URL(path, env.FRONTEND_URL);

  if (params) {
    for (const [key, value] of Object.entries(
      params
    )) {
      url.searchParams.set(key, value);
    }
  }

  return url.toString();
}

export function oauthProvidersController(
  _req: Request,
  res: Response
) {
  return sendSuccess(res, getConfiguredProviders());
}

export async function disconnectGithubController(
  req: Request,
  res: Response
) {
  const result = await disconnectGithub(
    req.auth!.userId.toString()
  );

  return sendSuccess(res, result);
}

export function oauthRedirectController(
  provider: OAuthProvider
) {
  return (req: Request, res: Response) => {
    void req;

    if (!isProviderConfigured(provider)) {
      return res.redirect(
        frontendUrl("/login", {
          error: `${provider.toLowerCase()} login is not configured`,
        })
      );
    }

    return res.redirect(
      getAuthorizationUrl(provider)
    );
  };
}

export function oauthCallbackController(
  provider: OAuthProvider
) {
  return async (req: Request, res: Response) => {
    try {
      if (!isProviderConfigured(provider)) {
        throw new AppError(
          `${provider.toLowerCase()} login is not configured`,
          400
        );
      }

      const state =
        typeof req.query.state === "string"
          ? req.query.state
          : "";

      verifyOAuthState(state);

      const code =
        typeof req.query.code === "string"
          ? req.query.code
          : "";

      if (!code) {
        throw new AppError(
          "Missing authorization code",
          400
        );
      }

      const profile =
        provider === "GOOGLE"
          ? await exchangeGoogleCode(code)
          : await exchangeGithubCode(code);

      const result = await loginWithOAuth(
        profile,
        getDeviceInfo(req.get("user-agent"))
      );

      return res.redirect(
        frontendUrl("/auth/callback", {
          token: result.accessToken,
        })
      );
    } catch (error) {
      const message =
        error instanceof AppError
          ? error.message
          : "OAuth sign-in failed";

      return res.redirect(
        frontendUrl("/login", { error: message })
      );
    }
  };
}
