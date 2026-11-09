import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: ["/mobius", "/mobius-lab"] }, sitemap: "https://weiyudang.com/sitemap.xml" };
}
