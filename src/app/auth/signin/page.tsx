"use client";

import Link from "next/link";
import { Home } from "lucide-react";
import { signIn } from "next-auth/react";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";
import { Button } from "@/components/ui/button";
import { AuthLoading } from "@/components/auth/auth-loading";

export default function SignInPage() {
  const { isLoading } = useAuthRedirect();

  if (isLoading) return <AuthLoading />;

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="text-3xl font-semibold mb-4">Sign In</h1>
        <p className="text-muted-foreground text-lg mb-8">
          Choose your preferred sign-in method
        </p>

        <div className="space-y-4">
          <Button
            size="lg"
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full sm:w-auto"
          >
            Sign in with Google
          </Button>
        </div>

        <div className="mt-8">
          <Button variant="outline" asChild>
            <Link href="/" className="flex items-center gap-2">
              <Home className="size-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
