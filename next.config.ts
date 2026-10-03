import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tell Next.js this folder is the project root (a stray package-lock.json
  // in the home folder would otherwise confuse it).
  turbopack: { root: __dirname },
};

export default nextConfig;
