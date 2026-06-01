import { z } from "zod";

export const SetProjectSlackChannelSchema = z.object({
  projectId: z.string(),
  channelId: z.string(),
  channelName: z.string(),
});

export type SetProjectSlackChannelInput = z.infer<
  typeof SetProjectSlackChannelSchema
>;
