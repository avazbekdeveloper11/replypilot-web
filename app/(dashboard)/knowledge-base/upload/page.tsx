import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { UploadDocumentForm } from "@/features/knowledge-base/components/upload-document-form";

export const metadata: Metadata = { title: "Upload Documents" };

export default function UploadDocumentsPage() {
  return (
    <>
      <PageHeader
        title="Upload Documents"
        description="Ingested synchronously — chunked and embedded via Gemini before this returns, so it can take a moment for a large document."
      />
      <UploadDocumentForm />
    </>
  );
}
