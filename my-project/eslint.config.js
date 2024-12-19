import globals from "globals";
//import tseslint from "typescript-eslint";
import { configs as tsConfigs } from "typescript-eslint/eslint-plugin";
import pluginReact from "eslint-plugin-react";
import tailwindcss from "eslint-plugin-tailwindcss"


export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest", // Обеспечивает поддержку последних возможностей ECMAScript
        sourceType: "module", // Используем ES-модули
        ecmaFeatures: {
          jsx: true, // Включаем поддержку JSX
        },
      },
    },
    plugins: {
      "@typescript-eslint": tsConfigs, // Используем TypeScript ESLint плагин
      "react": pluginReact, // Добавляем плагин для React
      "tailwindcss": tailwindcss,
    },
    extends: [
      "eslint:recommended", // Включаем стандартные рекомендации ESLint
      "plugin:react/recommended", // Включаем рекомендации для React
      "plugin:@typescript-eslint/recommended", // Включаем рекомендации для TypeScript
      "plugin:tailwindcss/recommended", // Включаем рекомендуемые правила TailwindCSS
    ],
    rules: {
      "react/react-in-jsx-scope": "off", // Отключаем это правило для проектов с новым JSX
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }], // Предупреждение для неиспользуемых переменных, игнорируя переменные, начинающиеся с "_"
    },
    settings: {
      react: {
        version: "detect", // Автоматически определять версию React
      },
    },
    // ...tseslint.configs.recommended,
    // pluginReact.configs.flat.recommended,
  }
];
