import { ArrowUpRight, Minus, Plus } from "lucide-react";
import { companySolutions } from "@/lib/company-solutions";

function SolutionFlow() {
  return (
    <><svg className="solution-flow" viewBox="0 0 900 70" preserveAspectRatio="none" fill="none" aria-hidden="true">
      <path className="solution-flow-line" d="M0 38C130-4 210 69 340 33S550 9 670 32S800 55 900 25" />
      <path className="solution-flow-current" pathLength="100" d="M0 38C130-4 210 69 340 33S550 9 670 32S800 55 900 25" />
      <circle cx="24" cy="32" r="3" /><circle cx="342" cy="32" r="3" /><circle cx="670" cy="32" r="3" />
    </svg><svg className="solution-flow-mobile" viewBox="0 0 12 400" preserveAspectRatio="none" fill="none" aria-hidden="true"><path className="solution-flow-line" d="M6 0V400" /><path className="solution-flow-current" pathLength="100" d="M6 0V400" /></svg></>
  );
}

export function CompanySolutions() {
  return (
    <section id="solutions" className="solutions wrap" aria-labelledby="solutions-title">
      <h2 id="solutions-title">让 AI，走进真实的业务现场。</h2>
      <p className="section-lead">从零售、财务到内容生产，把一次次重复工作，连接成持续创造价值的系统。</p>
      <div className="solution-list">
        {companySolutions.map((solution, index) => (
          <details key={solution.id} id={"solution-" + solution.id} name="business-solutions" className="solution" open={index === 0}>
            <summary>
              <h3><span className="solution-sector">{solution.sector}</span><span className="solution-promise">{solution.title}</span></h3>
              <Plus className="solution-expand" size={22} strokeWidth={1} aria-hidden="true" /><Minus className="solution-collapse" size={22} strokeWidth={1} aria-hidden="true" />
            </summary>
            <div className="solution-body">
              <div className="solution-introduction"><p>{solution.introduction}</p><a className="accent-link" href={"mailto:dangweiyu0516@gmail.com?subject=" + encodeURIComponent("莫比乌斯 · " + solution.contact + "方案交流")}>探讨{solution.contact}方案<ArrowUpRight size={21} strokeWidth={1.1} aria-hidden="true" /></a></div>
              <div className="solution-workflow"><SolutionFlow /><ol>{solution.steps.map(step => <li key={step.title}><h4>{step.title}</h4><p>{step.body}</p></li>)}</ol></div>
            </div>
          </details>
        ))}
      </div>
      <p className="scope-note">场景方案示例，按实际业务与系统环境设计。</p>
    </section>
  );
}
