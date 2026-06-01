"use server";

import { protectedProcedure } from "@/server/trpc/trpc";
import { TRPCError, inferProcedureOutput } from "@trpc/server";
import { UpdateProjectSlackLinkSchema } from "./update-project-slack-link.schema";

export const updateProjectSlackLink = protectedProcedure
  .input(UpdateProjectSlackLinkSchema)
  .mutation(async ({ input, ctx }) => {
    const { prisma, session } = ctx;

    const project = await prisma.project.findUnique({
      where: { id: input.projectId },
      select: { organizationId: true },
    });

    if (!project) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Project not found." });
    }

    const membership = await prisma.member.findFirst({
      where: {
        organizationId: project.organizationId,
        userId: session.user.id,
        role: { in: ["owner", "admin"] },
      },
    });

    if (!membership) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only owners and admins can update the Slack link.",
      });
    }

    await prisma.projectSlackLink.update({
      where: { projectId: input.projectId },
      data: { enabled: input.enabled },
    });

    return { success: true };
  });

export type UpdateProjectSlackLinkOutput = inferProcedureOutput<
  typeof updateProjectSlackLink
>;
