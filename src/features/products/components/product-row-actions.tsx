"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

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

import { useDeleteProduct } from "../hooks/use-delete-product";
import { ProductFormDialog } from "./product-form-dialog";
import type { Product } from "../types";

export function ProductRowActions({ product }: { product: Product }) {
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const deleteMutation = useDeleteProduct();
  const t = useTranslations("products");

  return (
    <div className="flex items-center justify-end gap-1">
      <ProductFormDialog
        product={product}
        trigger={
          <Button variant="ghost" size="icon" aria-label={t("editProduct")}>
            <PencilIcon className="size-4" />
          </Button>
        }
      />

      <Button
        variant="ghost"
        size="icon"
        aria-label={t("deleteProduct")}
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
            <DialogTitle>{t("deleteProductTitle", { name: product.name })}</DialogTitle>
            <DialogDescription>{t("deleteProductDescription")}</DialogDescription>
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
              onClick={() =>
                deleteMutation.mutate(product.id, { onSuccess: () => setConfirmOpen(false) })
              }
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? t("deleting") : t("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
