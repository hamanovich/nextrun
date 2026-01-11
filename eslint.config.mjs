import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";
import { defineConfig, globalIgnores } from "eslint/config";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  {
    rules: {
      "react-hooks/exhaustive-deps": "off",
      "react-hooks/set-state-in-effect": "off",
      "@next/next/no-img-element": "off",
      "react/no-unescaped-entities": "off",
      "prefer-arrow-callback": [
        "error",
        { allowNamedFunctions: false, allowUnboundThis: true },
      ],
      "func-style": ["error", "expression", { allowArrowFunctions: true }],
      "arrow-body-style": ["error", "as-needed"],
      "@typescript-eslint/array-type": ["error", { default: "array" }],
    },
  },
  globalIgnores([
    "node_modules/**",
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "coverage/**",
    "src/components/ui/**",
  ]),
]);

export default eslintConfig;
