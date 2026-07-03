import { BetterAuthOptions } from "better-auth";

// Email/password auth — no public signup, no password reset emails.
// Admin creates users manually via the admin panel.
export const emailAndPassword: NonNullable<
  BetterAuthOptions["emailAndPassword"]
> = {
  enabled: true,
  requireEmailVerification: false,
  autoSignIn: true,
};
