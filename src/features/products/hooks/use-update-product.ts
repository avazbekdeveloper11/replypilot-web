import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateProduct } from "../api/products.api";
import { productsQueryKey } from "./use-products";

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productsQueryKey });
    },
  });
}
