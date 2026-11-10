"use client";

import { useState } from "react";
import { ArrowRight, Download } from "lucide-react";
import { csv, demoStock, planStock, type StockResult } from "@/lib/demo-workflows";
import { downloadText } from "./download";

const riskLabels = { urgent: "交期风险", watch: "建议补货", stable: "库存充足" };
export function SupplyDemo() {
  const [growth, setGrowth] = useState(0), [delay, setDelay] = useState(0);
  const [results, setResults] = useState<StockResult[] | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [notice, setNotice] = useState("调整需求与交期后，分析库存风险。");
  function invalidate() { setResults(null); setSelected([]); setNotice("参数已变更，请重新分析库存。"); }
  function reset() { setGrowth(0); setDelay(0); invalidate(); setNotice("示例参数已重置，可以开始分析。"); }
  function run() {
    const next = planStock(demoStock, growth, delay);
    setResults(next); setSelected([]);
    setNotice("分析完成，" + next.filter(row => row.risk !== "stable").length + "项补货建议，" + next.filter(row => row.risk === "urgent").length + "项交期风险。");
  }
  function exportPlan() {
    if (!results || !selected.length) return;
    downloadText(csv([
      ["项目", "物料", "名称", "可用库存", "调整后日需", "覆盖天数", "交期天数", "建议量", "状态", "需求增长", "交期延长"],
      ...results.filter(row => selected.includes(row.id)).map(row => ["示例补货草案，待采购确认", row.id, row.name, row.available, row.adjustedDemand, row.coverDays.toFixed(1), row.adjustedLead, row.orderQuantity, riskLabels[row.risk], growth + "%", delay + "天"])
    ]), "mobius-supply-demo.csv");
  }
  return (
    <section className="demo-workbench" aria-label="供应链规划交互演示">
      <div className="demo-toolbar supply-toolbar">
        <div className="supply-controls"><label>需求增长 <output>{growth}%</output><input type="range" aria-label="需求增长" min="0" max="50" step="10" value={growth} onChange={event => { setGrowth(Number(event.target.value)); invalidate(); }} /></label><label>交期延长<select value={delay} onChange={event => { setDelay(Number(event.target.value)); invalidate(); }}>{[0, 1, 3, 5, 7].map(value => <option key={value} value={value}>{value === 0 ? "按当前交期" : value + "天"}</option>)}</select></label></div>
        <div className="demo-actions"><button type="button" onClick={reset}>重置</button><button type="button" className="demo-primary" onClick={run}>分析库存<ArrowRight size={19} aria-hidden="true" /></button></div>
      </div>
      <div className="demo-split">
        <div className="demo-data">
          <div className="demo-table-scroll" tabIndex={0} aria-label="五项库存示例，可横向滚动"><table className="demo-table stock-table"><caption>五项示例物料</caption><thead><tr><th scope="col">物料</th><th scope="col">现存</th><th scope="col">已占用</th><th scope="col">日需</th><th scope="col">交期</th></tr></thead><tbody>{demoStock.map(row => <tr key={row.id}><th scope="row">{row.name}<small>{row.id}</small></th><td>{row.onHand}</td><td>{row.reserved}</td><td>{row.dailyDemand}</td><td>{row.leadDays}天</td></tr>)}</tbody></table></div>
          <p className="demo-data-note">可用库存＝现存−已占用；安全库存3天，补货周期7天。此示例不含在途库存与多仓调拨。</p>
        </div>
        <div className="demo-result">
          <h2>补货草案</h2>
          <p className="demo-status" role="status">{notice}</p>
          {results && <ul className="supply-findings">{results.map(row => <li key={row.id} data-risk={row.risk}><div className="supply-finding-title"><strong>{row.name}</strong><span>{riskLabels[row.risk]}</span></div><p>可用{row.available}件 ÷ 日需{row.adjustedDemand}件＝{row.coverDays.toFixed(1)}天；交期{row.adjustedLead}天。</p>{row.risk !== "stable" && <><p>建议补货<strong>{row.orderQuantity}件</strong>{row.risk === "urgent" && "，同时确认加急或替代供应。"}</p><label className="demo-checkbox"><input type="checkbox" checked={selected.includes(row.id)} onChange={event => setSelected(current => event.target.checked ? [...current, row.id] : current.filter(id => id !== row.id))} />加入补货草案</label></>}</li>)}</ul>}
          <p className="demo-selection-note">{selected.length > 0 ? "已选择" + selected.length + "项，导出后由采购确认。" : "选择建议条目后可导出草案。"}</p>
          <button type="button" className="demo-export" disabled={!selected.length} onClick={exportPlan}><Download size={17} aria-hidden="true" />导出补货草案</button>
        </div>
      </div>
    </section>
  );
}
