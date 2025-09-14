"use client";

import { Suspense } from "react";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";
import { AuthErrorContent } from "@/components/auth/auth-error-content";
import { AuthLoading } from "@/components/auth/auth-loading";

export { metadata } from "./metadata";

export default function AuthErrorPage() {
  const { isLoading } = useAuthRedirect();

  if (isLoading) return <AuthLoading />;

  return (
    <Suspense
      fallback={
        <AuthLoading message="Please wait while we load the error details." />
      }
    >
      <AuthErrorContent />
    </Suspense>
  );
}
