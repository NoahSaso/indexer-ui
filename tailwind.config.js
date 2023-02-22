const defaultTheme = require('tailwindcss/defaultTheme')

const colors = require('./style/colors')

/** @type {import("tailwindcss/tailwind-config").TailwindConfig} */
const tailwindConfig = {
  content: ['./{components,pages}/**/*.{js,jsx,ts,tsx}'],
  theme: {
    screens: {
      xs: '410px',
      ...defaultTheme.screens,
    },
    extend: {
      colors,
      boxShadow: {
        dp2: '0px 1px 2px rgba(0, 0, 0, 0.12), 0px 2px 4px rgba(0, 0, 0, 0.08), 0px 1px 8px rgba(6, 9, 11, 0.04)',
        dp4: '0px 2px 4px rgba(0, 0, 0, 0.16), 0px 4px 8px rgba(0, 0, 0, 0.12), 0px 1px 12px rgba(6, 9, 11, 0.08)',
        dp8: '0px 6px 12px rgba(0, 0, 0, 0.24), 0px 12px 16px rgba(6, 9, 11, 0.2), 0px 1px 20px rgba(0, 0, 0, 0.16)',
      },
    },
  },
}

module.exports = tailwindConfig
