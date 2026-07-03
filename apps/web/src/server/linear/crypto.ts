import {
  decryptWithKey,
  encryptWithKey,
  loadHexKeyFromEnv,
} from "@/utils/crypto/aes-gcm";

function getKey() {
  return loadHexKeyFromEnv("LINEAR_TOKEN_ENCRYPTION_KEY");
}

export function encryptToken(plain: string): string {
  return encryptWithKey(plain, getKey());
}

export function decryptToken(payload: string): string {
  return decryptWithKey(payload, getKey());
}
