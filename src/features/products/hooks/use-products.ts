import { useQuery } from "@tanstack/react-query";

import { listProducts } from "../api/products.api";

export const productsQueryKey = ["products"] as const;

export function useProducts() {
  return useQuery({
    queryKey: productsQueryKey,
    queryFn: listProducts,
  });
}
