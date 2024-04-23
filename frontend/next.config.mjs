/** @type {import('next').NextConfig} */
const nextConfig = {
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
    ],
  },
};

export default nextConfig;
