"use client";

import * as React from "react";
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

  function submitDelete() {
    deleteMutation.mutate(document.id, { onSuccess: () => setConfirmOpen(false) });
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Delete document"
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
            <DialogTitle>Delete &quot;{document.title}&quot;?</DialogTitle>
            <DialogDescription>
              Removes the document and every chunk/embedding derived from it. The AI
              stops drawing on it immediately. This can&apos;t be undone.
            </DialogDescription>
          </DialogHeader>

          {deleteMutation.isError && (
            <FormAlert variant="error">
              {deleteMutation.error instanceof ApiError
                ? deleteMutation.error.message
                : "Something went wrong. Please try again."}
            </FormAlert>
          )}

          <DialogFooter>
            <Button
              variant="destructive"
              onClick={submitDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
