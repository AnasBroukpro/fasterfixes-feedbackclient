"use server";

import { auth } from "@/server/auth";
import { adminProcedure } from "@/server/trpc/trpc";
import { TRPCError } from "@trpc/server";
import { SetUserPasswordSchema } from "./request-password-reset.schema";

export const requestPasswordReset = adminProcedure
  .input(SetUserPasswordSchema)
  .mutation(async ({ input }) => {
    try {
      const response = await auth.api.setUserPassword({
        body: {
          userId: input.userId,
          newPassword: input.newPassword,
        },
      });

      if (!response) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to set password",
        });
      }

      return { success: true };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "Failed to set password",
      });
    }
  });
