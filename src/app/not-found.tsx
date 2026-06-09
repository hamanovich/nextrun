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
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold tracking-tighter">404</h1>
        </div>

        <div className="mb-8 max-w-md">
          <h2 className="mb-4 text-3xl font-semibold">Page Not Found</h2>
          <p className="text-muted-foreground text-lg">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. The
            page might have been moved, deleted, or doesn&apos;t exist.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
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

        <div className="text-muted-foreground mt-12 text-sm">
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
