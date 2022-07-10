/** @type {import('next').NextConfig} */

const withTM = require('next-transpile-modules')(['react-daisyui'])

module.exports = withTM({
  reactStrictMode: true,
  images: {
    domains: ['ddragon.leagueoflegends.com'],
  }
})

