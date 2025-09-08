import { CreditCardIcon, HomeIcon, InfoIcon } from "lucide-react";
import type { NavbarNavItem } from "./types";

export const defaultNavigationLinks: NavbarNavItem[] = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/about", label: "About", icon: InfoIcon },
  { href: "/pricing", label: "Pricing", icon: CreditCardIcon },
];
