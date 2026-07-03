"use server";

import { publicProcedure } from "@/server/trpc/trpc";
import { TRPCError } from "@trpc/server";
import { ForgotPasswordSchema } from "./forgot-password.schema";

export const forgotPasswordMutation = publicProcedure
  .input(ForgotPasswordSchema)
  .mutation(async () => {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Password reset is disabled.",
    });
  });

export type ForgotPasswordOutput = void;
