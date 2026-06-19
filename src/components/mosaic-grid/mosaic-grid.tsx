import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MosaicGridProps {
  className?: string;
  children: ReactNode;
}

export const MosaicGrid = ({ className, children }: MosaicGridProps) => (
  <div
    className={cn(
      "bg-border grid gap-px overflow-hidden rounded-lg border",
      className,
    )}
  >
    {children}
  </div>
);
