import { QuantumHero } from "@/components/QuantumHero";
import { CompanyHeader } from "@/components/CompanyHeader";
import { CompanyContact, CompanyFooter } from "@/components/CompanyFooter";
import { CompanyCapabilities } from "@/components/CompanyCapabilities";
import { CompanySolutions } from "@/components/CompanySolutions";
import { QuantumStory } from "@/components/QuantumStory";
import { CompanyWork } from "@/components/CompanyWork";

const stages = [
  ["Discovery", "走进业务现场，对齐场景、流程与成功标准。"],
  ["Build & Evals", "编排 Agent、知识与工具，用业务样本验证结果。"],
  ["Deploy", "完成系统集成、权限配置、培训与交接。"],
  ["持续优化", "将运行反馈带回 Evals，验证迭代后再扩展。"]
] as const;

export default function CompanyHome() {
  return (
    <>
      <a className="skip-link" href="#main">跳到正文</a>
      <CompanyHeader />
      <main id="main">
        <QuantumHero />
        <QuantumStory />
        <CompanyWork />
        <section id="technology" className="technology-light" aria-labelledby="technology-title">
          <div className="wrap">
            <div className="technology-heading">
              <h2 id="technology-title">构建 AI Native 企业的完整能力。</h2>
              <p className="section-lead">从 Context Engineering 到 Agent 与 Workflow，<br className="desktop-break" />以 Evals 连接业务落地与持续进化。</p>
            </div>
            <CompanyCapabilities />
            <p className="scope-note">业务范围与技术建设方向，具体能力按项目评估与交付。</p>
          </div>
        </section>
        <CompanySolutions />
        <section id="delivery" className="delivery wrap" aria-labelledby="delivery-title">
          <div className="delivery-heading">
            <h2 id="delivery-title">让每一次建设，<br />都成为下一次进化的起点。</h2>
            <p>与组织的建设者一起，推进从 Discovery、Agent 构建到运行优化的完整交付，让 AI Native 成为组织持续创造价值的工作方式。</p>
          </div>
          <ol className="delivery-stages">{stages.map(([title,summary],index)=><li key={title}><span className="stage-number" aria-hidden="true">0{index+1}</span><h3>{title}</h3><p>{summary}</p></li>)}</ol>
          <p className="commercial-path"><span>Discovery 与 PoC</span><span>项目实施</span><span>软件与持续服务</span><span>增量扩展</span></p>
        </section>
        <CompanyContact />
      </main>
      <CompanyFooter />
    </>
  );
}
