/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["oaidalleapiprodscus.blob.core.windows.net", "api.qrserver.com"],
  },
};

module.exports = nextConfig;
