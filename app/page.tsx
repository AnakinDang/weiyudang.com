import { QuantumSequence } from "@/components/QuantumSequence";
import { ArrowRight, Infinity as InfinityMark } from "lucide-react";
import { CompanyCapabilities } from "@/components/CompanyCapabilities";

const stages = [
  ["发现与对齐", "真实流程、业务基线与目标"],
  ["构建与验证", "企业知识、应用与评测"],
  ["部署与运行", "系统集成、培训与验收"],
  ["改进与扩展", "运行复盘、相邻流程与持续服务"]
] as const;

export default function CompanyHome() {
  return (
    <>
      <a className="skip-link" href="#main">跳到正文</a>
      <header className="company-header">
        <div className="wrap header-inner">
          <a className="wordmark" href="/" aria-label="莫比乌斯项目首页">
            <InfinityMark size={46} strokeWidth={1.25} aria-hidden="true" /><span>莫比乌斯</span>
          </a>
          <nav aria-label="主导航">
            <a href="#technology">业务与技术</a>
            <a href="#delivery">交付方式</a>
            <a href="#about">关于我们</a>
            <a className="outline-link" href="#contact">联系合作</a>
          </nav>
        </div>
      </header>
      <main id="main">
        <QuantumSequence />
        <section id="technology" className="technology-light" aria-labelledby="technology-title"><div className="wrap">
          <div className="technology-heading"><h2 id="technology-title">从企业知识，<br />到业务行动。</h2><div><p className="section-lead">围绕具体场景，组合知识、智能体与业务系统。</p><p className="industries" aria-label="业务探索方向">能源 · 制造 · 通信 · 医疗 · 保险 · 零售</p></div></div>
          <CompanyCapabilities />
          <p className="scope-note">业务范围与技术建设方向，具体能力按项目评估与交付。</p>
        </div></section>
        <section id="delivery" className="delivery wrap" aria-labelledby="delivery-title">
          <div className="delivery-heading">
            <h2 id="delivery-title">每一次交付，<br />都是下一轮进化的起点。</h2>
            <p>深入现场，验证价值，交付上线，再用真实反馈持续改进。</p>
          </div>
          <div className="delivery-cycle">
            <svg className="cycle-track" viewBox="0 0 1280 190" preserveAspectRatio="none" aria-hidden="true">
              <path id="cycle-path" d="M130 35H1150C1320 35 1320 180 1150 180H130C-40 180-40 35 130 35Z" />
              <circle className="orbit-tracer" r="3"><animateMotion dur="28s" repeatCount="indefinite"><mpath href="#cycle-path" /></animateMotion></circle>
            </svg>
            <ol className="delivery-stages">
              {stages.map(([title, summary], index) => (
                <li key={title}>
                  <span className="stage-number" aria-hidden="true">0{index + 1}</span>
                  <span className="stage-point" aria-hidden="true" />
                  <h3>{title}</h3><p>{summary}</p>
                </li>
              ))}
            </ol>
          </div>
          <p className="commercial-path"><span>诊断与试点</span><span>项目实施</span><span>软件与持续服务</span><span>增量扩展</span></p>
        </section>
        <section id="about" className="about-contact wrap" aria-labelledby="about-title">
          <div className="about-copy">
            <h2 id="about-title">立足陕西，<br />与企业一起向前。</h2>
            <p>莫比乌斯专注于企业 AI 应用与交付。<br />我们从一条具体流程开始，让每次实践积累为下一次交付的能力。</p>
          </div>
          <div id="contact" className="contact-copy">
            <h2>从一个真实问题开始。</h2>
            <p>告诉我们，哪一段业务最值得重新设计。</p>
            <a className="email-link" href="mailto:dangweiyu0516@gmail.com?subject=%E4%BC%81%E4%B8%9A%20AI%20%E5%BA%94%E7%94%A8%E5%90%88%E4%BD%9C">dangweiyu0516@gmail.com<ArrowRight size={25} aria-hidden="true" /></a>
          </div>
        </section>
      </main>
      <footer className="company-footer wrap">
        <a href="/" aria-label="返回莫比乌斯项目首页">莫比乌斯</a>
        <p>公司暂称「未命名」 · 项目筹备中</p>
        <p>© 2026 莫比乌斯项目</p>
      </footer>
    </>
  );
}
