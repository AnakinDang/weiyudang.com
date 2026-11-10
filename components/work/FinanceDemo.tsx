"use client";

import { useState } from "react";
import { ArrowRight, Download, Check } from "lucide-react";
import { csv, financeSample, issueLabels, money, parseAmount, reconcileInvoices, type FinanceResult } from "@/lib/demo-workflows";
import { downloadText } from "./download";

export function FinanceDemo() {
  const [clean, setClean] = useState(false);
  const [amounts, setAmounts] = useState(() => financeSample().invoices.map(row => (row.amountCents / 100).toFixed(2)));
  const [results, setResults] = useState<FinanceResult[] | null>(null);
  const [selected, setSelected] = useState("FP-002");
  const [reviewed, setReviewed] = useState<string[]>([]);
  const [notice, setNotice] = useState("点击开始核对，查看差异与对应依据。");
  const [invalid, setInvalid] = useState<number[]>([]);
  const sample = financeSample(clean);
  const current = results?.find(row => row.id === selected);
  const issues = results?.filter(row => row.issues.length > 0) ?? [];
  function invalidate() { setResults(null); setReviewed([]); setInvalid([]); setNotice("资料已变更，请重新核对。"); }
  function reset(nextClean = clean) {
    setClean(nextClean); setAmounts(financeSample(nextClean).invoices.map(row => (row.amountCents / 100).toFixed(2)));
    invalidate(); setSelected("FP-002"); setNotice("示例资料已载入，可以开始核对。");
  }
  function run() {
    const values = amounts.map(parseAmount);
    const bad = values.flatMap((value, index) => value === null ? [index] : []);
    setInvalid(bad);
    if (bad.length) { setNotice("请检查标出的金额，填写大于0、最多两位小数的数值。"); return; }
    const next = reconcileInvoices(sample.invoices.map((row, index) => ({ ...row, amountCents: values[index]! })), sample.orders);
    setResults(next); setReviewed([]);
    setSelected(next.find(row => row.issues.length > 0)?.id ?? next[0].id);
    setNotice("已核对" + next.length + "份资料，" + next.filter(row => row.issues.length > 0).length + "项需人工复核。");
  }
  function exportReport() {
    if (!results) return;
    downloadText(csv([
      ["演示项目", "资料", "供应商", "发票号", "订单", "发票金额", "订单金额", "差额", "核对结果", "复核状态"],
      ...results.map(row => ["示例财务核对", row.id, row.supplier, row.invoiceNo, row.orderId, money(row.amountCents), row.order ? money(row.order.amountCents) : "未找到", row.differenceCents === null ? "无法计算" : money(row.differenceCents), row.issues.map(issue => issueLabels[issue]).join("、") || "金额与供应商一致", reviewed.includes(row.id) ? "人工已复核" : row.issues.length ? "待复核" : "规则检查通过"])
    ]), "mobius-finance-demo.csv");
  }
  return (
    <section className="demo-workbench" aria-label="财务核对交互演示">
      <div className="demo-toolbar">
        <label className="demo-sample-label">示例资料<select aria-label="示例资料" value={clean ? "clean" : "issues"} onChange={event => reset(event.target.value === "clean")}><option value="issues">包含异常的样本</option><option value="clean">正常核对样本</option></select></label>
        <div className="demo-actions"><button type="button" onClick={() => reset()}>重置</button><button type="button" className="demo-primary" onClick={run}>开始核对<ArrowRight size={19} aria-hidden="true" /></button></div>
      </div>
      <div className="demo-split">
        <div className="demo-data">
          <div className="demo-table-scroll" tabIndex={0} aria-label="示例发票资料，可横向滚动">
            <table className="demo-table">
              <caption>六份示例发票，金额可编辑</caption>
              <thead><tr><th scope="col">资料</th><th scope="col">供应商</th><th scope="col">订单</th><th scope="col">发票金额</th></tr></thead>
              <tbody>{sample.invoices.map((row, index) => <tr key={row.id} data-selected={selected === row.id && results !== null}><th scope="row"><button type="button" className="demo-row-link" disabled={!results} onClick={() => setSelected(row.id)}>{row.id}</button></th><td>{row.supplier}</td><td>{row.orderId}</td><td><input type="text" inputMode="decimal" aria-label={row.id + "发票金额"} aria-invalid={invalid.includes(index)} value={amounts[index]} onChange={event => { const next = [...amounts]; next[index] = event.target.value; setAmounts(next); invalidate(); }} /></td></tr>)}</tbody>
            </table>
          </div>
          <p className="demo-data-note">按订单、供应商、发票号和金额逐项核对；示例不包含付款操作。</p>
        </div>
        <div className="demo-result">
          <h2>核对结果</h2>
          <p className="demo-status" role="status">{notice}</p>
          {results && <>
            <ul className="demo-finding-list">{(issues.length ? issues : results).map(row => <li key={row.id}><button type="button" aria-pressed={selected === row.id} onClick={() => setSelected(row.id)}><strong>{row.id}</strong><span>{row.issues.map(issue => issueLabels[issue]).join(" · ") || "核对一致"}{reviewed.includes(row.id) && " · 已复核"}</span></button></li>)}</ul>
            {current && <div className="demo-evidence">
              <h3>{current.id} 的依据</h3>
              <dl><div><dt>订单 {current.orderId}</dt><dd>{current.order ? money(current.order.amountCents) : "未找到对应资料"}</dd></div><div><dt>发票 {current.invoiceNo}</dt><dd>{money(current.amountCents)}</dd></div>{current.differenceCents !== null && <div><dt>金额差额</dt><dd className={current.differenceCents ? "demo-attention" : ""}>{money(current.differenceCents)}</dd></div>}</dl>
              {current.issues.includes("duplicate") && <p>同一供应商的发票号出现在{results.filter(row => row.invoiceNo === current.invoiceNo && row.supplier === current.supplier).map(row => row.id).join("、")}中，请确认原件。</p>}
              {current.issues.includes("supplier") && <p>订单供应商为{current.order?.supplier}，与发票不一致。</p>}
              {current.issues.length > 0 && <button type="button" className="demo-review" disabled={reviewed.includes(current.id)} onClick={() => { setReviewed(value => [...value, current.id]); setNotice(current.id + "已标记为人工复核，原始差异仍保留。"); }}>{reviewed.includes(current.id) ? <><Check size={16} aria-hidden="true" />已复核</> : "标记已复核"}</button>}
            </div>}
          </>}
          <button type="button" className="demo-export" disabled={!results} onClick={exportReport}><Download size={17} aria-hidden="true" />导出核对报告</button>
        </div>
      </div>
    </section>
  );
}
