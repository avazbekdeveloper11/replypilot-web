import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateProfile } from "../api/profile.api";
import { meQueryKey } from "./use-me";

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (user) => {
      queryClient.setQueryData(meQueryKey, user);
    },
  });
}
