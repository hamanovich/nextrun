import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@/public": path.resolve(__dirname, "./public"),
      "@": path.resolve(__dirname, "./src"),
      "@app": path.resolve(__dirname, "./package.json"),
      "server-only": path.resolve(__dirname, "./src/test/mocks/server-only.ts"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: true,
    env: {
      NODE_ENV: "test",
    },
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.{idea,git,cache,output,temp}/**",
      "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*",
    ],
  },
});
