import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/actions/user";
import { Coins, CreditCard } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignOutButton } from "@/components/login/sign-out-button";
import { auth } from "@/lib/auth";

export default async function UserPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const sessionUser = await getSessionUser();
  const user = sessionUser?.user || session.user;

  const hasStripeData = (
    user: unknown,
  ): user is {
    stripeCredits: number;
    stripeCustomerId: string | null;
    stripeCheckoutSessionId: string | null;
  } => user !== null && typeof user === "object" && "stripeCredits" in user;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">User Profile</h1>
        <SignOutButton />
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>Your Google account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage
                  src={user.image || ""}
                  alt={
                    user.name ? `${user.name} profile photo` : "Profile photo"
                  }
                />
                <AvatarFallback>
                  {user.name
                    ? user.name
                        .split(/\s/)
                        .filter(Boolean)
                        .map((n) => n[0]!)
                        .join("")
                        .toUpperCase()
                    : (user.email?.[0]?.toUpperCase() ?? "U")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm text-muted-foreground">Profile Picture</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Name
                </label>
                <p className="text-lg">{user.name || "Not provided"}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Email
                </label>
                <p className="text-lg">{user.email || "Not provided"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {sessionUser && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Information
              </CardTitle>
              <CardDescription>Your Stripe account and credits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Coins className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-600">
                      Credits
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">
                    {hasStripeData(user) ? user.stripeCredits : 0}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-600">
                      Customer ID
                    </span>
                  </div>
                  <p className="text-sm font-mono text-gray-600 truncate">
                    {hasStripeData(user) && user.stripeCustomerId
                      ? `${user.stripeCustomerId.slice(0, 8)}…${user.stripeCustomerId.slice(-4)}`
                      : "Not created"}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-600">
                      Last Session
                    </span>
                  </div>
                  <p className="text-sm font-mono text-gray-600 truncate">
                    {hasStripeData(user)
                      ? user.stripeCheckoutSessionId || "None"
                      : "None"}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Link href="/pricing">
                  <Button>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Buy Credits
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Session Status</CardTitle>
            <CardDescription>
              Authentication and session information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">Authenticated</Badge>
              <Badge variant="secondary">
                Provider:{" "}
                {user.email?.includes("@gmail.com") ? "Google" : "Unknown"}
              </Badge>
              <Badge variant="outline">
                User ID: {user.id || "Not available"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
