"use client";

import { forwardRef } from "react";
import Link from "next/link";
import { KeyRound } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useCredits } from "@/hooks/use-credits";
import { SignInButton } from "@/components/auth/sign-in-button";
import { defaultNavigationLinks } from "./constants";
import { DesktopNavigation } from "./desktop-navigation";
import { Logo } from "./logo";
import { MobileNavigation } from "./mobile-navigation";
import { ThemeToggle } from "./theme-toggle";
import type { NavbarProps } from "./types";
import { UserMenu } from "./user-menu";

export const Navbar = forwardRef<HTMLElement, NavbarProps>(
  (
    {
      className,
      logo = <Logo />,
      logoHref = "/",
      navigationLinks = defaultNavigationLinks,
      ...props
    },
    ref,
  ) => {
    const { data: session, isPending } = authClient.useSession();
    const { data: credits = 0 } = useCredits();

    return (
      <header
        ref={ref}
        className={cn(
          "bg-background/80 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b px-4 backdrop-blur md:px-6",
          className,
        )}
        {...props}
      >
        <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4">
          <div className="flex items-center gap-2 md:gap-6">
            <span className="md:hidden">
              <MobileNavigation navigationLinks={navigationLinks} />
            </span>
            <Link
              href={logoHref}
              className="text-foreground flex items-center gap-2"
            >
              {logo}
              <span className="hidden text-lg font-semibold sm:inline-block">
                NextRun
              </span>
            </Link>
            <nav aria-label="Main" className="hidden md:block">
              <DesktopNavigation navigationLinks={navigationLinks} />
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {isPending ? (
              <div className="bg-muted size-8 animate-pulse rounded-full" />
            ) : session ? (
              <UserMenu session={session} credits={credits} />
            ) : (
              <SignInButton>
                <KeyRound />
                Sign in
              </SignInButton>
            )}
          </div>
        </div>
      </header>
    );
  },
);

Navbar.displayName = "Navbar";
