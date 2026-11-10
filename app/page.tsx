import { QuantumHero } from "@/components/QuantumHero";
import { CompanyHeader } from "@/components/CompanyHeader";
import { CompanyContact, CompanyFooter } from "@/components/CompanyFooter";
import { CompanyCapabilities } from "@/components/CompanyCapabilities";
import { CompanySolutions } from "@/components/CompanySolutions";
import { QuantumStory } from "@/components/QuantumStory";
import { CompanyWork } from "@/components/CompanyWork";

const stages = [
  ["发现与对齐", "走进业务现场，梳理知识、流程与成功标准。"],
  ["构建与验证", "连接知识与工具，以真实样本验证应用。"],
  ["部署与运行", "完成系统集成、权限配置、培训与交接。"],
  ["改进与扩展", "把运行反馈转为评测与下一轮建设。"]
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
              <h2 id="technology-title">面向企业 AI 的完整生命周期。</h2>
              <p className="section-lead">把企业知识、业务应用与运行反馈连接起来，<br className="desktop-break" />让每一次建设都成为下一次进化的基础。</p>
            </div>
            <CompanyCapabilities />
            <p className="scope-note">业务范围与技术建设方向，具体能力按项目评估与交付。</p>
          </div>
        </section>
        <CompanySolutions />
        <section id="delivery" className="delivery wrap" aria-labelledby="delivery-title">
          <div className="delivery-heading">
            <h2 id="delivery-title">让每一次建设，<br />都成为下一次进化的起点。</h2>
            <p>我们与组织的建设者一起，重构知识流动与业务协作的方式。从定义问题到系统运行，以持续的实践推动智能与组织共同进化。</p>
          </div>
          <ol className="delivery-stages">{stages.map(([title,summary],index)=><li key={title}><span className="stage-number" aria-hidden="true">0{index+1}</span><h3>{title}</h3><p>{summary}</p></li>)}</ol>
          <p className="commercial-path"><span>场景诊断与试点</span><span>项目实施</span><span>软件与持续服务</span><span>增量扩展</span></p>
        </section>
        <CompanyContact />
      </main>
      <CompanyFooter />
    </>
  );
}
