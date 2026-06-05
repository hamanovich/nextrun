import { getCheckoutSession } from "@/actions/stripe";
import { getSessionUser } from "@/actions/user";
import { logger } from "@/lib/logger";
import { AuthRequiredCard } from "./auth-required-card";
import { ErrorCard } from "./error-card";
import { PaymentPendingCard } from "./payment-pending-card";
import { PaymentSuccessCard } from "./payment-success-card";
import { UnauthorizedCard } from "./unauthorized-card";

interface PaymentSuccessContentProps {
  sessionId: string;
}

export const PaymentSuccessContent = async ({
  sessionId,
}: PaymentSuccessContentProps) => {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    return <AuthRequiredCard />;
  }

  let session: Awaited<ReturnType<typeof getCheckoutSession>>;
  try {
    session = await getCheckoutSession(sessionId);
  } catch (error) {
    logger.error("Error fetching payment details:", error);
    return <ErrorCard />;
  }

  const sessionOwnerId =
    (session.metadata?.userId as string | undefined) ?? null;
  const sessionCustomer = (session.customer as string | null) ?? null;

  if (
    sessionOwnerId !== sessionUser.user.id &&
    sessionCustomer !== sessionUser.user.stripeCustomerId
  ) {
    return <UnauthorizedCard />;
  }

  if (session.payment_status !== "paid") {
    return <PaymentPendingCard />;
  }

  return (
    <PaymentSuccessCard
      amountTotal={session.amount_total}
      currency={session.currency}
      currentCredits={sessionUser.user.stripeCredits}
    />
  );
};
