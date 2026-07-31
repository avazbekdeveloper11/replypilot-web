"use client";

import { BookOpenIcon } from "@heroicons/react/24/outline";

import { Badge } from "@/components/ui/badge";
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

const SOURCE_LABEL: Record<string, string> = {
  manual_text: "Pasted text",
  file: "File upload",
  url: "URL",
  faq: "FAQ",
};

export function DocumentsTable() {
  const { data, isPending, isError, error, refetch } = useDocuments();

  if (isPending) return <TableSkeleton columns={4} rows={5} />;

  if (isError) {
    return (
      <ErrorState
        title="Couldn't load documents"
        description={error instanceof Error ? error.message : undefined}
        onRetry={() => refetch()}
      />
    );
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon={BookOpenIcon}
        title="No documents yet"
        description="Upload a document to start grounding the AI's replies in your own content."
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Source</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Uploaded</TableHead>
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
              {SOURCE_LABEL[doc.source_type] ?? doc.source_type}
            </TableCell>
            <TableCell>
              <Badge variant={STATUS_VARIANT[doc.status] ?? "secondary"}>{doc.status}</Badge>
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {formatDocumentDate(doc.created_at)}
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
