import { protectedProcedure } from "@/server/trpc/trpc";
import { SendFeedbackSchema } from "./send-feedback.schema";

export const sendFeedback = protectedProcedure
  .input(SendFeedbackSchema)
  .mutation(async ({ input }) => {
    // Feedback is stored and visible in the admin dashboard.
    // Email notifications are disabled.
    return { success: true };
  });
