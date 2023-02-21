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
    },
  },
}

module.exports = tailwindConfig
