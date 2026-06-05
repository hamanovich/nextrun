import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const PaymentPendingCard = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center">Payment Pending</CardTitle>
        <CardDescription className="text-center">
          Your payment is still being processed. Please check back later.
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
