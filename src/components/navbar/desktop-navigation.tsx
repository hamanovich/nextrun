import Link from "next/link";
import { cn } from "@/lib/utils";
import type { NavbarNavItem } from "./types";

interface DesktopNavigationProps {
  navigationLinks: NavbarNavItem[];
}

export const DesktopNavigation = ({
  navigationLinks,
}: DesktopNavigationProps) => (
  <ul className="flex items-center gap-1">
    {navigationLinks.map((link) => (
      <li key={link.href ?? link.label}>
        <Link
          href={link.href || "#"}
          className={cn(
            "text-muted-foreground hover:text-foreground hover:bg-accent rounded-md px-3 py-2 text-sm font-medium transition-colors",
            link.active && "text-foreground",
          )}
          aria-current={link.active ? "page" : undefined}
        >
          {link.label}
        </Link>
      </li>
    ))}
  </ul>
);
