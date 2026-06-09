import { formatMoney } from "@/lib/utils";

interface PaymentDetailsProps {
  amountTotal: number | null;
  currency: string | null;
  currentCredits: number;
}

export const PaymentDetails = ({
  amountTotal,
  currency,
  currentCredits,
}: PaymentDetailsProps) => (
  <div className="bg-muted rounded-lg p-4">
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium">Amount Paid:</span>
      <span className="font-semibold">
        {formatMoney(amountTotal, currency)} {currency?.toUpperCase()}
      </span>
    </div>
    <div className="mt-2 flex items-center justify-between">
      <span className="text-sm font-medium">Current Credits:</span>
      <span className="text-foreground font-semibold">{currentCredits}</span>
    </div>
  </div>
);
