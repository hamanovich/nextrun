import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { NavbarNavItem } from "./types";

interface DesktopNavigationProps {
  navigationLinks: NavbarNavItem[];
}

export const DesktopNavigation = ({
  navigationLinks,
}: DesktopNavigationProps) => (
  <NavigationMenu className="flex">
    <NavigationMenuList className="gap-2">
      <TooltipProvider>
        {navigationLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavigationMenuItem key={link.href ?? link.label}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <NavigationMenuLink asChild>
                    <Link
                      href={link.href || "#"}
                      className={cn(
                        "flex size-8 items-center justify-center p-1.5 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
                        link.active && "bg-accent text-accent-foreground",
                      )}
                      aria-current={link.active ? "page" : undefined}
                    >
                      <Icon size={20} aria-hidden={true} />
                      <span className="sr-only">{link.label}</span>
                    </Link>
                  </NavigationMenuLink>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="px-2 py-1 text-xs">
                  <p>{link.label}</p>
                </TooltipContent>
              </Tooltip>
            </NavigationMenuItem>
          );
        })}
      </TooltipProvider>
    </NavigationMenuList>
  </NavigationMenu>
);
