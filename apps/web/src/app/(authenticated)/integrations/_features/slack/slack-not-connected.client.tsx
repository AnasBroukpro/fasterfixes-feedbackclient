"use client";

import { Button } from "@workspace/ui/components/button";
import { SlackIcon } from "@workspace/ui/components/icons/slack-icon";

export function SlackNotConnected() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-muted-foreground text-sm">
        No Slack workspace connected. Add Faster Fixes to Slack to get a message
        when new feedback arrives, updated in place as the status changes.
      </p>
      <Button asChild>
        <a href="/api/slack/install">
          <SlackIcon className="size-4" />
          Add to Slack
        </a>
      </Button>
    </div>
  );
}
