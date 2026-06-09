"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { logger } from "@/lib/logger";
import { Button } from "@/components/ui/button";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    logger.error("Global application error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="antialiased">
        <div className="container mx-auto px-6 py-16">
          <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
            <div className="mb-8">
              <div className="bg-destructive/10 dark:bg-destructive/20 mb-4 rounded-full p-6">
                <AlertTriangle className="text-destructive size-16" />
              </div>
            </div>

            <div className="mb-8 max-w-md" role="alert">
              <h1 className="mb-4 text-3xl font-semibold">Application Error</h1>
              <p className="text-muted-foreground mb-4 text-lg">
                A critical error occurred in the application. Please try
                refreshing the page or contact support if the problem persists.
              </p>
              {process.env.NODE_ENV === "development" && (
                <details className="bg-muted rounded-lg p-4 text-left">
                  <summary className="mb-2 cursor-pointer font-medium">
                    Error Details (Development)
                  </summary>
                  <pre className="text-muted-foreground overflow-auto text-sm">
                    {error.message}
                    {error.stack && `\n\nStack trace:\n${error.stack}`}
                  </pre>
                </details>
              )}
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                size="lg"
                onClick={reset}
                className="flex items-center gap-2"
              >
                <RefreshCw className="size-4" />
                Try Again
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/" className="flex items-center gap-2">
                  <Home className="size-4" />
                  Go Home
                </Link>
              </Button>
            </div>

            <div className="text-muted-foreground mt-12 text-sm">
              <p>
                If this problem persists, please{" "}
                <Link href="/about" className="text-primary hover:underline">
                  contact support
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
