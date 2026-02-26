"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AppError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="container mx-auto px-6 py-16">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="mb-8">
          <div className="bg-destructive/10 dark:bg-destructive/20 rounded-full p-6 mb-4">
            <AlertTriangle className="size-16 text-destructive" />
          </div>
        </div>

        <div className="mb-8 max-w-md" role="alert">
          <h1 className="text-3xl font-semibold mb-4">Something went wrong!</h1>
          <p className="text-muted-foreground text-lg mb-4">
            We encountered an unexpected error. Don&apos;t worry, our team has
            been notified and we&apos;re working to fix it.
          </p>
          {process.env.NODE_ENV === "development" && (
            <details className="text-left bg-muted p-4 rounded-lg">
              <summary className="cursor-pointer font-medium mb-2">
                Error Details (Development)
              </summary>
              <pre className="text-sm text-muted-foreground overflow-auto">
                {error.message}
                {error.stack && `\n\nStack trace:\n${error.stack}`}
              </pre>
            </details>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" onClick={reset} className="flex items-center gap-2">
            <RefreshCw className="size-4" />
            Try Again
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/" className="flex items-center gap-2">
              <Home className="size-4" />
              Go Home
            </Link>
          </Button>
          <Button
            size="lg"
            variant="ghost"
            onClick={() => window.history.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="size-4" />
            Go Back
          </Button>
        </div>

        <div className="mt-12 text-sm text-muted-foreground">
          <p>
            If this problem persists, please{" "}
            <Link href="/about" className="text-primary hover:underline">
              contact support
            </Link>{" "}
            or check our{" "}
            <Link href="/pricing" className="text-primary hover:underline">
              pricing
            </Link>{" "}
            page.
          </p>
        </div>
      </div>
    </div>
  );
}
