import type { Metadata } from "next";
import "./company.css";
import "./work.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://weiyudang.com"),
  title: { default: "莫比乌斯｜让 AI，重塑世界的运行方式", template: "%s｜莫比乌斯" },
  description: "以 AI Native 的方式重构组织。连接企业知识、Agent 与 Workflow，覆盖 Context Engineering、业务 Ontology、Voice AI 与 Evals，推动 AI 在真实业务中协作、行动与持续进化。",
  alternates: { canonical: "/" },
  openGraph: {
    title: "莫比乌斯｜让 AI，重塑世界的运行方式", description: "以 AI Native 的方式重构组织。连接企业知识、Agent 与 Workflow，让 AI 理解业务、协同执行，并在真实世界的反馈中持续进化。",
    url: "/", siteName: "莫比乌斯", locale: "zh_CN", type: "website"
  },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><head><link rel="preload" href="/company/fonts/mobius-serif-sc-500-v4.woff2" as="font" type="font/woff2" crossOrigin="anonymous" /></head><body>{children}</body></html>;
}
