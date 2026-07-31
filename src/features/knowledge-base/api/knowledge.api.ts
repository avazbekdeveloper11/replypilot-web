import { apiFetch, apiFetchForm } from "@/lib/api/client";
import type { KnowledgeDocument } from "../types";

export function listDocuments() {
  return apiFetch<KnowledgeDocument[]>("/api/knowledge-base/documents");
}

export function getDocument(id: string) {
  return apiFetch<KnowledgeDocument>(`/api/knowledge-base/documents/${id}`);
}

export function deleteDocument(id: string) {
  return apiFetch<{ deleted: boolean }>(`/api/knowledge-base/documents/${id}`, {
    method: "DELETE",
  });
}

export type UploadDocumentInput =
  | { title: string; kind: "text"; content: string }
  | { title: string; kind: "file"; file: File };

/** Ingested synchronously by the backend — chunked, embedded via Gemini,
 * and written before this resolves. See KnowledgeHandler.Upload's doc
 * comment for why (no background job queue for this flow yet). This call
 * can take several seconds for a large document; the upload form's
 * pending state should reflect that, not read as "stuck". */
export function uploadDocument(input: UploadDocumentInput) {
  const formData = new FormData();
  formData.set("title", input.title);
  if (input.kind === "text") {
    formData.set("content", input.content);
  } else {
    formData.set("file", input.file);
  }
  return apiFetchForm<KnowledgeDocument>("/api/knowledge-base/documents", formData);
}
