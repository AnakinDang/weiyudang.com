import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 95]
  },
  async headers() {
    return [
      {
        source: "/app/agents",
        headers: [{ key: "Referrer-Policy", value: "same-origin" }]
      },
      {
        source: "/app/events",
        headers: [{ key: "Referrer-Policy", value: "same-origin" }]
      }
    ];
  },
  poweredByHeader: false,
  reactStrictMode: true
};

export default nextConfig;
