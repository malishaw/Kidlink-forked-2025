import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@repo/ui",
    "@nextplate/api",
    "@nextplate/rpc",
    "@repo/eslint-config",
    "@repo/typescript-config",
    "@repo/database"
  ],
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8000/api/:path*"
      }
    ];
  }
};

export default nextConfig;
