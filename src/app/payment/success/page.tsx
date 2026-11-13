import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/brand/button";
import { PaymentSuccessContent } from "@/components/payment/payment-success-content";

interface PaymentSuccessPageProps {
  searchParams: Promise<{
    session_id?: string;
  }>;
}

export const metadata: Metadata = {
  title: "Payment status - NextRun",
  description: "Review the status of your NextRun credit purchase.",
  openGraph: {
    title: "Payment status - NextRun",
    description: "Review the status of your NextRun credit purchase.",
    type: "website",
    images: [
      { url: "/opengraph-image", width: 1200, height: 630, alt: "NextRun" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Payment status - NextRun",
    description: "Review the status of your NextRun credit purchase.",
    images: [{ url: "/opengraph-image", alt: "NextRun" }],
  },
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
};

export default async function PaymentSuccessPage({
  searchParams,
}: PaymentSuccessPageProps) {
  const sessionId = (await searchParams).session_id;

  if (!sessionId) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive text-center">
              <h1 className="text-3xl leading-9 font-semibold">
                Invalid Session
              </h1>
            </CardTitle>
            <CardDescription className="text-center">
              No session ID provided. Please try again.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild variant="outline">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div
          className="flex min-h-[60vh] items-center justify-center"
          role="status"
          aria-live="polite"
        >
          <Loader2
            className="text-muted-foreground size-6 animate-spin"
            aria-hidden="true"
          />
          <span className="sr-only">Loading payment result…</span>
        </div>
      }
    >
      <PaymentSuccessContent sessionId={sessionId} />
    </Suspense>
  );
}
