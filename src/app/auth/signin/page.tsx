import Link from "next/link";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthRedirectGuard } from "@/components/auth/auth-redirect-guard";
import { SignInButton } from "@/components/auth/sign-in-button";

export default function SignInPage() {
  return (
    <AuthRedirectGuard>
      <div className="container mx-auto px-6 py-12">
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <h1 className="mb-4 text-3xl font-semibold">Sign In</h1>
          <p className="text-muted-foreground mb-8 text-lg">
            Choose your preferred sign-in method
          </p>

          <div className="space-y-4">
            <SignInButton
              size="lg"
              callbackURL="/"
              className="w-full sm:w-auto"
            >
              Sign in with Google
            </SignInButton>
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
    </AuthRedirectGuard>
  );
}
