import type { MetadataRoute } from "next";
import { companyDirections } from "@/lib/company-content";
import { workProjects } from "@/lib/company-work";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://weiyudang.com/", changeFrequency: "monthly", priority: 1 },
    { url: "https://weiyudang.com/work", changeFrequency: "monthly", priority: .9 },
    ...workProjects.map(item => ({ url: "https://weiyudang.com/work/" + item.id, changeFrequency: "monthly" as const, priority: .8 })),
    ...companyDirections.map(item => ({ url: "https://weiyudang.com/technology/" + item.id, changeFrequency: "monthly" as const, priority: .8 }))
  ];
}
