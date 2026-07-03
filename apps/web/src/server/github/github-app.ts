import { createAppAuth } from "@octokit/auth-app";
import { Octokit } from "@octokit/core";

export function getAppOctokit() {
  const appId = process.env.GITHUB_APP_ID!;
  const privateKey = process.env.GITHUB_PRIVATE_KEY!.replace(/\\n/g, "\n");
  return new Octokit({
    authStrategy: createAppAuth,
    auth: { appId, privateKey },
  });
}

export function getInstallationOctokit(installationId: number) {
  const appId = process.env.GITHUB_APP_ID!;
  const privateKey = process.env.GITHUB_PRIVATE_KEY!.replace(/\\n/g, "\n");
  return new Octokit({
    authStrategy: createAppAuth,
    auth: { appId, privateKey, installationId },
  });
}
