import { createHighlighterCoreSync } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import shell from "shiki/langs/shellscript.mjs";
import dark from "shiki/themes/github-dark-high-contrast.mjs";
import light from "shiki/themes/github-light-high-contrast.mjs";
import { CodeCopyButton } from "./code-copy-button";

const highlighter = createHighlighterCoreSync({
  themes: [light, dark],
  langs: [shell],
  engine: createJavaScriptRegexEngine(),
});

type DocsCodeProps = { code: string; label?: string; copyLabel?: string };
export const DocsCode = ({
  code,
  label = "Text",
  copyLabel,
}: DocsCodeProps) => {
  const lang = ["shell", "terminal", "bash"].includes(label.toLowerCase())
    ? "shellscript"
    : "text";
  const html = highlighter.codeToHtml(code, {
    lang,
    tabindex: 0,
    themes: {
      light: "github-light-high-contrast",
      dark: "github-dark-high-contrast",
    },
  });
  return (
    <div className="brand-code">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-2">
        <span className="text-muted-foreground text-xs">{label}</span>
        <CodeCopyButton code={code} label={copyLabel} />
      </div>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};
