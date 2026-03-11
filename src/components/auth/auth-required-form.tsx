"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { KeyRound } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useCredits } from "@/hooks/use-credits";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignInButton } from "./sign-in-button";

interface AuthRequiredFormProps {
  children: ReactNode;
  title?: string;
  description?: string;
  creditsRequired?: number;
}

export const AuthRequiredForm = ({
  children,
  title = "Authentication Required",
  description = "Please sign in to access this feature.",
  creditsRequired = 1,
}: AuthRequiredFormProps) => {
  const { data: session, isPending } = authClient.useSession();
  const { data: userCredits = 0, isLoading: creditsLoading } = useCredits();

  if (isPending || creditsLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (!session) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-destructive">
            {title}
          </CardTitle>
          <CardDescription className="text-center">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <SignInButton>
            <KeyRound />
            Sign in
          </SignInButton>
        </CardContent>
      </Card>
    );
  }

  if (userCredits < creditsRequired) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-orange-600">
            Insufficient Credits
          </CardTitle>
          <CardDescription className="text-center">
            You need at least {creditsRequired}{" "}
            {creditsRequired === 1 ? "credit" : "credits"} to use this feature.
            <br />
            You currently have {userCredits}{" "}
            {userCredits === 1 ? "credit" : "credits"}.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Purchase more credits to continue using our language learning
            features.
          </p>
          <Button asChild className="w-full">
            <Link href="/pricing">Buy More Credits</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
};
