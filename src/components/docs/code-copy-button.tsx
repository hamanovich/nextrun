"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/brand/button";

export const CodeCopyButton = ({
  code,
  label = "Copy to clipboard",
}: {
  code: string;
  label?: string;
}) => {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  };
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-2">
      <span role="status" className="text-muted-foreground text-xs">
        {status === "failed"
          ? "Could not copy. Select the code instead."
          : status === "copied"
            ? "Copied"
            : ""}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={copy}
        aria-label={label}
      >
        {status === "copied" ? (
          <Check aria-hidden="true" />
        ) : (
          <Copy aria-hidden="true" />
        )}
        Copy
      </Button>
    </div>
  );
};
