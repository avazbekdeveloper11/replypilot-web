import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateDocument } from "../api/knowledge.api";
import { documentsQueryKey } from "./use-documents";

export function useUpdateDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentsQueryKey });
    },
  });
}
