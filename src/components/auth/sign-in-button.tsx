"use client";

import { type ReactNode } from "react";
import { type VariantProps } from "class-variance-authority";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

interface SignInButtonProps {
  className?: string;
  children?: ReactNode;
  size?: VariantProps<typeof buttonVariants>["size"];
  variant?: VariantProps<typeof buttonVariants>["variant"];
  callbackURL?: string;
}

export const SignInButton = ({
  className,
  children = "Sign in",
  size,
  variant,
  callbackURL,
}: SignInButtonProps) => (
  <Button
    className={cn(className)}
    size={size}
    variant={variant}
    onClick={() =>
      authClient.signIn.social({
        provider: "google",
        callbackURL: callbackURL ?? window.location.href,
      })
    }
  >
    {children}
  </Button>
);
