import { type ReactNode } from "react";

export const InlineCode = ({ children }: { children: ReactNode }) => (
  <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-sm">
    {children}
  </code>
);
