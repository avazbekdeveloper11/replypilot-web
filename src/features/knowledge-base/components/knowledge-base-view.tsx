import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { DocumentsTable } from "./documents-table";

export async function KnowledgeBaseView() {
  const t = await getTranslations("knowledgeBase");

  return (
    <>
      <PageHeader
        title={t("pageTitle")}
        description={t("pageDescription")}
        actions={
          <Button asChild>
            <Link href="/knowledge-base/upload">{t("uploadDocuments")}</Link>
          </Button>
        }
      />
      <Card>
        <CardContent>
          <DocumentsTable />
        </CardContent>
      </Card>
    </>
  );
}
