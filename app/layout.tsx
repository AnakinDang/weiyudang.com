import type { Metadata } from "next";
import "./company.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://weiyudang.com"),
  title: { default: "莫比乌斯｜让智能，重塑世界的运行方式", template: "%s｜莫比乌斯" },
  description: "连接知识、人的判断与业务行动，构建能够在真实世界中运行、协作和持续进化的 AI 系统。探索莫比乌斯的企业 AI 平台、智能体、企业知识、业务语义与持续改进。",
  alternates: { canonical: "/" },
  openGraph: {
    title: "莫比乌斯｜让智能，重塑世界的运行方式", description: "知识不断流动，行动彼此连接，进化从未停止。连接知识、人的判断与业务行动，推动智能与组织共同进化。",
    url: "/", siteName: "莫比乌斯", locale: "zh_CN", type: "website"
  },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><head><link rel="preload" href="/company/fonts/mobius-serif-sc-500.woff2" as="font" type="font/woff2" crossOrigin="anonymous" /></head><body>{children}</body></html>;
}
