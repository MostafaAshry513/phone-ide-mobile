// ESLint v9 flat config
import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
      globals: {
        console: "readonly",
        process: "readonly",
        __dirname: "readonly",
        require: "readonly",
        module: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
    },
    ignores: ["node_modules/**", "android/**", "ios/**", "dist/**", ".expo/**"],
  },
];
