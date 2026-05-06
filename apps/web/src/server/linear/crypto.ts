import {
  decryptWithKey,
  encryptWithKey,
  loadHexKeyFromEnv,
} from "@/utils/crypto/aes-gcm";

const key = loadHexKeyFromEnv("LINEAR_TOKEN_ENCRYPTION_KEY");

export function encryptToken(plain: string): string {
  return encryptWithKey(plain, key);
}

export function decryptToken(payload: string): string {
  return decryptWithKey(payload, key);
}
