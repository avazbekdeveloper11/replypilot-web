import { z } from "zod";

export const inviteSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  role_id: z.string().uuid("Choose a role"),
});
export type InviteValues = z.infer<typeof inviteSchema>;
