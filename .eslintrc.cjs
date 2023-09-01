/**
 * @type {import("eslint").ESLint.ConfigData}
 */
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "prettier",
  ],
  rules: {
    "import/order": ["error"],
  },
  plugins: ["@typescript-eslint"],
  parser: "@typescript-eslint/parser",
  env: {
    es2023: true,
  },
  parserOptions: {
    ecmaVersion: 2023,
    sourceType: "module",
    project: true,
    tsconfigRootDir: __dirname,
  },
  root: true,
};
