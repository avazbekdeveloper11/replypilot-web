import { useMutation, useQueryClient } from "@tanstack/react-query";

import { importProducts } from "../api/products.api";
import { productsQueryKey } from "./use-products";

export function useImportProducts() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: importProducts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productsQueryKey });
    },
  });
}
