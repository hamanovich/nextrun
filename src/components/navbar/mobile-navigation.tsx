import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HamburgerIcon } from "./hamburger-icon";
import type { NavbarNavItem } from "./types";

interface MobileNavigationProps {
  navigationLinks: NavbarNavItem[];
}

export const MobileNavigation = ({
  navigationLinks,
}: MobileNavigationProps) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button
        className="group hover:bg-accent hover:text-accent-foreground h-8 w-8"
        variant="ghost"
        size="icon"
        aria-label="Open main menu"
      >
        <HamburgerIcon />
      </Button>
    </PopoverTrigger>
    <PopoverContent align="start" className="w-64 p-1">
      <NavigationMenu className="max-w-none">
        <NavigationMenuList className="flex-col items-start gap-0">
          {navigationLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <NavigationMenuItem
                key={link.href ?? `${index}-${link.label}`}
                className="w-full"
              >
                <Link
                  href={link.href || "#"}
                  className={cn(
                    "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    link.active && "bg-accent text-accent-foreground",
                  )}
                  aria-current={link.active ? "page" : undefined}
                >
                  <Icon
                    size={16}
                    className="text-muted-foreground"
                    aria-hidden={true}
                  />
                  <span>{link.label}</span>
                </Link>
              </NavigationMenuItem>
            );
          })}
        </NavigationMenuList>
      </NavigationMenu>
    </PopoverContent>
  </Popover>
);
