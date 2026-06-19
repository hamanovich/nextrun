"use client";

import { useState, type ReactNode } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { cn } from "@/lib/utils";

interface NavbarShellProps {
  children: ReactNode;
  className?: string;
}

export const NavbarShell = ({ children, className }: NavbarShellProps) => {
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setHidden(latest > previous && latest > 120);
  });

  return (
    <motion.header
      variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
      animate={shouldReduceMotion || !hidden ? "visible" : "hidden"}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "bg-background/80 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 w-full border-b px-4 backdrop-blur md:px-6",
        className,
      )}
    >
      {children}
    </motion.header>
  );
};
