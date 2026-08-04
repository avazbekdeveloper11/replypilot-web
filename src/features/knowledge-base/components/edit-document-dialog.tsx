"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { PencilIcon } from "@heroicons/react/24/outline";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormAlert } from "@/components/feedback/form-alert";
import { ApiError } from "@/lib/api/errors";

import { buildEditDocumentSchema, type EditDocumentValues } from "../schemas/edit.schema";
import { useUpdateDocument } from "../hooks/use-update-document";
import type { KnowledgeDocument } from "../types";

/**
 * Editing the content re-chunks and re-embeds the whole document from
 * scratch server-side (see KnowledgeHandler.Update's doc comment) — same
 * cost/latency as a fresh upload, so the submit button reflects that with
 * "saving…" the same way the upload form's does, not an instant save.
 *
 * `document.content` is undefined for anything ingested before the
 * content column existed (see KnowledgeDocument.content's doc comment) —
 * the textarea just starts empty in that case; saving fills it in and
 * upgrades the document going forward.
 */
export function EditDocumentDialog({ document }: { document: KnowledgeDocument }) {
  const [open, setOpen] = React.useState(false);
  const mutation = useUpdateDocument();
  const t = useTranslations("knowledgeBase");
  const tv = useTranslations("validation");

  const editDocumentSchema = React.useMemo(() => buildEditDocumentSchema(tv), [tv]);

  const form = useForm<EditDocumentValues>({
    resolver: zodResolver(editDocumentSchema),
    defaultValues: { title: document.title, content: document.content ?? "" },
  });

  React.useEffect(() => {
    if (!open) return;
    form.reset({ title: document.title, content: document.content ?? "" });
    mutation.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function onSubmit(values: EditDocumentValues) {
    mutation.mutate(
      { id: document.id, title: values.title, content: values.content },
      { onSuccess: () => setOpen(false) },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t("editDocument")}>
          <PencilIcon className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("editDocumentTitle")}</DialogTitle>
          <DialogDescription>{t("editDocumentDescription")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-doc-title">{t("titleLabel")}</Label>
            <Input
              id="edit-doc-title"
              aria-invalid={!!form.formState.errors.title}
              {...form.register("title")}
            />
            {form.formState.errors.title && (
              <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-doc-content">{t("contentLabel")}</Label>
            <Textarea
              id="edit-doc-content"
              rows={12}
              aria-invalid={!!form.formState.errors.content}
              {...form.register("content")}
            />
            {form.formState.errors.content && (
              <p className="text-xs text-destructive">{form.formState.errors.content.message}</p>
            )}
          </div>

          {mutation.isError && (
            <FormAlert variant="error">
              {mutation.error instanceof ApiError ? mutation.error.message : t("genericError")}
            </FormAlert>
          )}

          <DialogFooter>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? t("saving") : t("saveChanges")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
