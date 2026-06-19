import { Suspense } from "react";
import { AuthErrorContent } from "@/components/auth/auth-error-content";
import { AuthLoading } from "@/components/auth/auth-loading";
import { AuthRedirectGuard } from "@/components/auth/auth-redirect-guard";

export default function AuthErrorPage() {
  return (
    <AuthRedirectGuard>
      <Suspense
        fallback={
          <AuthLoading message="Please wait while we load the error details." />
        }
      >
        <AuthErrorContent />
      </Suspense>
    </AuthRedirectGuard>
  );
}
