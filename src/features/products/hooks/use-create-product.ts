import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createProduct } from "../api/products.api";
import { productsQueryKey } from "./use-products";

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productsQueryKey });
    },
  });
}
