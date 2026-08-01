import { z } from "zod";

/** Factories, not constants — see features/auth/schemas/login.schema.ts's
 * doc comment on why (no React context at zod-schema-definition time). */
export function buildUploadTextSchema(t: (key: string) => string) {
  return z.object({
    title: z.string().min(1, t("titleRequired")).max(120, t("titleTooLong")),
    content: z.string().min(1, t("pasteSomeContent")).max(200_000, t("contentTooLong")),
  });
}
export type UploadTextValues = z.infer<ReturnType<typeof buildUploadTextSchema>>;

export function buildUploadFileTitleSchema(t: (key: string) => string) {
  return z.object({
    title: z.string().min(1, t("titleRequired")).max(120, t("titleTooLong")),
  });
}
export type UploadFileTitleValues = z.infer<
  ReturnType<typeof buildUploadFileTitleSchema>
>;
