import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const ALGORITHM = "aes-256-gcm";
const KEY_LENGTH = 32;
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

// Payload format: `${ivBase64}:${authTagBase64}:${ciphertextBase64}`.
// Storing IV + tag inline keeps each ciphertext self-contained — callers only
// need the key to round-trip.

export function encryptWithKey(plain: string, key: Buffer): string {
  assertKeyLength(key);
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const ciphertext = Buffer.concat([
    cipher.update(plain, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  return `${iv.toString("base64")}:${authTag.toString("base64")}:${ciphertext.toString("base64")}`;
}

export function decryptWithKey(payload: string, key: Buffer): string {
  assertKeyLength(key);
  const [ivB64, authTagB64, ciphertextB64] = payload.split(":");
  if (!ivB64 || !authTagB64 || !ciphertextB64) {
    throw new Error("Malformed encrypted payload.");
  }
  const iv = Buffer.from(ivB64, "base64");
  const authTag = Buffer.from(authTagB64, "base64");
  const ciphertext = Buffer.from(ciphertextB64, "base64");
  if (iv.length !== IV_LENGTH || authTag.length !== AUTH_TAG_LENGTH) {
    throw new Error("Encrypted payload has unexpected IV/authTag length.");
  }
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  const plain = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return plain.toString("utf8");
}

// Reads a hex-encoded 32-byte key (e.g. `openssl rand -hex 32`) from the named
// env var. Centralized so every caller validates and errors identically.
export function loadHexKeyFromEnv(envVarName: string): Buffer {
  const raw = process.env[envVarName];
  if (!raw) {
    throw new Error(
      `${envVarName} is not set. Generate one via \`openssl rand -hex 32\` and add it to .env.local.`,
    );
  }
  const buf = Buffer.from(raw, "hex");
  if (buf.length !== KEY_LENGTH) {
    throw new Error(
      `${envVarName} must decode to ${KEY_LENGTH} bytes (${KEY_LENGTH * 2} hex characters).`,
    );
  }
  return buf;
}

function assertKeyLength(key: Buffer): void {
  if (key.length !== KEY_LENGTH) {
    throw new Error(
      `AES-256-GCM requires a ${KEY_LENGTH}-byte key, got ${key.length}.`,
    );
  }
}
