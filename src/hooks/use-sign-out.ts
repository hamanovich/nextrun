"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { logger } from "@/lib/logger";

export const useSignOut = () => {
  const router = useRouter();

  return useCallback(async () => {
    try {
      await authClient.signOut();
      router.replace("/");
      router.refresh();
    } catch (err) {
      logger.error("Sign out failed", err);
    }
  }, [router]);
};
