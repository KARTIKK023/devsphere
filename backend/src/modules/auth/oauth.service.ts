import crypto from "crypto";
import jwt from "jsonwebtoken";

import { env } from "../../config/env";
import { AppError } from "../../core/errors/AppError";

import type { OAuthProfile, OAuthProvider } from "./auth.types";

const GOOGLE_AUTH_URL =
  "https://accounts.google.com/o/oauth2/v2/auth";

const GOOGLE_TOKEN_URL =
  "https://oauth2.googleapis.com/token";

const GOOGLE_USERINFO_URL =
  "https://www.googleapis.com/oauth2/v3/userinfo";

const GITHUB_AUTH_URL =
  "https://github.com/login/oauth/authorize";

const GITHUB_TOKEN_URL =
  "https://github.com/login/oauth/access_token";

const GITHUB_USER_URL =
  "https://api.github.com/user";

const GITHUB_EMAILS_URL =
  "https://api.github.com/user/emails";

export function isProviderConfigured(
  provider: OAuthProvider
): boolean {
  if (provider === "GOOGLE") {
    return Boolean(
      env.GOOGLE_CLIENT_ID &&
        env.GOOGLE_CLIENT_SECRET
    );
  }

  return Boolean(
    env.GITHUB_CLIENT_ID &&
      env.GITHUB_CLIENT_SECRET
  );
}

export function getConfiguredProviders() {
  return {
    google: isProviderConfigured("GOOGLE"),
    github: isProviderConfigured("GITHUB"),
  };
}

function callbackUrl(
  provider: OAuthProvider
): string {
  return `${env.BACKEND_URL}/api/auth/oauth/${provider.toLowerCase()}/callback`;
}

export function createOAuthState(): string {
  return jwt.sign(
    {
      type: "oauth_state",
      nonce: crypto
        .randomBytes(16)
        .toString("hex"),
    },
    env.JWT_SECRET,
    { expiresIn: "10m" }
  );
}

export function verifyOAuthState(
  state: string
): void {
  try {
    const payload = jwt.verify(state, env.JWT_SECRET) as {
      type?: string;
    };

    if (payload.type !== "oauth_state") {
      throw new Error("Unexpected state token");
    }
  } catch {
    throw new AppError(
      "Invalid or expired OAuth state",
      400
    );
  }
}

export function getAuthorizationUrl(
  provider: OAuthProvider
): string {
  const state = createOAuthState();

  if (provider === "GOOGLE") {
    const params = new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID ?? "",
      redirect_uri: callbackUrl("GOOGLE"),
      response_type: "code",
      scope: "openid email profile",
      state,
      prompt: "select_account",
    });

    return `${GOOGLE_AUTH_URL}?${params.toString()}`;
  }

  const params = new URLSearchParams({
    client_id: env.GITHUB_CLIENT_ID ?? "",
    redirect_uri: callbackUrl("GITHUB"),
    scope: "read:user user:email repo",
    state,
  });

  return `${GITHUB_AUTH_URL}?${params.toString()}`;
}

type GoogleTokenResponse = {
  access_token?: string;
  error?: string;
  error_description?: string;
};

type GoogleUserInfo = {
  sub?: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
};

type GithubTokenResponse = {
  access_token?: string;
  scope?: string;
  error?: string;
  error_description?: string;
};

type GithubUser = {
  id?: number;
  login?: string;
  name?: string | null;
  email?: string | null;
  avatar_url?: string;
};

type GithubEmail = {
  email?: string;
  primary?: boolean;
  verified?: boolean;
};

async function parseJson<T>(
  response: Response
): Promise<T> {
  return (await response.json()) as T;
}

export async function exchangeGoogleCode(
  code: string
): Promise<OAuthProfile> {
  const tokenResponse = await fetch(
    GOOGLE_TOKEN_URL,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: env.GOOGLE_CLIENT_ID ?? "",
        client_secret:
          env.GOOGLE_CLIENT_SECRET ?? "",
        redirect_uri: callbackUrl("GOOGLE"),
        grant_type: "authorization_code",
      }),
    }
  );

  const tokenData =
    await parseJson<GoogleTokenResponse>(
      tokenResponse
    );

  if (!tokenData.access_token) {
    throw new AppError(
      "Google authentication failed",
      502
    );
  }

  const userResponse = await fetch(
    GOOGLE_USERINFO_URL,
    {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    }
  );

  const profile =
    await parseJson<GoogleUserInfo>(
      userResponse
    );

  if (!profile.sub || !profile.email) {
    throw new AppError(
      "Google account did not return an email address",
      400
    );
  }

  return {
    provider: "GOOGLE",
    providerId: profile.sub,
    email: profile.email,
    name:
      profile.name ??
      profile.email.split("@")[0] ??
      "DevSphere User",
    avatar: profile.picture ?? null,
    accessToken: tokenData.access_token,
  };
}

export async function exchangeGithubCode(
  code: string
): Promise<OAuthProfile> {
  const tokenResponse = await fetch(
    GITHUB_TOKEN_URL,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        code,
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        redirect_uri: callbackUrl("GITHUB"),
      }),
    }
  );

  const tokenData =
    await parseJson<GithubTokenResponse>(
      tokenResponse
    );

  if (!tokenData.access_token) {
    throw new AppError(
      "GitHub authentication failed",
      502
    );
  }

  const headers = {
    Authorization: `Bearer ${tokenData.access_token}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "DevSphere",
  };

  const userResponse = await fetch(
    GITHUB_USER_URL,
    { headers }
  );

  const githubUser =
    await parseJson<GithubUser>(userResponse);

  if (!githubUser.id) {
    throw new AppError(
      "GitHub account could not be loaded",
      502
    );
  }

  let email = githubUser.email ?? null;

  if (!email) {
    const emailsResponse = await fetch(
      GITHUB_EMAILS_URL,
      { headers }
    );

    const emails =
      await parseJson<GithubEmail[]>(
        emailsResponse
      );

    const primaryEmail =
      emails.find(
        (entry) =>
          entry.primary && entry.verified
      ) ??
      emails.find((entry) => entry.verified) ??
      emails[0];

    email = primaryEmail?.email ?? null;
  }

  if (!email) {
    throw new AppError(
      "GitHub account did not return a verified email address",
      400
    );
  }

  return {
    provider: "GITHUB",
    providerId: String(githubUser.id),
    email,
    name:
      githubUser.name ??
      githubUser.login ??
      email.split("@")[0] ??
      "DevSphere User",
    avatar: githubUser.avatar_url ?? null,
    login: githubUser.login ?? null,
    accessToken: tokenData.access_token,
    scope: tokenData.scope,
  };
}
