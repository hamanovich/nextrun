"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { useCredits } from "@/contexts/credits-context";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LoginBtn } from "@/components/login/login-btn";

interface AuthRequiredFormProps {
  children: ReactNode;
  title?: string;
  description?: string;
  creditsRequired?: number;
}

export function AuthRequiredForm({
  children,
  title = "Authentication Required",
  description = "Please sign in to access this feature.",
  creditsRequired = 1,
}: AuthRequiredFormProps) {
  const { data: session, status } = useSession();
  const { credits: userCredits, isLoading: creditsLoading } = useCredits();

  if (status === "loading" || creditsLoading) {
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
          <LoginBtn />
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
}
