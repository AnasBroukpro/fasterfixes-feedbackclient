import { z } from "zod";

export const SetUserPasswordSchema = z.object({
  userId: z.string(),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

export type SetUserPasswordInputs = z.infer<typeof SetUserPasswordSchema>;
