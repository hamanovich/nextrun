import Link from "next/link";
import { Coins, CreditCard, Wallet } from "lucide-react";
import {
  formatUserData,
  getCreditsStatus,
  hasStripeData,
} from "@/lib/user.utils";
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

export function UserPaymentInformation({ user }: UserPaymentInformationProps) {
  if (!hasStripeData(user)) return null;

  const creditsStatus = getCreditsStatus(user.stripeCredits);

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Wallet className="w-5 h-5" />
          Payment Information
        </CardTitle>
        <CardDescription>
          Your Stripe account details and credit balance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div
            className={`px-6 py-3 rounded-xl border ${creditsStatus.bg} ${creditsStatus.border}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`p-3 rounded-full ${creditsStatus.bg} ${creditsStatus.border}`}
                >
                  <Coins className={`w-6 h-6 ${creditsStatus.color}`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Available Credits
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {user.stripeCredits === 0
                      ? "No credits remaining"
                      : user.stripeCredits < 10
                        ? "Low credit balance"
                        : "Credits available for use"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-3xl font-bold ${creditsStatus.color}`}>
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
          <h4 className="text-sm font-medium text-foreground">
            Account Details
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Customer ID
              </label>
              <div className="p-3 bg-muted/50 rounded-lg border">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-muted-foreground" />
                  <code className="text-sm font-mono text-foreground">
                    {formatUserData(user.stripeCustomerId, "Not created")}
                  </code>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Last Session
              </label>
              <div className="p-3 bg-muted/50 rounded-lg border">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-muted-foreground" />
                  <code className="text-sm font-mono text-foreground">
                    {formatUserData(user.stripeCheckoutSessionId, "None")}
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/pricing" className="flex-1">
            <Button className="w-full" size="lg">
              <Coins className="w-4 h-4 mr-2" />
              Buy Credits
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
