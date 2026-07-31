import Link from "next/link";

import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { DocumentsTable } from "./documents-table";

export function KnowledgeBaseView() {
  return (
    <>
      <PageHeader
        title="Knowledge Base"
        description="The documents the AI is grounded to — it answers from these only."
        actions={
          <Button asChild>
            <Link href="/knowledge-base/upload">Upload documents</Link>
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
