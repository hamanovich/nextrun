import Link from "next/link";
import { getCheckoutSession } from "@/actions/stripe";
import { getSessionUser } from "@/actions/user";
import { logger } from "@/lib/logger";
import { Button } from "@/components/ui/button";
import { PaymentStatusCard } from "./payment-status-card";
import { PaymentSuccessCard } from "./payment-success-card";

interface PaymentSuccessContentProps {
  sessionId: string;
}

const authRequiredCard = (
  <PaymentStatusCard
    title="Authentication Required"
    description="Please sign in to view your payment details."
    action={
      <Button asChild>
        <Link href="/auth/signin">Sign In</Link>
      </Button>
    }
  />
);

export const PaymentSuccessContent = async ({
  sessionId,
}: PaymentSuccessContentProps) => {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    return authRequiredCard;
  }

  let result: Awaited<ReturnType<typeof getCheckoutSession>>;
  try {
    result = await getCheckoutSession(sessionId);
  } catch (error) {
    logger.error("Error fetching payment details:", error);
    return (
      <PaymentStatusCard
        title="Error"
        description="There was an error retrieving your payment details. Please contact support."
      />
    );
  }

  if (result.status === "unauthenticated") {
    return authRequiredCard;
  }

  if (result.status === "unauthorized") {
    return (
      <PaymentStatusCard
        title="Unauthorized"
        description="This payment session does not belong to your account."
      />
    );
  }

  if (result.status === "pending") {
    return (
      <PaymentStatusCard
        tone="default"
        title="Payment Pending"
        description="Your payment is still being processed. Please check back later."
      />
    );
  }

  return (
    <PaymentSuccessCard
      amountTotal={result.amountTotal}
      currency={result.currency}
      currentCredits={sessionUser.user.stripeCredits}
    />
  );
};
