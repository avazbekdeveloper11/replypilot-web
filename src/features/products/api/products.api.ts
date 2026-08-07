import { apiFetch, apiFetchForm } from "@/lib/api/client";
import type { Product, ProductImportResult } from "../types";

export function listProducts() {
  return apiFetch<Product[]>("/api/products");
}

export interface CreateProductInput {
  name: string;
  description?: string | null;
  /** null means "price on request" — see Product.price_cents's doc comment. */
  price_cents: number | null;
}

export function createProduct(input: CreateProductInput) {
  return apiFetch<Product>("/api/products", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export interface UpdateProductInput extends CreateProductInput {
  id: string;
  is_active: boolean;
}

export function updateProduct({ id, ...input }: UpdateProductInput) {
  return apiFetch<Product>(`/api/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteProduct(id: string) {
  return apiFetch<{ deleted: boolean }>(`/api/products/${id}`, {
    method: "DELETE",
  });
}

/** Bulk import from an uploaded .xlsx — no fixed column template. See
 * product.UseCase.Import's doc comment on the backend for how the AI picks
 * out the name/price columns regardless of their names, order, or
 * language. */
export function importProducts(file: File) {
  const formData = new FormData();
  formData.set("file", file);
  return apiFetchForm<ProductImportResult>("/api/products/import", formData);
}
