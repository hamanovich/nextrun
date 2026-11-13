import type { ComponentProps } from "react";

export const FadeIn = ({ children, ...props }: ComponentProps<"div">) => (
  <div {...props}>{children}</div>
);
