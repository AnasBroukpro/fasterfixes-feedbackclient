-- CreateTable
CREATE TABLE "slack_installation" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organizationId" TEXT NOT NULL,
    "slackTeamId" TEXT NOT NULL,
    "slackTeamName" TEXT NOT NULL,
    "botToken" TEXT NOT NULL,
    "botUserId" TEXT NOT NULL,
    "scope" TEXT,
    "installedById" TEXT,

    CONSTRAINT "slack_installation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_slack_link" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "projectId" TEXT NOT NULL,
    "slackInstallationId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "channelName" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "linkHealthy" BOOLEAN NOT NULL DEFAULT true,
    "healthIssue" TEXT,

    CONSTRAINT "project_slack_link_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback_slack_message" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "feedbackId" TEXT NOT NULL,
    "projectSlackLinkId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "messageTs" TEXT NOT NULL,
    "lastSyncAt" TIMESTAMP(3),

    CONSTRAINT "feedback_slack_message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "slack_installation_organizationId_key" ON "slack_installation"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "slack_installation_slackTeamId_key" ON "slack_installation"("slackTeamId");

-- CreateIndex
CREATE INDEX "slack_installation_organizationId_idx" ON "slack_installation"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "project_slack_link_projectId_key" ON "project_slack_link"("projectId");

-- CreateIndex
CREATE INDEX "project_slack_link_slackInstallationId_idx" ON "project_slack_link"("slackInstallationId");

-- CreateIndex
CREATE UNIQUE INDEX "feedback_slack_message_feedbackId_key" ON "feedback_slack_message"("feedbackId");

-- CreateIndex
CREATE INDEX "feedback_slack_message_projectSlackLinkId_idx" ON "feedback_slack_message"("projectSlackLinkId");

-- AddForeignKey
ALTER TABLE "slack_installation" ADD CONSTRAINT "slack_installation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slack_installation" ADD CONSTRAINT "slack_installation_installedById_fkey" FOREIGN KEY ("installedById") REFERENCES "member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_slack_link" ADD CONSTRAINT "project_slack_link_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_slack_link" ADD CONSTRAINT "project_slack_link_slackInstallationId_fkey" FOREIGN KEY ("slackInstallationId") REFERENCES "slack_installation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback_slack_message" ADD CONSTRAINT "feedback_slack_message_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "feedback"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback_slack_message" ADD CONSTRAINT "feedback_slack_message_projectSlackLinkId_fkey" FOREIGN KEY ("projectSlackLinkId") REFERENCES "project_slack_link"("id") ON DELETE CASCADE ON UPDATE CASCADE;
