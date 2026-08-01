"use client";

import { useLocale, useTranslations } from "next-intl";
import { BookOpenIcon } from "@heroicons/react/24/outline";

import { Badge } from "@/components/ui/badge";
import { intlLocale, type Locale } from "@/i18n/config";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/data/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { TableSkeleton } from "@/components/feedback/table-skeleton";

import { useDocuments } from "../hooks/use-documents";
import { formatDocumentDate } from "../lib/format";
import { DocumentRowActions } from "./document-row-actions";

const STATUS_VARIANT: Record<string, "success" | "warning" | "destructive" | "secondary"> = {
  ready: "success",
  processing: "warning",
  pending: "secondary",
  failed: "destructive",
};

/** Keys into the "documentSource" message namespace. */
const SOURCE_LABEL_KEY: Record<string, string> = {
  manual_text: "pastedText",
  file: "fileUpload",
  url: "url",
  faq: "faq",
};

export function DocumentsTable() {
  const { data, isPending, isError, error, refetch } = useDocuments();
  const t = useTranslations("knowledgeBase");
  const tSource = useTranslations("documentSource");
  const tStatus = useTranslations("documentStatus");
  const locale = useLocale() as Locale;

  if (isPending) return <TableSkeleton columns={4} rows={5} />;

  if (isError) {
    return (
      <ErrorState
        title={t("couldntLoadDocuments")}
        description={error instanceof Error ? error.message : undefined}
        onRetry={() => refetch()}
      />
    );
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon={BookOpenIcon}
        title={t("noDocumentsYet")}
        description={t("noDocumentsDescription")}
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("title")}</TableHead>
          <TableHead>{t("source")}</TableHead>
          <TableHead>{t("status")}</TableHead>
          <TableHead>{t("uploaded")}</TableHead>
          <TableHead className="w-10" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((doc) => (
          <TableRow key={doc.id}>
            <TableCell>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">{doc.title}</span>
                {doc.status === "failed" && doc.error_message && (
                  <span className="text-xs text-destructive">{doc.error_message}</span>
                )}
              </div>
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {SOURCE_LABEL_KEY[doc.source_type] ? tSource(SOURCE_LABEL_KEY[doc.source_type]) : doc.source_type}
            </TableCell>
            <TableCell>
              <Badge variant={STATUS_VARIANT[doc.status] ?? "secondary"}>
                {tStatus.has(doc.status) ? tStatus(doc.status) : doc.status}
              </Badge>
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {formatDocumentDate(doc.created_at, intlLocale(locale))}
            </TableCell>
            <TableCell>
              <DocumentRowActions document={doc} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
