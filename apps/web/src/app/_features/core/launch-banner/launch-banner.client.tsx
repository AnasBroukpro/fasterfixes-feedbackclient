"use client";

import { cn } from "@workspace/ui/lib/utils";
import { X } from "lucide-react";
import * as React from "react";

const TINYLAUNCH_URL = "https://www.tinylaunch.com/launch/15543";

// Bump this key to re-show the banner after a future launch/campaign.
const DISMISS_STORAGE_KEY = "launch-banner-tinylaunch-15543-dismissed";

// Launch window: 29 Jun 2026 09:00 Paris (CEST, UTC+2) for 24h. Stored as
// fixed UTC instants so the window is identical regardless of viewer timezone.
const WINDOW_START_MS = Date.UTC(2026, 5, 29, 7, 0, 0);
const WINDOW_END_MS = WINDOW_START_MS + 24 * 60 * 60 * 1000;

export function LaunchBanner() {
  // Start hidden so SSR/first paint renders nothing; reveal only after we
  // confirm we're inside the launch window and localStorage holds no prior
  // dismissal. Avoids a flash for users who already closed it or are off-window.
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const now = Date.now();
    const inWindow = now >= WINDOW_START_MS && now < WINDOW_END_MS;
    const dismissed = localStorage.getItem(DISMISS_STORAGE_KEY) === "true";
    setVisible(inWindow && !dismissed);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_STORAGE_KEY, "true");
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="bg-primary text-primary-foreground relative">
      <div className="mx-auto flex items-center justify-center gap-2 px-10 py-4 text-center">
        <p>
          We&apos;re launching on TinyLaunch today. If you have 30 seconds, a{" "}
          <a
            href={TINYLAUNCH_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-2"
          >
            vote
          </a>{" "}
          would mean a lot.
        </p>
      </div>
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss banner"
        className={cn(
          "absolute top-1/2 right-2 -translate-y-1/2 rounded-sm p-1",
          "opacity-80 transition-opacity hover:opacity-100",
          "focus-visible:ring-primary-foreground/50 outline-none focus-visible:ring-2",
        )}
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
