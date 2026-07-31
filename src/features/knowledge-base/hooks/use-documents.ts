import { useQuery } from "@tanstack/react-query";

import { listDocuments } from "../api/knowledge.api";

export const documentsQueryKey = ["knowledge-base", "documents"] as const;

export function useDocuments() {
  return useQuery({
    queryKey: documentsQueryKey,
    queryFn: listDocuments,
  });
}
