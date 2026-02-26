"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export const useAuthRedirect = (redirectTo: string = "/") => {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isPending) return;
    if (session && redirectTo && pathname !== redirectTo)
      router.replace(redirectTo);
  }, [isPending, session, pathname, router, redirectTo]);

  return { session, isLoading: isPending };
};
