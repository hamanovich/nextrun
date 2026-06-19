import type { KnipConfig } from "knip";

const config: KnipConfig = {
  entry: ["src/components/ui/**", "src/db/index.bot.ts"],
  ignoreBinaries: ["stripe"],
};

export default config;
