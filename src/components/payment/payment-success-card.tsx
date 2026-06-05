import { CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ActionButtons } from "./action-buttons";
import { PaymentDetails } from "./payment-details";

interface PaymentSuccessCardProps {
  amountTotal: number | null;
  currency: string | null;
  currentCredits: number;
}

export const PaymentSuccessCard = ({
  amountTotal,
  currency,
  currentCredits,
}: PaymentSuccessCardProps) => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="bg-muted mx-auto mb-4 flex size-16 items-center justify-center rounded-full">
          <CheckCircle className="text-foreground size-8" />
        </div>
        <CardTitle>Payment Successful!</CardTitle>
        <CardDescription>
          Thank you for your purchase. Your credits have been added to your
          account.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <PaymentDetails
          amountTotal={amountTotal}
          currency={currency}
          currentCredits={currentCredits}
        />
        <ActionButtons />
      </CardContent>
    </Card>
  </div>
);
