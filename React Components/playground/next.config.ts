import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  output: "export",
  basePath: "/demos",
  trailingSlash: true,
  turbopack: {
    // Workspace root, so imports from ../registry resolve.
    root: path.join(__dirname, ".."),
  },
};

export default nextConfig;
