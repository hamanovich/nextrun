import Link from "next/link";
import { Coins, CreditCard, Wallet } from "lucide-react";
import {
  formatUserData,
  getCreditsStatus,
  hasStripeData,
} from "@/lib/user.utils";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export interface UserPaymentInformationProps {
  user: {
    stripeCredits?: number;
    stripeCustomerId?: string | null;
    stripeCheckoutSessionId?: string | null;
  };
}

export const UserPaymentInformation = ({
  user,
}: UserPaymentInformationProps) => {
  if (!hasStripeData(user)) return null;

  const creditsStatus = getCreditsStatus(user.stripeCredits);

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Wallet className="h-5 w-5" />
          Payment Information
        </CardTitle>
        <CardDescription>
          Your Stripe account details and credit balance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div
            className={cn(
              "rounded-xl border px-6 py-3",
              creditsStatus.bg,
              creditsStatus.border,
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "rounded-full p-3",
                    creditsStatus.bg,
                    creditsStatus.border,
                  )}
                >
                  <Coins className={cn("h-6 w-6", creditsStatus.color)} />
                </div>
                <div>
                  <h3 className="text-foreground text-lg font-semibold">
                    Available Credits
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {user.stripeCredits === 0
                      ? "No credits remaining"
                      : user.stripeCredits < 10
                        ? "Low credit balance"
                        : "Credits available for use"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className={cn("text-3xl font-bold", creditsStatus.color)}>
                  {user.stripeCredits}
                </div>
                <Badge
                  variant={
                    creditsStatus.status === "empty"
                      ? "destructive"
                      : creditsStatus.status === "low"
                        ? "secondary"
                        : "default"
                  }
                  className="text-xs"
                >
                  {creditsStatus.status === "empty"
                    ? "Empty"
                    : creditsStatus.status === "low"
                      ? "Low"
                      : "Active"}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <h4 className="text-foreground text-sm font-medium">
            Account Details
          </h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                Customer ID
              </label>
              <div className="bg-muted/50 rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="text-muted-foreground h-4 w-4" />
                  <code className="text-foreground font-mono text-sm">
                    {formatUserData(user.stripeCustomerId, "Not created")}
                  </code>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                Last Session
              </label>
              <div className="bg-muted/50 rounded-lg border p-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="text-muted-foreground h-4 w-4" />
                  <code className="text-foreground font-mono text-sm">
                    {formatUserData(user.stripeCheckoutSessionId, "None")}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/pricing" className="flex-1">
            <Button className="w-full" size="lg">
              <Coins className="mr-2 h-4 w-4" />
              Buy Credits
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
