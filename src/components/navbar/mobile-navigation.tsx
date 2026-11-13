"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/brand/button";
import { MobileAccount } from "./mobile-account";
import type { NavbarNavItem } from "./types";

type MobileNavigationProps = {
  navigationLinks: (Omit<NavbarNavItem, "icon"> & { icon: ReactNode })[];
  logo: ReactNode;
  logoHref: string;
};

export const MobileNavigation = ({
  navigationLinks,
  logo,
  logoHref,
}: MobileNavigationProps) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  return (
    <Drawer
      autoFocus
      open={open}
      onOpenChange={setOpen}
      direction="left"
      shouldScaleBackground={false}
      preventScrollRestoration
    >
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open main menu">
          <Menu aria-hidden />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="product-compact brand-mobile-navigation">
        <div className="brand-mobile-header">
          <DrawerTitle className="sr-only">Main menu</DrawerTitle>
          <Link
            href={logoHref}
            aria-label="NextRun home"
            onClick={() => setOpen(false)}
            className="brand-logo-link flex items-center gap-2"
          >
            {logo}
            <span className="text-base font-semibold">NextRun</span>
          </Link>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon" aria-label="Close main menu">
              <X />
            </Button>
          </DrawerClose>
        </div>
        <DrawerDescription className="sr-only">
          Main navigation and account
        </DrawerDescription>
        <nav aria-label="Main" className="brand-mobile-links">
          <ul className="flex flex-col gap-1">
            {navigationLinks.map((link) => {
              const active =
                link.active ||
                pathname === link.href ||
                (link.href &&
                  link.href !== "/" &&
                  pathname.startsWith(`${link.href}/`));
              return (
                <li key={link.href ?? link.label}>
                  <Link
                    href={link.href || "#"}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "brand-mobile-link",
                      active && "brand-mobile-link-active",
                    )}
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="brand-mobile-account">
          <MobileAccount onNavigate={() => setOpen(false)} />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
