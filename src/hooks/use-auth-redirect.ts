"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export function useAuthRedirect(redirectTo: string = "/") {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "loading") return;
    if (status === "authenticated" && redirectTo && pathname !== redirectTo)
      router.replace(redirectTo);
  }, [status, pathname, router, redirectTo]);

  return { session, isLoading: status === "loading" };
}
