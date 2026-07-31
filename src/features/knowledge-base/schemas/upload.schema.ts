import { z } from "zod";

export const uploadTextSchema = z.object({
  title: z.string().min(1, "Title is required").max(120, "Keep it under 120 characters"),
  content: z.string().min(1, "Paste some content").max(200_000, "That's too long for one document"),
});
export type UploadTextValues = z.infer<typeof uploadTextSchema>;

export const uploadFileTitleSchema = z.object({
  title: z.string().min(1, "Title is required").max(120, "Keep it under 120 characters"),
});
export type UploadFileTitleValues = z.infer<typeof uploadFileTitleSchema>;
