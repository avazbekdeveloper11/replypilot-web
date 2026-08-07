"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

import { useImportProducts } from "../hooks/use-import-products";

/** .xlsx only — the backend opens the upload with excelize, which reads
 * the modern OOXML format (not legacy .xls). See ProductHandler.Import's
 * doc comment. */
const ACCEPTED_FILE_EXTENSIONS = ".xlsx";

/**
 * Bulk product import with no fixed column template. The uploaded sheet's
 * columns can be named, ordered, and worded however the merchant's export
 * tool produced them ("Nomi"/"Narxi", "Название"/"Цена", "Name"/"Price",
 * extra columns, a header row or none) — Gemini reads the sheet
 * server-side and figures out which column is the name and which is the
 * price. See product.UseCase.Import's doc comment on the backend for the
 * full behavior, including that a blank/"so'rov asosida" price becomes a
 * price-on-request product (price_cents: null — see Product's doc comment
 * in ../types.ts), not a free (0) one.
 */
export function ImportProductsDialog() {
  const [open, setOpen] = React.useState(false);
  const [file, setFile] = React.useState<File | null>(null);
  const [fileError, setFileError] = React.useState<string | null>(null);
  const mutation = useImportProducts();
  const t = useTranslations("products");
  const tc = useTranslations("common");

  React.useEffect(() => {
    if (!open) return;
    setFile(null);
    setFileError(null);
    mutation.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setFileError(t("chooseExcelFile"));
      return;
    }
    setFileError(null);
    mutation.mutate(file);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <ArrowUpTrayIcon className="size-4" />
          {t("importFromExcel")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("importFromExcel")}</DialogTitle>
          <DialogDescription>{t("importDescription")}</DialogDescription>
        </DialogHeader>

        {mutation.isSuccess ? (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-foreground">
              {t("importSuccessCount", { count: mutation.data.created_count })}
            </p>
            {mutation.data.skipped_rows > 0 && (
              <p className="text-xs text-muted-foreground">
                {t("importSkippedCount", { count: mutation.data.skipped_rows })}
              </p>
            )}
            <DialogFooter>
              <Button onClick={() => setOpen(false)}>{tc("close")}</Button>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="import-file">{t("excelFileLabel")}</Label>
              <Input
                id="import-file"
                type="file"
                accept={ACCEPTED_FILE_EXTENSIONS}
                aria-invalid={!!fileError}
                onChange={(e) => {
                  setFile(e.target.files?.[0] ?? null);
                  setFileError(null);
                }}
              />
              <p className="text-xs text-muted-foreground">{t("importHint")}</p>
              {fileError && <p className="text-xs text-destructive">{fileError}</p>}
            </div>

            {mutation.isError && (
              <FormAlert variant="error">
                {mutation.error instanceof ApiError ? mutation.error.message : t("genericError")}
              </FormAlert>
            )}

            <DialogFooter>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? t("importing") : t("importFromExcel")}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
