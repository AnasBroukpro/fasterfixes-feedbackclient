"use client";

import { useMemo } from "react";
import { FeedbackProviderCore } from "@fasterfixes/react/internal";
import { LocalStorageFeedbackClient } from "./local-storage-client";
import { TryMeHint } from "./try-me-hint.client";

const DEMO_REVIEWER_TOKEN = "demo";

type DemoFeedbackProviderProps = {
  children: React.ReactNode;
};

export function DemoFeedbackProvider({ children }: DemoFeedbackProviderProps) {
  const client = useMemo(() => new LocalStorageFeedbackClient(), []);
  const config = useMemo(() => ({ enabled: true, branding: false }), []);

  return (
    <FeedbackProviderCore
      client={client}
      reviewerToken={DEMO_REVIEWER_TOKEN}
      config={config}
      position="bottom-right"
    >
      {children}
      <TryMeHint />
    </FeedbackProviderCore>
  );
}
