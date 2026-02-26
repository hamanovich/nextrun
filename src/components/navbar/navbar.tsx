"use client";

import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useCredits } from "@/hooks/use-credits";
import { useWindowScroll } from "@/hooks/use-scroll";
import { LoginBtn } from "@/components/login/login-btn";
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
    const [isMobile, setIsMobile] = useState(false);
    const containerRef = useRef<HTMLElement>(null);
    const [{ y }] = useWindowScroll();
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isHidden, setIsHidden] = useState(false);

    useEffect(() => {
      setIsHidden(y > lastScrollY && y > 65);
      setLastScrollY(y);
    }, [y]);

    useEffect(() => {
      const checkWidth = () => {
        if (containerRef.current) {
          const width = containerRef.current.offsetWidth;
          setIsMobile(width < 640);
        }
      };

      checkWidth();

      const resizeObserver = new ResizeObserver(checkWidth);
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }

      return () => {
        resizeObserver.disconnect();
      };
    }, []);

    const combinedRef = useCallback(
      (node: HTMLElement | null) => {
        containerRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    return (
      <header
        ref={combinedRef}
        className={cn(
          "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6 [&_*]:no-underline transition-transform duration-300",
          isHidden ? "-translate-y-full" : "translate-y-0",
          className,
        )}
        {...props}
      >
        <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4">
          {/* Left side */}
          <div className="flex flex-1 items-center gap-2">
            {/* Mobile menu trigger */}
            {isMobile && <MobileNavigation navigationLinks={navigationLinks} />}
            <nav aria-label="Main" className="flex items-center gap-6">
              <Link
                href={logoHref}
                className="flex items-center space-x-2 text-primary hover:text-primary/90 transition-colors"
              >
                <div className="text-2xl">{logo}</div>
                <span className="hidden font-bold text-xl sm:inline-block">
                  NextRun
                </span>
              </Link>
              {!isMobile && (
                <DesktopNavigation navigationLinks={navigationLinks} />
              )}
            </nav>
          </div>
          {/* Right side */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {isPending ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
            ) : session ? (
              <UserMenu session={session} credits={credits} />
            ) : (
              <LoginBtn />
            )}
          </div>
        </div>
      </header>
    );
  },
);

Navbar.displayName = "Navbar";
