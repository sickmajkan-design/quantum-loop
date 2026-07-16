import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // Allows testing the dev server from a phone on the same local network.
  allowedDevOrigins: ["192.168.1.5"],
};

export default nextConfig;
