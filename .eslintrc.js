/** @type {import("eslint").Linter.Config} */
const eslintConfig = {
  extends: [require.resolve('@dao-dao/config/eslint')],
  ignorePatterns: ['.next', '.turbo', 'node_modules', 'out', 'next-env.d.ts'],
  root: true,
  rules: {
    'i18next/no-literal-string': 'off',
    'regex/invalid': 'off',
  },
}

module.exports = eslintConfig
