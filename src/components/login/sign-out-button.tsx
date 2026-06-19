"use client";

import { useSignOut } from "@/hooks/use-sign-out";
import { Button } from "@/components/ui/button";

export const SignOutButton = () => {
  const handleSignOut = useSignOut();

  return (
    <Button variant="outline" onClick={handleSignOut}>
      Sign Out
    </Button>
  );
};
