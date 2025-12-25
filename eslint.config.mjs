import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript", "plugin:vue/recommended"),
  {
    files: ["**/*.vue", "**/frontend/src/**/*.js"],
    rules: {
      "react-hooks/rules-of-hooks": "off",
      "vue/multi-word-component-names": "off",
      "vue/html-self-closing": "off",
      "vue/max-attributes-per-line": "off",
      "vue/html-closing-bracket-spacing": "off",
      "vue/singleline-html-element-content-newline": "off",
      "vue/no-reserved-component-names": "off",
      "vue/component-definition-name-casing": "off",
      "import/no-anonymous-default-export": "off",
      "vue/valid-v-for": "off",
      "vue/html-indent": "off",
      "vue/attributes-order": "off",
      "vue/order-in-components": "off",
      "vue/html-closing-bracket-newline": "off",
      "vue/v-bind-style": "off",
      "vue/v-on-style": "off",
      "vue/mustache-interpolation-spacing": "off"
    },
    languageOptions: {
      parser: await import("vue-eslint-parser"),
      parserOptions: {
        parser: "@typescript-eslint/parser",
        sourceType: "module"
      }
    }
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    rules: {
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/no-unused-vars": ["warn", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }],
    },
  },
];

export default eslintConfig;
