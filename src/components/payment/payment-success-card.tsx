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
  <div className="min-h-screen flex items-center justify-center">
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <CardTitle className="text-green-600">Payment Successful!</CardTitle>
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
