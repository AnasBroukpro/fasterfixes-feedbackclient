import { inngest } from "@/server/inngest";

// Welcome email disabled — no email system.
export const sendWelcomeEmail = inngest.createFunction(
  {
    id: "send-welcome-email",
    retries: 3,
    idempotency: "event.data.userId",
    triggers: [{ event: "user/email-verified" }],
  },
  async () => {
    return { skipped: "emails_disabled" };
  },
);
