/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */
const config = {
  "*.+(js|jsx|ts|tsx)": "eslint --max-warnings 0 --no-warn-ignored",
  "*.+(js|jsx|ts|tsx|json|css|md|mdx)": "prettier --write --ignore-unknown",
};

export default config;
