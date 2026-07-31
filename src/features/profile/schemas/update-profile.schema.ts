import { z } from "zod";

export const updateProfileSchema = z.object({
  full_name: z.string().min(2, "Your name is required").max(120, "Keep it under 120 characters"),
  avatar_url: z
    .string()
    .trim()
    .url("Enter a valid URL")
    .optional()
    .or(z.literal("")),
});

export type UpdateProfileValues = z.infer<typeof updateProfileSchema>;
