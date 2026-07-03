import type { BetterAuthOptions } from "better-auth";

// Email verification disabled — admin creates users manually, no public signup.
export const emailVerification: NonNullable<
  BetterAuthOptions["emailVerification"]
> = {
  sendOnSignUp: false,
  autoSignInAfterVerification: true,
};
