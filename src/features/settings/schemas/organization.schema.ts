import { z } from "zod";

/** Factory, not a constant — see features/auth/schemas/login.schema.ts's
 * doc comment on why. Reuses the "validation" namespace's
 * organizationNameRequired/organizationNameTooLong keys — same copy as
 * the register form's equivalent fields. */
export function buildOrganizationSettingsSchema(t: (key: string) => string) {
  return z.object({
    name: z.string().min(2, t("organizationNameRequired")).max(120, t("organizationNameTooLong")),
    timezone: z.string().min(1, t("chooseTimezone")),
  });
}

export type OrganizationSettingsValues = z.infer<
  ReturnType<typeof buildOrganizationSettingsSchema>
>;
