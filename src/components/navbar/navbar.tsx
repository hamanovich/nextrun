import Link from "next/link";
import { defaultNavigationLinks } from "./constants";
import { DesktopNavigation } from "./desktop-navigation";
import { Logo } from "./logo";
import { MobileNavigation } from "./mobile-navigation";
import { NavbarAuth } from "./navbar-auth";
import { NavbarShell } from "./navbar-shell";
import { ThemeToggle } from "./theme-toggle";
import type { NavbarProps } from "./types";

export const Navbar = ({
  className,
  logo = <Logo />,
  logoHref = "/",
  navigationLinks = defaultNavigationLinks,
}: NavbarProps) => (
  <NavbarShell className={className}>
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
        <NavbarAuth />
      </div>
    </div>
  </NavbarShell>
);
