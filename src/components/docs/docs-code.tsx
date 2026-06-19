"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

type DocsCodeProps = {
  code: string;
  label?: string;
};

export const DocsCode = ({ code, label = "code" }: DocsCodeProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-muted/40 overflow-hidden rounded-lg border">
      <div className="flex items-center justify-between border-b px-4 py-2.5">
        <span className="text-muted-foreground font-mono text-xs">{label}</span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy to clipboard"
          className="text-muted-foreground hover:text-foreground inline-flex cursor-pointer items-center gap-1.5 text-xs transition-colors"
        >
          {copied ? (
            <Check className="size-3.5" />
          ) : (
            <Copy className="size-3.5" />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-4">
        <code className="font-mono text-sm leading-relaxed whitespace-pre">
          {code}
        </code>
      </pre>
    </div>
  );
};
