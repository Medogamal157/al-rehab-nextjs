import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Set turbopack root to this project's directory to avoid lockfile conflicts
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "*/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "*/**",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "*/**",
      },
    ],
  },
};

export default nextConfig;
