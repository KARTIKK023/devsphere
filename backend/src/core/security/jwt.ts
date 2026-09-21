import jwt from "jsonwebtoken";

import { env } from "../../config/env";

import type { AuthTokenPayload } from "../../modules/auth/auth.types";

export function signAccessToken(
  payload: AuthTokenPayload
): string {
  if (!env.JWT_EXPIRES_IN) {
    throw new Error(
      "JWT_EXPIRES_IN is not configured"
    );
  }

  const expiresIn =
    env.JWT_EXPIRES_IN as NonNullable<
      jwt.SignOptions["expiresIn"]
    >;

  const options: jwt.SignOptions = {
    expiresIn,
  };

  return jwt.sign(
    payload,
    env.JWT_SECRET,
    options
  );
}

export function verifyAccessToken(
  token: string
): AuthTokenPayload {
  return jwt.verify(
    token,
    env.JWT_SECRET
  ) as AuthTokenPayload;
}