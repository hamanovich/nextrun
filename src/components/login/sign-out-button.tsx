"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export const SignOutButton = () => {
  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: "/" });
    } catch (err) {
      console.error("Sign out failed", err);
    }
  };

  return (
    <Button variant="outline" onClick={handleSignOut}>
      Sign Out
    </Button>
  );
};
