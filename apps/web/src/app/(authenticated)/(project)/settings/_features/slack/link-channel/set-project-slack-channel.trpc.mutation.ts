"use server";

import { protectedProcedure } from "@/server/trpc/trpc";
import { TRPCError, inferProcedureOutput } from "@trpc/server";
import { SetProjectSlackChannelSchema } from "./set-project-slack-channel.schema";

export const setProjectSlackChannel = protectedProcedure
  .input(SetProjectSlackChannelSchema)
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
        message: "Only owners and admins can set the Slack channel.",
      });
    }

    const installation = await prisma.slackInstallation.findUnique({
      where: { organizationId: project.organizationId },
      select: { id: true },
    });

    if (!installation) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No Slack workspace connected.",
      });
    }

    await prisma.projectSlackLink.upsert({
      where: { projectId: input.projectId },
      create: {
        projectId: input.projectId,
        slackInstallationId: installation.id,
        channelId: input.channelId,
        channelName: input.channelName,
      },
      // Changing the channel revalidates the link: a previously failing binding
      // may now point at a reachable channel, so the stale health failure clears.
      update: {
        channelId: input.channelId,
        channelName: input.channelName,
        linkHealthy: true,
        healthIssue: null,
      },
    });

    return { success: true };
  });

export type SetProjectSlackChannelOutput = inferProcedureOutput<
  typeof setProjectSlackChannel
>;
