import type { NextConfig } from "next";

// Empty for a root-domain deployment; set to e.g. "/quantum-loop" when the app
// is served from a subpath (GitHub Pages project site). Drives basePath +
// assetPrefix so all first-party URLs resolve under that prefix.
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
  // Allows testing the dev server from a phone on the same local network.
  // Update this if the machine's LAN IP changes (router reassigns DHCP
  // leases on reboot) — check with `ipconfig` (Windows) or `ifconfig`.
  allowedDevOrigins: ["192.168.1.11"],
};

export default nextConfig;
