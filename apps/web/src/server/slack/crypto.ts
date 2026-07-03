import {
  decryptWithKey,
  encryptWithKey,
  loadHexKeyFromEnv,
} from "@/utils/crypto/aes-gcm";

function getKey() {
  return loadHexKeyFromEnv("SLACK_TOKEN_ENCRYPTION_KEY");
}

export function encryptSlackToken(plain: string): string {
  return encryptWithKey(plain, getKey());
}

export function decryptSlackToken(payload: string): string {
  return decryptWithKey(payload, getKey());
}
