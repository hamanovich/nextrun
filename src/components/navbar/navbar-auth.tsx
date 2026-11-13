"use client";

import { authClient } from "@/lib/auth-client";
import { useCredits } from "@/hooks/use-credits";
import { SignInButton } from "@/components/auth/sign-in-button";
import { UserMenu } from "./user-menu";

export const NavbarAuth = () => {
  const { data: session, isPending } = authClient.useSession();
  const { data: credits = 0 } = useCredits();

  if (isPending) {
    return <span className="brand-auth-placeholder" aria-hidden="true" />;
  }

  if (session) {
    return <UserMenu session={session} credits={credits} />;
  }

  return <SignInButton className="brand-header-sign-in" />;
};
