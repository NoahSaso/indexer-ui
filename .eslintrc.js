/** @type {import("eslint").Linter.Config} */
const eslintConfig = {
  ignorePatterns: ['.next', '.turbo', 'node_modules', 'out', 'next-env.d.ts'],
  extends: ['next/core-web-vitals', 'plugin:prettier/recommended'],
  plugins: ['@typescript-eslint', 'tailwindcss', 'import', 'unused-imports'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
  },
  rules: {
    'no-unused-vars': ['off'],
    'react/jsx-sort-props': ['warn', { reservedFirst: ['key'] }],
    'tailwindcss/classnames-order': ['warn'],
    '@typescript-eslint/no-unused-vars': ['off'],
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        pathGroups: [
          {
            pattern: '@/**',
            group: 'internal',
            position: 'after',
          },
        ],
      },
    ],
    'import/no-duplicates': 'error',
    'sort-imports': [
      'error',
      {
        // Let eslint-plugin-import handle declaration groups above.
        ignoreDeclarationSort: true,
        // Sort within import statements.
        ignoreMemberSort: false,
      },
    ],
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
  },
}

module.exports = eslintConfig
