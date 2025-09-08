import type { ReactNode } from "react";

export interface NavbarNavItem {
  href?: string;
  label: string;
  icon: React.ComponentType<{
    size?: number;
    className?: string;
    "aria-hidden"?: boolean;
  }>;
  active?: boolean;
}

export interface NavbarProps {
  logo?: ReactNode;
  logoHref?: string;
  navigationLinks?: NavbarNavItem[];
  onNavItemClick?: (href?: string) => void;
  className?: string;
}
