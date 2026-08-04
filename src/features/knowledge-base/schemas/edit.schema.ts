import { z } from "zod";

/** Factory, not a constant — see features/auth/schemas/login.schema.ts's
 * doc comment on why. Reuses the same validation copy as
 * upload.schema.ts's buildUploadTextSchema — same fields, same limits. */
export function buildEditDocumentSchema(t: (key: string) => string) {
  return z.object({
    title: z.string().min(1, t("titleRequired")).max(120, t("titleTooLong")),
    content: z.string().min(1, t("pasteSomeContent")).max(200_000, t("contentTooLong")),
  });
}

export type EditDocumentValues = z.infer<ReturnType<typeof buildEditDocumentSchema>>;
