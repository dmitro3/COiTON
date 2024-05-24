/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.punchng.com",
      },
      {
        protocol: "https",
        hostname: "bronze-gigantic-quokka-778.mypinata.cloud",
      },
      {
        protocol: "https",
        hostname: "ipfs.io",
      },
    ],
  },
};

export default nextConfig;
