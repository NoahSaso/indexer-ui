const withTM = require('next-transpile-modules')([
  '@dao-dao/i18n',
  '@dao-dao/state',
  '@dao-dao/stateless',
  '@dao-dao/stateful',
  '@dao-dao/types',
  '@dao-dao/utils',
])

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = withTM(nextConfig)
