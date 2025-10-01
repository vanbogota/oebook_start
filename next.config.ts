import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.finna.fi",
      },
    ],
  },
};

export default nextConfig;
