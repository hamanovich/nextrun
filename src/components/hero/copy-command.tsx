import { DocsCode } from "@/components/docs/docs-code";

type CopyCommandProps = { commands: string[]; label?: string };
export const CopyCommand = ({
  commands,
  label = "terminal",
}: CopyCommandProps) => (
  <DocsCode
    code={commands.join("\n")}
    label={label}
    copyLabel="Copy commands to clipboard"
  />
);
