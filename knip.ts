import type { KnipConfig } from "knip";

const config: KnipConfig = {
  entry: ["src/components/ui/**", "src/db/index.bot.ts", "src/lib/credits.ts"],
  ignoreBinaries: ["stripe"],
  ignoreDependencies: ["@hookform/resolvers", "@testing-library/user-event"],
};

export default config;
