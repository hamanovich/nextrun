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
  <div className="bg-gray-50 p-4 rounded-lg">
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium">Amount Paid:</span>
      <span className="font-semibold">
        {formatMoney(amountTotal, currency)} {currency?.toUpperCase()}
      </span>
    </div>
    <div className="flex items-center justify-between mt-2">
      <span className="text-sm font-medium">Current Credits:</span>
      <span className="font-semibold text-blue-600">{currentCredits}</span>
    </div>
  </div>
);
