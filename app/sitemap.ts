import type { MetadataRoute } from "next";
import { companyDirections } from "@/lib/company-content";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://weiyudang.com/", changeFrequency: "monthly", priority: 1 },
    ...companyDirections.map(item => ({ url: "https://weiyudang.com/technology/" + item.id, changeFrequency: "monthly" as const, priority: .8 }))
  ];
}
