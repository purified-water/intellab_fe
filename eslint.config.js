import eslintPluginPrettier from 'eslint-plugin-prettier';
import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    settings: {
      react: { version: '18.3' }
    }
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: {
      prettier: eslintPluginPrettier
    },
  },
  {
    ignores: ['vite.config.ts', 'tailwind.config.js', 'postcss.config.js', 'eslint.config.js'],
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react/no-unescaped-entities': 'off',
      'react/jsx-filename-extension': [1, { "extensions": [".js", ".jsx", ".ts", ".tsx"] }], //should add ".
      'prettier/prettier': [
        'warn',
        {
          arrowParens: 'always',
          semi: true,
          trailingComma: 'none',
          tabWidth: 2,
          endOfLine: 'auto',
          useTabs: false,
          singleQuote: false,
          printWidth: 120,
          jsxSingleQuote: false,
        }
      ],
    }
  }
];