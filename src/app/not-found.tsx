"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const router = useRouter();

  const handleGoBack = () =>
    history.length > 1 ? router.back() : router.push("/");

  return (
    <div className="container mx-auto px-6 py-16">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-transparent bg-linear-to-br bg-clip-text from-teal-500 via-indigo-500 to-sky-500 dark:from-teal-200 dark:via-indigo-300 dark:to-sky-500">
            404
          </h1>
        </div>

        <div className="mb-8 max-w-md">
          <h2 className="text-3xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-muted-foreground text-lg">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. The
            page might have been moved, deleted, or doesn&apos;t exist.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" asChild>
            <Link href="/" className="flex items-center gap-2">
              <Home className="size-4" />
              Go Home
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/pricing" className="flex items-center gap-2">
              <Search className="size-4" />
              View Pricing
            </Link>
          </Button>
          <Button
            size="lg"
            variant="ghost"
            onClick={handleGoBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="size-4" />
            Go Back
          </Button>
        </div>

        <div className="mt-12 text-sm text-muted-foreground">
          <p>
            Need help? Check out our{" "}
            <Link href="/pricing" className="text-primary hover:underline">
              pricing
            </Link>{" "}
            or{" "}
            <Link href="/about" className="text-primary hover:underline">
              about
            </Link>{" "}
            pages.
          </p>
        </div>
      </div>
    </div>
  );
}
