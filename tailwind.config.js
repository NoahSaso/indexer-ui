/** @type {import("tailwindcss/tailwind-config").TailwindConfig} */
const tailwindConfig = {
  content: [
    './{components,pages}/**/*.{js,jsx,ts,tsx}',
    './node_modules/@dao-dao/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('@dao-dao/config/tailwind/config')],
}

module.exports = tailwindConfig
