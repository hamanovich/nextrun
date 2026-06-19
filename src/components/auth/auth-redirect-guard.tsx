"use client";

import { type ReactNode } from "react";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";
import { AuthLoading } from "./auth-loading";

interface AuthRedirectGuardProps {
  children: ReactNode;
  loadingMessage?: string;
}

export const AuthRedirectGuard = ({
  children,
  loadingMessage,
}: AuthRedirectGuardProps) => {
  const { isLoading } = useAuthRedirect();

  if (isLoading) return <AuthLoading message={loadingMessage} />;

  return <>{children}</>;
};
