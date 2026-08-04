import { z } from "zod";

/** Factory, not a constant — see features/auth/schemas/login.schema.ts's
 * doc comment on why. Just merchant_id/service_id/optional
 * merchant_user_id — no secret key field, matching ConnectClickRequest on
 * the backend exactly (see entity.ClickIntegration's doc comment on why
 * these aren't secrets). */
export function buildClickSchema(t: (key: string) => string) {
  return z.object({
    merchant_id: z.string().min(1, t("merchantIdRequired")),
    service_id: z.string().min(1, t("serviceIdRequired")),
    merchant_user_id: z.string().optional(),
  });
}

export type ClickFormValues = z.infer<ReturnType<typeof buildClickSchema>>;
