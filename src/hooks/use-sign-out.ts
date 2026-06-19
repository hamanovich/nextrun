"use client";

import { useCallback } from "react";
import { authClient } from "@/lib/auth-client";
import { logger } from "@/lib/logger";

export const useSignOut = () =>
  useCallback(async () => {
    try {
      await authClient.signOut();
      window.location.href = "/";
    } catch (err) {
      logger.error("Sign out failed", err);
    }
  }, []);
