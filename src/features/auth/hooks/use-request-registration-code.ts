import { useMutation } from "@tanstack/react-query";

import { requestRegistrationCode } from "../api/auth.api";

export function useRequestRegistrationCode() {
  return useMutation({
    mutationFn: (email: string) => requestRegistrationCode(email),
  });
}
