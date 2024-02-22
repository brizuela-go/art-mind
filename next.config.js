/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
});

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "oaidalleapiprodscus.blob.core.windows.net",
      "api.qrserver.com",
      "firebasestorage.googleapis.com",
    ],
  },
};

module.exports = withPWA(nextConfig);
