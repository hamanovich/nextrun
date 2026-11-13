import type { ComponentProps } from "react";
import { Button as ShadcnButton } from "@/components/ui/button";

type ButtonProps = ComponentProps<typeof ShadcnButton>;

export const Button = ({
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) => (
  <ShadcnButton
    data-brand-control="button"
    data-brand-variant={variant}
    data-brand-size={size}
    variant={variant}
    size={size}
    {...props}
  />
);

export { buttonVariants } from "@/components/ui/button";
