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
  // Mobius company sandbox: a prebuilt single-file app in public/mobius, built from AnakinDang/the-bridge.
  async rewrites() {
    return [{ source: "/mobius", destination: "/mobius/index.html" }];
  },
  poweredByHeader: false,
  reactStrictMode: true
};

export default nextConfig;
