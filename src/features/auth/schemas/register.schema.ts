import { z } from "zod";

/**
 * organization_slug mirrors the backend's `alphanum` binding tag exactly
 * (backend/internal/delivery/http/v1/dto.go's RegisterRequest) — letters
 * and digits only, no hyphens/underscores, or the API rejects it with
 * INVALID_INPUT before this form's client-side check would even matter on
 * a slow connection. The field is auto-derived from organization_name (see
 * register-form.tsx) but stays editable/visible so a slug collision
 * (CONFLICT from the API) is something the user can just retype, not a
 * dead end.
 */
export const registerSchema = z
  .object({
    organization_name: z
      .string()
      .min(2, "Organization name is required")
      .max(120, "Keep it under 120 characters"),
    organization_slug: z
      .string()
      .min(2, "Slug is required")
      .max(60, "Keep it under 60 characters")
      .regex(/^[a-zA-Z0-9]+$/, "Letters and numbers only, no spaces or symbols"),
    full_name: z.string().min(2, "Your name is required").max(120),
    email: z.string().min(1, "Email is required").email("Enter a valid email address"),
    password: z.string().min(8, "At least 8 characters").max(72),
    confirm_password: z.string().min(1, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"],
  });

export type RegisterValues = z.infer<typeof registerSchema>;
