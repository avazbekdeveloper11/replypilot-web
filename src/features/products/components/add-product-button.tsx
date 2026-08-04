"use client";

import { useTranslations } from "next-intl";
import { PlusIcon } from "@heroicons/react/24/outline";

import { Button } from "@/components/ui/button";

import { ProductFormDialog } from "./product-form-dialog";

/** Client wrapper so the server-rendered ProductsView can pass this into
 * PageHeader's `actions` slot without itself needing "use client" — same
 * split as ConnectInstagramButton relative to instagram-accounts-view.tsx. */
export function AddProductButton() {
  const t = useTranslations("products");

  return (
    <ProductFormDialog
      trigger={
        <Button>
          <PlusIcon className="size-4" />
          {t("addProduct")}
        </Button>
      }
    />
  );
}
