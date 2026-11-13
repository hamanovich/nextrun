import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface NavbarShellProps {
  children: ReactNode;
  className?: string;
}
export const NavbarShell = ({ children, className }: NavbarShellProps) => (
  <header
    className={cn(
      "product-compact bg-background sticky top-0 z-50 w-full border-b",
      className,
    )}
  >
    {children}
  </header>
);
