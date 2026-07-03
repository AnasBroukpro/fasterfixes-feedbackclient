"use server";

import { auth } from "@/server/auth";
import { publicProcedure } from "@/server/trpc/trpc";
import { inferProcedureOutput, TRPCError } from "@trpc/server";
import { prisma } from "@workspace/db";
import { SignupSchema } from "./signup.schema";

export const signupMutation = publicProcedure
  .input(SignupSchema)
  .mutation(async ({ input }) => {
    const adminCount = await prisma.user.count({ where: { role: "admin" } });

    if (adminCount > 0) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Public signup is disabled. Contact your administrator.",
      });
    }

    try {
      const { email, password } = input;
      const name = email.split("@")[0] || email;

      const data = await auth.api.signUpEmail({
        body: { name, email, password },
      });

      if (!data) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Account creation failed",
        });
      }

      await prisma.user.update({
        where: { id: data.user.id },
        data: { role: "admin" },
      });

      return data.user;
    } catch (error) {
      console.error(error);

      if (error instanceof TRPCError) {
        throw error;
      }

      if (error instanceof Error && error.message.includes("email")) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email already registered",
        });
      }

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Account creation failed. Please try again.",
      });
    }
  });

export type SignupOutput = inferProcedureOutput<typeof signupMutation>;
