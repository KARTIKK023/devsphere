import { env } from "../../config/env";

export function getSessionExpiration(): Date {
  const value = env.JWT_EXPIRES_IN;

  const match = value.match(/^(\d+)([smhd])$/);

  if (!match) {
    throw new Error(
      `Unsupported JWT_EXPIRES_IN format: ${value}`
    );
  }

  const amount = Number(match[1]);
  const unit = match[2];

  if (!unit) {
    throw new Error(
      `Invalid JWT_EXPIRES_IN unit: ${value}`
    );
  }

  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  const multiplier = multipliers[unit];

  if (multiplier === undefined) {
    throw new Error(
      `Unsupported JWT_EXPIRES_IN unit: ${unit}`
    );
  }

  const milliseconds = amount * multiplier;

  return new Date(Date.now() + milliseconds);
}