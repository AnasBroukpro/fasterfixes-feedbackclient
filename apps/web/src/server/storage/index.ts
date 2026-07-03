import { cloudflare } from "@better-upload/server/clients";

let _s3Client: ReturnType<typeof cloudflare>;

export const s3Client = new Proxy<ReturnType<typeof cloudflare>>({} as any, {
  get(_target, prop) {
    if (!_s3Client) {
      _s3Client = cloudflare({
        accountId: process.env.R2_ACCOUNT_ID!,
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      });
    }
    return Reflect.get(_s3Client, prop);
  },
});
