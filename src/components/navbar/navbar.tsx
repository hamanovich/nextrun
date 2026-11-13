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
    <div className="site-container flex h-16 items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-2 md:gap-6">
        <span className="md:hidden">
          <MobileNavigation
            logo={logo}
            logoHref={logoHref}
            navigationLinks={navigationLinks.map(({ icon: Icon, ...link }) => ({
              ...link,
              icon: (
                <Icon
                  size={16}
                  className="text-muted-foreground"
                  aria-hidden={true}
                />
              ),
            }))}
          />
        </span>
        <Link
          href={logoHref}
          className="brand-logo-link text-foreground flex shrink-0 items-center gap-2"
        >
          {logo}
          <span className="text-base font-semibold sm:text-lg">NextRun</span>
        </Link>
        <div className="hidden md:block">
          <DesktopNavigation
            navigationLinks={navigationLinks.map(({ href, label, active }) => ({
              href,
              label,
              active,
            }))}
          />
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <ThemeToggle />
        <div className="brand-auth-slot">
          <NavbarAuth />
        </div>
      </div>
    </div>
  </NavbarShell>
);
