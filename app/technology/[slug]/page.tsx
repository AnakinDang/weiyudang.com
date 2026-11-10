import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { CompanyHeader } from "@/components/CompanyHeader";
import { CompanyContact, CompanyFooter } from "@/components/CompanyFooter";
import { DirectionArtwork } from "@/components/DirectionArtwork";
import { companyDirections, findDirection } from "@/lib/company-content";

export const dynamicParams = false;
export function generateStaticParams() { return companyDirections.map(item => ({ slug: item.id })); }
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = findDirection((await params).slug);
  if (!item) return {};
  return {
    title: item.label,
    description: item.lead,
    alternates: { canonical: "/technology/" + item.id },
    openGraph: { title: item.label + "｜莫比乌斯", description: item.lead, url: "/technology/" + item.id }
  };
}

export default async function TechnologyDirection({ params }: Props) {
  const item = findDirection((await params).slug);
  if (!item) notFound();
  return (
    <>
      <a className="skip-link" href="#main">跳到正文</a>
      <div className="technology-page">
        <CompanyHeader light />
        <main id="main" className="technology-main wrap">
          <nav className="technology-breadcrumb" aria-label="当前位置"><a href="/#technology">业务与技术</a><span aria-hidden="true">/</span><span aria-current="page">{item.label}</span></nav>
          <div className="direction-title-row"><h1>{item.headline[0]}<br />{item.headline[1]}</h1><p>{item.label}</p></div>
          <p className="direction-lead">{item.lead}</p>
          <section className="direction-story" aria-labelledby="direction-problem">
            <div><h2 id="direction-problem">{item.problemTitle}</h2><p>{item.problem}</p><p>{item.approach}</p></div>
            <DirectionArtwork direction={item} />
          </section>
          <section className="direction-pillars" aria-label="能力组成">
            {item.pillars.map(pillar => <div key={pillar.title}><h2>{pillar.title}</h2><p>{pillar.body}</p></div>)}
          </section>
          <section className="direction-delivery" aria-labelledby="direction-delivery-title">
            <div><h2 id="direction-delivery-title">共同定义交付。</h2><p>把愿景转为清晰的建设范围、验收依据与运行责任。</p></div>
            <div><ul>{item.deliverables.map(label => <li key={label}>{label}</li>)}</ul><p className="direction-scope">以下为业务与技术建设方向。具体能力、系统接入及交付范围，在项目评估后共同确定。</p></div>
          </section>
          <div className="direction-actions">
            <a className="accent-link" href="/#technology"><ArrowLeft size={19} strokeWidth={1.2} aria-hidden="true" />探索其他技术方向</a>
            <a className="accent-link" href="/#contact">{"探讨" + item.label + "的建设方式"}<ArrowUpRight size={21} strokeWidth={1.2} aria-hidden="true" /></a>
          </div>
          <nav className="direction-nav" aria-label="全部技术方向">{companyDirections.map(direction => <a key={direction.id} href={"/technology/" + direction.id} aria-current={direction.id===item.id ? "page" : undefined}>{direction.label}</a>)}</nav>
        </main>
      </div>
      <CompanyContact />
      <CompanyFooter />
    </>
  );
}
