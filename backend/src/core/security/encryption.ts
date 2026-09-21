import crypto from "crypto";

import { env } from "../../config/env";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const SEPARATOR = ":";

function getKey(): Buffer {
  const secret =
    env.TOKEN_ENCRYPTION_KEY ?? env.JWT_SECRET;

  return crypto
    .createHash("sha256")
    .update(secret)
    .digest();
}

export function encryptSecret(plainText: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(
    ALGORITHM,
    getKey(),
    iv
  );

  const encrypted = Buffer.concat([
    cipher.update(plainText, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return [
    iv.toString("base64"),
    authTag.toString("base64"),
    encrypted.toString("base64"),
  ].join(SEPARATOR);
}

export function decryptSecret(payload: string): string {
  const [ivPart, tagPart, dataPart] =
    payload.split(SEPARATOR);

  if (!ivPart || !tagPart || !dataPart) {
    throw new Error("Malformed encrypted payload");
  }

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    getKey(),
    Buffer.from(ivPart, "base64")
  );

  decipher.setAuthTag(Buffer.from(tagPart, "base64"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(dataPart, "base64")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}
