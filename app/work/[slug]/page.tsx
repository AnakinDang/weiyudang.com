import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { CompanyHeader } from "@/components/CompanyHeader";
import { CompanyContact, CompanyFooter } from "@/components/CompanyFooter";
import { FinanceDemo } from "@/components/work/FinanceDemo";
import { SupplyDemo } from "@/components/work/SupplyDemo";
import { VideoDemo } from "@/components/work/VideoDemo";
import { AgentDemo } from "@/components/work/AgentDemo";
import { workProjects } from "@/lib/company-work";

export const dynamicParams = false;
export function generateStaticParams() { return workProjects.map(project => ({ slug: project.id })); }
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  const project = workProjects.find(item => item.id === slug);
  return project ? { title: project.title + "演示", description: project.lead, alternates: { canonical: "/work/" + project.id }, openGraph: { title: project.title + "演示｜莫比乌斯", description: project.lead, url: "/work/" + project.id } } : {};
}
export default async function WorkDetail({ params }: Props) {
  const slug = (await params).slug;
  const project = workProjects.find(item => item.id === slug);
  if (!project) notFound();
  return (
    <><a className="skip-link" href="#main">跳到正文</a><div className="technology-page work-detail"><CompanyHeader light context="work" /><main id="main" className="work-detail-main wrap">
      <nav className="technology-breadcrumb" aria-label="当前位置"><a href="/work">演示案例</a><span aria-hidden="true">/</span><span aria-current="page">{project.title}</span></nav>
      <header className="work-detail-intro"><h1>{project.headline[0]}<br />{project.headline[1]}</h1><p>{project.lead}</p><p className="work-demo-note">{project.note}</p></header>
      <div className="work-flow-labels" aria-label="演示流程"><span>{project.input}</span><span aria-hidden="true">→</span><span>{project.process}</span><span aria-hidden="true">→</span><span>{project.output}</span></div>
      {project.id === "custom-agent" ? <AgentDemo /> : project.id === "finance" ? <FinanceDemo /> : project.id === "video" ? <VideoDemo /> : <SupplyDemo />}
      <noscript><p className="demo-data-note">交互演示需要启用JavaScript。你仍可阅读示例资料、业务问题与建设范围。</p></noscript>
      <p className="work-demo-disclosure">{project.id === "video" ? "本演示为HTML剪辑模拟器，可预演镜头并导出方案与字幕，不生成视频文件。" : "本演示以示例规则处理资料，展示数据、建议与人工决策的衔接，不连接企业真实系统。"}以下为可构建方向，具体能力与交付标准在项目评估后共同确定。</p>
      <section className="work-context" aria-labelledby="work-context-title"><div><h2 id="work-context-title">从演示走向真实业务。</h2><p>{project.challenge}</p></div><div><h3>一起定义建设范围</h3><ul>{project.scope.map(item => <li key={item}>{item}</li>)}</ul><a className="accent-link" href={"mailto:dangweiyu0516@gmail.com?subject=" + encodeURIComponent("莫比乌斯 · " + project.contact + "方案交流")}>探讨这个方案<ArrowUpRight size={21} strokeWidth={1.1} aria-hidden="true" /></a></div></section>
      <nav className="work-related" aria-label="其他演示"><a className="accent-link" href="/work"><ArrowLeft size={19} strokeWidth={1.1} aria-hidden="true" />全部演示</a>{workProjects.filter(item => item.id !== project.id).map(item => <a key={item.id} className="accent-link" href={"/work/" + item.id}>{item.title}<ArrowUpRight size={19} strokeWidth={1.1} aria-hidden="true" /></a>)}</nav>
    </main></div><CompanyContact /><CompanyFooter /></>
  );
}
