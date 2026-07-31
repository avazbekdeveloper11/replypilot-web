import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteDocument } from "../api/knowledge.api";
import { documentsQueryKey } from "./use-documents";

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentsQueryKey });
    },
  });
}
