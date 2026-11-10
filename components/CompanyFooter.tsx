import { ArrowUpRight } from "lucide-react";
import { companyDirections } from "@/lib/company-content";

export function CompanyContact() {
  return (
    <section id="about" className="about-contact wrap" aria-labelledby="about-title">
      <div className="about-copy">
        <h2 id="about-title">与我们一起，<br />定义下一次进化。</h2>
        <p>我们相信，人工智能将重新定义组织创造价值的方式。莫比乌斯致力于连接知识、人的判断与业务行动，让每一次实践积累为持续进化的力量。</p>
        <p>我们希望构建这样的未来：每一个组织，都能在行动中学习；每一次进化，都能打开世界的更多可能。</p>
      </div>
      <div id="contact" className="contact-copy">
        <h2>下一次改变，<br />从一次对话开始。</h2>
        <p>与我们探讨你希望改变的工作、组织与未来。</p>
        <a className="email-link" href="mailto:dangweiyu0516@gmail.com?subject=AI%20%E7%B3%BB%E7%BB%9F%E4%B8%8E%E5%90%88%E4%BD%9C">dangweiyu0516@gmail.com<ArrowUpRight size={24} strokeWidth={1.2} aria-hidden="true" /></a>
      </div>
    </section>
  );
}

export function CompanyFooter() {
  return (
    <footer className="company-footer wrap">
      <div className="footer-direction-links" aria-label="全部业务方向">
        {companyDirections.map(item => <a key={item.id} href={"/technology/" + item.id}>{item.label}</a>)}
      </div>
      <div className="footer-bottom">
        <a href="/" className="footer-brand">莫比乌斯</a>
        <p>公司暂称「未命名」 · 项目筹备中</p>
        <p>© 2026 莫比乌斯项目</p>
      </div>
    </footer>
  );
}
