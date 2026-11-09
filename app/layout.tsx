import type { Metadata } from "next";
import "./company.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://weiyudang.com"),
  title: { default: "莫比乌斯｜企业 AI 应用与交付", template: "%s｜莫比乌斯" },
  description: "立足陕西，从业务发现、企业知识与智能体构建，到系统部署、运行评测与持续改进。公司暂称未命名，项目名莫比乌斯。",
  alternates: { canonical: "/" },
  openGraph: {
    title: "莫比乌斯｜让 AI 成为企业的运行方式", description: "连接企业知识、业务系统与 AI 能力，从关键流程开始持续改进。",
    url: "/", siteName: "莫比乌斯", locale: "zh_CN", type: "website"
  },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
