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
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "donext.s3.ap-south-1.amazonaws.com",
        port: "",
        pathname: "/**"
      }
    ]
  },

  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
