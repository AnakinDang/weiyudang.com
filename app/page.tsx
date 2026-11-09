import Image from "next/image";
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
        <section className="hero wrap" aria-labelledby="hero-title">
          <div className="hero-copy">
            <h1 id="hero-title">让 AI 成为<br />企业的运行方式。</h1>
            <p>深入业务现场，连接企业知识与业务系统。<br className="desktop-break" />从关键流程的改造，到持续运行与改进。</p>
            <div className="hero-actions">
              <a className="primary-link" href="#contact">探讨业务场景<ArrowRight size={22} aria-hidden="true" /></a>
              <a className="quiet-link" href="#delivery">了解交付方式</a>
            </div>
          </div>
          <div className="hero-universe" aria-hidden="true">
            <Image className="particle-loop hero-particle" src="/company/mobius-particles.webp" alt="" width={1536} height={1024} sizes="(max-width: 760px) 100vw, 60vw" preload quality={95} />
            <svg className="hero-orbit" viewBox="0 0 760 540" fill="none">
              <path id="hero-orbit-path" d="M62 397C-26 266 515-48 698 74C882 196 255 684 62 397Z" />
              <circle className="orbit-tracer" r="3.5"><animateMotion dur="22s" repeatCount="indefinite"><mpath href="#hero-orbit-path" /></animateMotion></circle>
            </svg>
          </div>
        </section>
        <section className="business-intro wrap" aria-labelledby="business-title">
          <h2 id="business-title">业务、技术与交付，<br />在同一条轨道上。</h2>
          <div>
            <p>从发现业务机会，到组织知识、构建应用、上线运行，我们与企业团队一起完成 AI 转型。</p>
            <p className="industries" aria-label="业务探索方向">能源 · 制造 · 通信 · 医疗 · 保险 · 零售</p>
          </div>
        </section>
        <section id="technology" className="technology-section wrap" aria-labelledby="technology-title">
          <h2 id="technology-title">覆盖企业 AI 的完整生命周期。</h2>
          <p className="section-lead">围绕具体场景，组合知识、智能体与业务系统。</p>
          <CompanyCapabilities />
          <p className="scope-note">业务范围与技术建设方向，具体能力按项目评估与交付。</p>
        </section>
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
          <Image className="particle-cycle" src="/company/mobius-cycle.webp" alt="" width={2048} height={768} sizes="(max-width: 760px) 100vw, 90vw" quality={95} />
          <p className="commercial-path">诊断与试点 <span>·</span> 项目实施 <span>·</span> 软件与持续服务 <span>·</span> 增量扩展</p>
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
