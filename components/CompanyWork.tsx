import { ArrowUpRight } from "lucide-react";
import { workProjects, type WorkId } from "@/lib/company-work";
import { demoInvoices, demoOrders, demoStock, money, planStock, reconcileInvoices, videoPlan, videoClips, aggregateSales, demoSalesSheets } from "@/lib/demo-workflows";
import { VideoSimulator } from "@/components/work/VideoSimulator";

function WorkPreview({ id }: { id: WorkId }) {
  if (id === "custom-agent") {
    const result = aggregateSales(demoSalesSheets, "store");
    return <div className="work-agent-preview"><p className="work-agent-room">经营协作群 · 模拟</p><div><span>运营同事</span><p>@小莫 合并三份Excel，整理最终报表。</p></div><div className="work-agent-reply"><span>小莫 · 数据助理</span><p>已汇总{result.rows.length}行，销售额{money(result.totalCents)}。异常与来源已保留。</p><p className="work-agent-file">经营汇总.xlsx · {result.issues.length}项待确认</p></div></div>;
  }
  if (id === "finance") {
    const rows = reconcileInvoices(demoInvoices, demoOrders).slice(0, 2);
    return <div className="work-artifact"><table><caption>预置样本的核对预览</caption><thead><tr><th scope="col">发票编号</th><th scope="col">发票金额</th><th scope="col">核对结果</th></tr></thead><tbody>{rows.map(row => <tr key={row.id}><th scope="row">{row.id}</th><td>{money(row.amountCents)}</td><td className={row.issues.length ? "demo-attention" : ""}>{row.issues.length ? "需复核" : "一致"}</td></tr>)}</tbody></table><p>订单 {money(rows[1].order!.amountCents)} · 差额 <strong className="demo-attention">{money(rows[1].differenceCents!)}</strong></p></div>;
  }
  if (id === "supply-chain") {
    const rows = planStock(demoStock, 0, 0);
    return <div className="work-artifact"><table><caption>预置样本的库存分析预览</caption><thead><tr><th scope="col">物料</th><th scope="col">可用天数</th><th scope="col">状态</th></tr></thead><tbody>{["SKU-101", "SKU-103", "SKU-102"].map(key => { const row = rows.find(item => item.id === key)!; return <tr key={key}><th scope="row">{row.name}</th><td>{row.coverDays.toFixed(1)}天</td><td className={row.risk === "urgent" ? "demo-attention" : ""}>{row.risk === "urgent" ? "交期风险" : row.risk === "watch" ? "建议补货" : "库存充足"}</td></tr>; })}</tbody></table></div>;
  }
  return <div className="work-video-preview"><VideoSimulator compact plan={videoPlan(12, false, videoClips.map(clip => clip.caption))} /></div>;
}

export function CompanyWork({ heading = true }: { heading?: boolean }) {
  return (
    <section id="work" className={"work-list-section wrap" + (heading ? "" : " work-list-standalone")} aria-label="演示案例">
      {heading && <div className="work-section-heading"><h2>从一个任务，<br />看到系统如何工作。</h2><div><p className="section-lead">用示例资料，体验从输入到可复核结果的完整流程。</p><p className="work-demo-note">交互演示 · 示例数据</p></div></div>}
      <div className="work-rows">{workProjects.map(project => <article key={project.id} className="work-row"><div className="work-row-copy"><h3>{project.title}</h3><p>{project.summary}</p><a className="accent-link" href={"/work/" + project.id}>进入演示<ArrowUpRight size={21} strokeWidth={1.1} aria-hidden="true" /></a></div><WorkPreview id={project.id} /></article>)}</div>
      {heading && <a className="accent-link work-all-link" href="/work">查看全部演示<ArrowUpRight size={21} strokeWidth={1.1} aria-hidden="true" /></a>}
    </section>
  );
}
