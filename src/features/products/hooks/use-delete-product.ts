import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteProduct } from "../api/products.api";
import { productsQueryKey } from "./use-products";

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productsQueryKey });
    },
  });
}
