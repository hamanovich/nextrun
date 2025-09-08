"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCredits } from "@/contexts/credits-context";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { LoginBtn } from "../login/login-btn";
import {
  defaultNavigationLinks,
  DesktopNavigation,
  Logo,
  MobileNavigation,
  ThemeToggle,
  UserMenu,
  type NavbarProps,
} from "./index";

export const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
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
    const { data: session, status } = useSession();
    const { credits } = useCredits();
    const [isMobile, setIsMobile] = useState(false);
    const containerRef = useRef<HTMLElement>(null);

    useEffect(() => {
      const checkWidth = () => {
        if (containerRef.current) {
          const width = containerRef.current.offsetWidth;
          setIsMobile(width < 768); // 768px is md breakpoint
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

    const combinedRef = React.useCallback(
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
          "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6 [&_*]:no-underline",
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
            {status === "loading" ? (
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
