/** Mirrors backend/internal/delivery/http/v1/dto.go's KnowledgeDocumentResponse
 * exactly, same convention as every other features/*\/types.ts. Deliberately
 * has no chunk content or embeddings — those are internal to the RAG
 * pipeline, not something this page renders. `content` is the editable
 * source text (see entity.KnowledgeDocument.Content's doc comment on the
 * backend) — undefined for documents ingested before that column existed. */
export interface KnowledgeDocument {
  id: string;
  title: string;
  source_type: "manual_text" | "file" | "url" | "faq";
  content?: string | null;
  status: "pending" | "processing" | "ready" | "failed";
  error_message?: string;
  created_at: string;
}
