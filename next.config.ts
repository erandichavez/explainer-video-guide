import type { NextConfig } from "next";

// GitHub Pages serves the site from /<repo-name>/, so production builds set
// NEXT_PUBLIC_BASE_PATH (see .github/workflows/deploy.yml). Locally it's "".
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  // Static hosting has no image optimisation server.
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
