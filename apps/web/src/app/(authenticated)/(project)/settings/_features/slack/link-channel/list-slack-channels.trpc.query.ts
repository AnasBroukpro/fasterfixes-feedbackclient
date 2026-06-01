"use server";

import { auth } from "@/server/auth";
import { decryptSlackToken } from "@/server/slack/crypto";
import { listPublicChannels } from "@/server/slack/slack-client";
import { protectedProcedure } from "@/server/trpc/trpc";
import { TRPCError, inferProcedureOutput } from "@trpc/server";
import { headers } from "next/headers";

export const listSlackChannels = protectedProcedure.query(async ({ ctx }) => {
  const { prisma, session } = ctx;

  const activeOrganization = await auth.api.getFullOrganization({
    headers: await headers(),
  });

  if (!activeOrganization) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "No active organization.",
    });
  }

  const membership = await prisma.member.findFirst({
    where: {
      organizationId: activeOrganization.id,
      userId: session.user.id,
      role: { in: ["owner", "admin"] },
    },
  });

  if (!membership) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Only owners and admins can list Slack channels.",
    });
  }

  const installation = await prisma.slackInstallation.findUnique({
    where: { organizationId: activeOrganization.id },
    select: { botToken: true },
  });

  if (!installation) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "No Slack workspace connected.",
    });
  }

  const botToken = decryptSlackToken(installation.botToken);
  return listPublicChannels(botToken);
});

export type ListSlackChannelsOutput = inferProcedureOutput<
  typeof listSlackChannels
>;
