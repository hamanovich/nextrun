"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import type { NavbarNavItem } from "./types";

type DesktopNavigationProps = {
  navigationLinks: Omit<NavbarNavItem, "icon">[];
};

const linkClass =
  "hover:bg-accent hover:text-foreground rounded-[18px] px-3 py-2 text-sm font-normal whitespace-nowrap";

export const DesktopNavigation = ({
  navigationLinks,
}: DesktopNavigationProps) => {
  const pathname = usePathname();
  return (
    <NavigationMenu aria-label="Main" className="brand-product-navigation">
      <NavigationMenuList>
        {navigationLinks.map((link) => {
          const active = link.active || pathname === link.href;
          return (
            <NavigationMenuItem key={link.href ?? link.label}>
              <NavigationMenuLink asChild>
                <Link
                  href={link.href || "#"}
                  className={cn(
                    linkClass,
                    active
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
