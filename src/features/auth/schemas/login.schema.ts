import { z } from "zod";

/**
 * Login is two steps because the Go API's LoginRequest requires an
 * organization_id up front (backend/internal/delivery/http/v1/dto.go) —
 * there's no single "email + password" login endpoint. Step 1 resolves
 * which organization(s) the email belongs to
 * (GET /v1/auth/organizations); step 2 submits the actual login once an
 * org is known (auto-picked if there's exactly one).
 */
export const emailStepSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
});
export type EmailStepValues = z.infer<typeof emailStepSchema>;

export const passwordStepSchema = z.object({
  organization_id: z.string().uuid("Select a workspace"),
  password: z.string().min(1, "Password is required"),
});
export type PasswordStepValues = z.infer<typeof passwordStepSchema>;
