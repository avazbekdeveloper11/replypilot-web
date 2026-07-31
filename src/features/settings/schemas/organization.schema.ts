import { z } from "zod";

export const organizationSettingsSchema = z.object({
  name: z.string().min(2, "Organization name is required").max(120, "Keep it under 120 characters"),
  timezone: z.string().min(1, "Choose a timezone"),
});

export type OrganizationSettingsValues = z.infer<typeof organizationSettingsSchema>;
