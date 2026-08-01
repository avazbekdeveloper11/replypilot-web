import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/layout/page-header";
import { UploadDocumentForm } from "@/features/knowledge-base/components/upload-document-form";

export const metadata: Metadata = { title: "Upload Documents" };

export default async function UploadDocumentsPage() {
  const t = await getTranslations("knowledgeBase");

  return (
    <>
      <PageHeader title={t("uploadPageTitle")} description={t("uploadPageDescription")} />
      <UploadDocumentForm />
    </>
  );
}
