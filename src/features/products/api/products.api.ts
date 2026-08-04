import { apiFetch } from "@/lib/api/client";
import type { Product } from "../types";

export function listProducts() {
  return apiFetch<Product[]>("/api/products");
}

export interface CreateProductInput {
  name: string;
  description?: string | null;
  price_cents: number;
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
