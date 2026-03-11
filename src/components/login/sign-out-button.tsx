"use client";

import { authClient } from "@/lib/auth-client";
import { logger } from "@/lib/logger";
import { Button } from "@/components/ui/button";

export const SignOutButton = () => {
  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      window.location.href = "/";
    } catch (err) {
      logger.error("Sign out failed", err);
    }
  };

  return (
    <Button variant="outline" onClick={handleSignOut}>
      Sign Out
    </Button>
  );
};
