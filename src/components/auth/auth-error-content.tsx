"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export const AuthErrorContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get("error");

  useEffect(() => {
    if (error === "OAuthCallbackError" || error === "AccessDenied") {
      const timer = setTimeout(() => {
        router.push("/");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error, router]);

  const isOAuthCancellation =
    error === "OAuthCallbackError" || error === "AccessDenied";

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="mb-8">
          <div className="bg-destructive/10 dark:bg-destructive/20 mb-4 rounded-full p-6">
            <AlertCircle className="text-destructive size-16" />
          </div>
        </div>

        <div className="mb-8 max-w-md">
          {isOAuthCancellation ? (
            <>
              <h1 className="mb-4 text-3xl font-semibold">Sign-in Failed</h1>
              <p className="text-muted-foreground mb-4 text-lg">
                There was a problem with the sign-in process. You&apos;ll be
                redirected to the home page in a moment.
              </p>
              <p className="text-muted-foreground text-sm">
                If you want to try signing in again, you can use the sign-in
                button on the home page.
              </p>
            </>
          ) : (
            <>
              <h1 className="mb-4 text-3xl font-semibold">
                Authentication Error
              </h1>
              <p className="text-muted-foreground mb-4 text-lg">
                There was an error during the authentication process.
              </p>
              {error && (
                <p className="text-muted-foreground text-sm">Error: {error}</p>
              )}
            </>
          )}
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/" className="flex items-center gap-2">
              <Home className="size-4" />
              Go Home
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="size-4" />
            Go Back
          </Button>
        </div>

        {isOAuthCancellation && (
          <div className="text-muted-foreground mt-8 text-sm">
            <p>Redirecting to home page...</p>
          </div>
        )}
      </div>
    </div>
  );
};
