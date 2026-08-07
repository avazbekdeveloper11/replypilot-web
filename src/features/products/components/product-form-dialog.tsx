"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

import { buildProductSchema, type ProductFormValues } from "../schemas/product.schema";
import { useCreateProduct } from "../hooks/use-create-product";
import { useUpdateProduct } from "../hooks/use-update-product";
import type { Product } from "../types";

/**
 * Handles both create and edit — passing `product` switches it into edit
 * mode (pre-fills the form, calls useUpdateProduct, shows the
 * active/inactive Select). Create always defaults to active, matching
 * CreateProductRequest having no is_active field at all on the backend.
 */
export function ProductFormDialog({
  product,
  trigger,
}: {
  product?: Product;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const t = useTranslations("products");
  const tv = useTranslations("validation");
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const mutation = product ? updateMutation : createMutation;
  const isEdit = !!product;

  const productSchema = React.useMemo(() => buildProductSchema(tv), [tv]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      price: product?.price_cents != null ? product.price_cents / 100 : undefined,
      is_active: product?.is_active ?? true,
    },
  });

  React.useEffect(() => {
    if (!open) return;
    form.reset({
      name: product?.name ?? "",
      description: product?.description ?? "",
      price: product?.price_cents != null ? product.price_cents / 100 : undefined,
      is_active: product?.is_active ?? true,
    });
    mutation.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function onSubmit(values: ProductFormValues) {
    const basePayload = {
      name: values.name,
      description: values.description && values.description.trim() !== "" ? values.description : null,
      // Left empty -> null -> "narxi so'rov asosida" on the backend, not 0
      // (a real free-of-charge product is a different, explicit state this
      // form doesn't offer — see entity.Product's doc comment).
      price_cents: values.price != null ? Math.round(values.price * 100) : null,
    };

    if (product) {
      updateMutation.mutate(
        { id: product.id, ...basePayload, is_active: values.is_active },
        { onSuccess: () => setOpen(false) },
      );
    } else {
      createMutation.mutate(basePayload, { onSuccess: () => setOpen(false) });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? t("editProductTitle") : t("addProductTitle")}</DialogTitle>
          <DialogDescription>{t("productFormDescription")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="product-name">{t("nameLabel")}</Label>
            <Input
              id="product-name"
              aria-invalid={!!form.formState.errors.name}
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="product-price">{t("priceLabel")}</Label>
            <Input
              id="product-price"
              type="number"
              min={0}
              step="any"
              inputMode="decimal"
              aria-invalid={!!form.formState.errors.price}
              {...form.register("price", {
                // Not valueAsNumber: true — an empty input becomes NaN under
                // that option, not undefined, which would trip .positive()
                // instead of leaving an intentionally-blank ("price on
                // request") field valid. See product.schema.ts's doc comment.
                setValueAs: (v) => (v === "" || v === null ? undefined : Number(v)),
              })}
            />
            {form.formState.errors.price ? (
              <p className="text-xs text-destructive">{form.formState.errors.price.message}</p>
            ) : (
              <p className="text-xs text-muted-foreground">{t("priceOptionalHint")}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="product-description">{t("descriptionLabel")}</Label>
            <Textarea
              id="product-description"
              rows={3}
              aria-invalid={!!form.formState.errors.description}
              {...form.register("description")}
            />
            {form.formState.errors.description && (
              <p className="text-xs text-destructive">{form.formState.errors.description.message}</p>
            )}
          </div>

          {isEdit && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="product-status">{t("statusLabel")}</Label>
              <Select
                value={form.watch("is_active") ? "active" : "inactive"}
                onValueChange={(value) =>
                  form.setValue("is_active", value === "active", { shouldValidate: true })
                }
              >
                <SelectTrigger id="product-status" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">{t("active")}</SelectItem>
                  <SelectItem value="inactive">{t("inactive")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {mutation.isError && (
            <FormAlert variant="error">
              {mutation.error instanceof ApiError ? mutation.error.message : t("genericError")}
            </FormAlert>
          )}

          <DialogFooter>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? t("saving") : isEdit ? t("saveChanges") : t("addProduct")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
