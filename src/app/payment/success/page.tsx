import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PaymentSuccessContent } from "@/components/payment/payment-success-content";

interface PaymentSuccessPageProps {
  searchParams: {
    session_id?: string;
  };
}

export const metadata: Metadata = {
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
            <CardTitle className="text-center text-destructive">
              Invalid Session
            </CardTitle>
            <CardDescription className="text-center">
              No session ID provided. Please try again.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
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
