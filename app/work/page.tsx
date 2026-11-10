import type { Metadata } from "next";
import { CompanyHeader } from "@/components/CompanyHeader";
import { CompanyContact, CompanyFooter } from "@/components/CompanyFooter";
import { CompanyWork } from "@/components/CompanyWork";
import { QuantumHero } from "@/components/QuantumHero";

export const metadata: Metadata = {
  title: "演示案例", description: "体验定制群聊智能体、财务核对、HTML剪辑模拟器与供应链规划，从输入到可复核、可导出结果的完整流程。",
  alternates: { canonical: "/work" },
  openGraph: { title: "演示案例｜莫比乌斯", url: "/work", description: "从一个任务，看到系统如何工作。" }
};
export default function WorkIndex() {
  return <><a className="skip-link" href="#main">跳到正文</a><CompanyHeader context="work" /><main id="main"><QuantumHero work /><CompanyWork heading={false} /></main><CompanyContact /><CompanyFooter /></>;
}
