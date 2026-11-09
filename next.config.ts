import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  images: { qualities: [75, 95] },
  async headers() {
    return [
      { source: "/mobius/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/mobius-lab/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }
    ];
  },
  async rewrites() {
    return [
      { source: "/mobius", destination: "/mobius/index.html" },
      { source: "/mobius-lab", destination: "/mobius-lab/index.html" }
    ];
  },
  poweredByHeader: false,
  reactStrictMode: true
};
export default nextConfig;
