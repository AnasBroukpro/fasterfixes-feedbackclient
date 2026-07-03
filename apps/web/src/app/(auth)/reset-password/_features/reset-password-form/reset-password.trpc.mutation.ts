"use server";

import { publicProcedure } from "@/server/trpc/trpc";
import { TRPCError } from "@trpc/server";
import { ResetPasswordSchema } from "./reset-password.schema";

export const resetPasswordMutation = publicProcedure
  .input(ResetPasswordSchema)
  .mutation(async () => {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Password reset is disabled.",
    });
  });

export type ResetPasswordOutput = void;
