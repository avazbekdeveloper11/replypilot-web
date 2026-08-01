"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { TrashIcon } from "@heroicons/react/24/outline";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormAlert } from "@/components/feedback/form-alert";
import { ApiError } from "@/lib/api/errors";

import { useDeleteDocument } from "../hooks/use-delete-document";
import type { KnowledgeDocument } from "../types";

export function DocumentRowActions({ document }: { document: KnowledgeDocument }) {
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const deleteMutation = useDeleteDocument();
  const t = useTranslations("knowledgeBase");

  function submitDelete() {
    deleteMutation.mutate(document.id, { onSuccess: () => setConfirmOpen(false) });
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        aria-label={t("deleteDocument")}
        onClick={() => {
          deleteMutation.reset();
          setConfirmOpen(true);
        }}
      >
        <TrashIcon className="size-4" />
      </Button>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("deleteDocumentTitle", { title: document.title })}</DialogTitle>
            <DialogDescription>{t("deleteDocumentDescription")}</DialogDescription>
          </DialogHeader>

          {deleteMutation.isError && (
            <FormAlert variant="error">
              {deleteMutation.error instanceof ApiError
                ? deleteMutation.error.message
                : t("genericError")}
            </FormAlert>
          )}

          <DialogFooter>
            <Button
              variant="destructive"
              onClick={submitDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? t("deleting") : t("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
