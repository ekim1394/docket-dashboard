import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/spicy-regs-dashboard",
  images: { unoptimized: true },
  reactCompiler: true,
};

export default nextConfig;
