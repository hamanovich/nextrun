import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { getCreditsStatus, hasStripeData } from "@/lib/user.utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/brand/button";

export type UserPaymentInformationProps = {
  user: {
    stripeCredits?: number;
    stripeCustomerId?: string | null;
    stripeCheckoutSessionId?: string | null;
  };
};

export const UserPaymentInformation = ({
  user,
}: UserPaymentInformationProps) => {
  if (!hasStripeData(user)) return null;
  const { status } = getCreditsStatus(user.stripeCredits);
  const description =
    status === "empty"
      ? "No credits remaining"
      : status === "low"
        ? "Low credit balance"
        : "Credits available for use";

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>Credits</h2>
        </CardTitle>
        <CardDescription>
          View your balance and add credits when you need them.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-muted-foreground">Available credits</p>
            <p className="text-2xl leading-8 font-semibold tabular-nums">
              {user.stripeCredits}
            </p>
            <p className="text-muted-foreground text-xs">{description}</p>
          </div>
          <Button asChild>
            <Link href="/pricing">Buy credits</Link>
          </Button>
        </div>
      </CardContent>
      <CardFooter className="block">
        <Collapsible className="border-border border-t pt-4">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="group">
              Billing details
              <ChevronDown
                className="size-4 group-data-[state=open]:rotate-180"
                aria-hidden
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <dl className="mt-4 grid gap-4 pb-1 sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground text-xs">Customer ID</dt>
                <dd className="mt-1 wrap-anywhere select-all">
                  {user.stripeCustomerId || "Not created"}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground text-xs">Last session</dt>
                <dd className="mt-1 wrap-anywhere select-all">
                  {user.stripeCheckoutSessionId || "None"}
                </dd>
              </div>
            </dl>
          </CollapsibleContent>
        </Collapsible>
      </CardFooter>
    </Card>
  );
};
