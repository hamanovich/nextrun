"use client";

import { KeyRound } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useCredits } from "@/hooks/use-credits";
import { SignInButton } from "@/components/auth/sign-in-button";
import { UserMenu } from "./user-menu";

export const NavbarAuth = () => {
  const { data: session, isPending } = authClient.useSession();
  const { data: credits = 0 } = useCredits();

  if (isPending) {
    return <div className="bg-muted size-8 animate-pulse rounded-full" />;
  }

  if (session) {
    return <UserMenu session={session} credits={credits} />;
  }

  return (
    <SignInButton>
      <KeyRound />
      Sign in
    </SignInButton>
  );
};
