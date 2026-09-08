import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained server bundle for the Fly.io Docker image.
  output: "standalone",
  // games.vaidehiagarwalla.com is a games hub; this app is the featured game.
  async redirects() {
    return [
      { source: "/", destination: "/orient-express", permanent: false },
    ];
  },
};

export default nextConfig;
