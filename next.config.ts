import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Set turbopack root to this project's directory to avoid lockfile conflicts
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    // Enable lazy loading by default for all images
    // Images with priority prop will still load eagerly
    loader: 'default',
    formats: ['image/webp', 'image/avif'],
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
