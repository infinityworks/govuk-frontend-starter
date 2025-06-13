import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

const baseConfig = defineConfig([
  {
    files: ["**/*.js"],
    plugins: {
      js,
    },
    extends: ["js/recommended"],
  },
]);

export default defineConfig([
  {
    name: "client",
    files: ["app/client/**/*.js", "app/client/**/*.mjs"],
    extends: [baseConfig],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    name: "server",
    files: ["app/server/**/*.js", "app/server/**/*.cjs"],
    extends: [baseConfig],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    name: "tests",
    files: ["tests/**/*.ts"],
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    extends: [baseConfig, tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-floating-promises": "error",
    },
  },
]);
