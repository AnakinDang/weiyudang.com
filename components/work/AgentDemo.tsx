"use client";

import { Download, FileSpreadsheet, ArrowUp, Check } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { aggregateSales, money, type SalesReport } from "@/lib/demo-workflows";

type Config = { name: string; groupBy: "store" | "product"; deduplicate: boolean };
type Message = { id: number; role: "employee" | "agent" | "system"; name: string; text: string; files?: boolean };
type ReportTab = "summary" | "issues" | "sources";
const initialMessages: Message[] = [{ id: 0, role: "employee", name: "运营同事 · 示例账号", text: "三家门店的销售表已经收齐，需要一份能看清销售额、异常和来源的汇总报表。" }];
const files = ["a", "b", "c"];
const tabs: { id: ReportTab; label: string }[] = [{ id: "summary", label: "经营汇总" }, { id: "issues", label: "异常清单" }, { id: "sources", label: "明细与来源" }];

export function AgentDemo() {
  const [name, setName] = useState("小莫"), [groupBy, setGroupBy] = useState<"store" | "product">("store"), [deduplicate, setDeduplicate] = useState(true);
  const [config, setConfig] = useState<Config | null>(null), [attached, setAttached] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages), [prompt, setPrompt] = useState("@小莫 合并这些Excel，按门店汇总，列出异常并生成最终报表。");
  const [busy, setBusy] = useState(false), [exporting, setExporting] = useState(false);
  const [report, setReport] = useState<SalesReport | null>(null), [tab, setTab] = useState<ReportTab>("summary");
  const [notice, setNotice] = useState("先定制一位 Agent，再把它加入模拟群聊。");
  const sequence = useRef(1), job = useRef(0), request = useRef<AbortController | null>(null), log = useRef<HTMLDivElement>(null), tabButtons = useRef<(HTMLButtonElement | null)[]>([]);
  function append(role: Message["role"], sender: string, text: string, attachments = false) {
    const message = { id: sequence.current++, role, name: sender, text, files: attachments };
    setMessages(current => [...current.slice(-19), message]);
  }
  useEffect(() => { if (log.current) log.current.scrollTop = log.current.scrollHeight; }, [messages]);
  useEffect(() => () => { job.current++; request.current?.abort(); }, []);
  function configure(event: FormEvent) {
    event.preventDefault();
    const value = name.trim();
    if (!/^[\p{L}\p{N}_-]{1,12}$/u.test(value)) { setNotice("Agent 名称请使用1至12个文字、数字、下划线或短横线。"); return; }
    const next: Config = { name: value, groupBy, deduplicate };
    setConfig(next); setReport(null);
    append("system", "群聊模拟", config ? value + "的工作规则已更新。" : value + "已加入经营协作群（模拟）。");
    append("agent", value, "我可以整理群内Excel，统一字段，按" + (groupBy === "store" ? "门店" : "商品") + "汇总，并保留异常与来源。请把表格加入群聊后@" + value + "。");
    setPrompt("@" + value + " 合并这些Excel，按" + (groupBy === "store" ? "门店" : "商品") + "汇总，列出异常并生成最终报表。");
    setNotice("Agent 已就绪。加入示例Excel后，即可发送@任务。");
  }
  function attach() {
    setAttached(true); setReport(null);
    append("employee", "运营同事 · 示例账号", "请整理这三份门店Excel，保留每条记录的来源。", true);
    setNotice("三份示例Excel已加入模拟群聊。");
  }
  async function send(event: FormEvent) {
    event.preventDefault();
    if (!config || busy || !prompt.trim()) return;
    const text = prompt.trim(); setPrompt("");
    append("employee", "运营同事 · 示例账号", text);
    const mention = new RegExp("(^|\\s)@" + config.name + "(?=$|\\s|[，,:：])");
    if (!mention.test(text)) { setNotice("消息已发送。@" + config.name + "才会触发任务。"); return; }
    if (!attached) { append("agent", config.name, "请先点击“加入三份Excel”，把需要整理的表格加入模拟群聊。"); return; }
    if (!/(合并|汇总|整理|报表)/.test(text)) { append("agent", config.name, "本演示支持Excel整理与汇总。你可以让我按门店或按商品汇总，并列出异常。"); return; }
    const run = ++job.current, controller = new AbortController(); request.current = controller;
    const by = text.includes("按商品") ? "product" : text.includes("按门店") ? "store" : config.groupBy;
    setBusy(true); setReport(null); setNotice("正在读取Excel并整理数据。");
    append("agent", config.name, "收到。我会读取三份Excel、统一字段，按" + (by === "store" ? "门店" : "商品") + "汇总，再把异常和来源一起交给你。");
    try {
      const { readDemoSheets } = await import("@/lib/agent-spreadsheets");
      const sheets = await readDemoSheets(controller.signal);
      if (job.current !== run) return;
      const next = aggregateSales(sheets, by, config.deduplicate);
      setReport(next); setTab("summary");
      append("agent", config.name, "已读取" + next.inputFiles + "份Excel，共" + next.inputRows + "行；" + next.rows.length + "行进入汇总，" + next.issues.length + "行列入待确认清单。总销售额" + money(next.totalCents) + "。下方可查看汇总、异常和原始来源，并下载最终Excel。");
      setNotice("任务完成。请检查异常清单后下载报表。");
    } catch {
      if (job.current === run) { append("agent", config.name, "本次文件读取未完成。请重新加入示例表格后重试。"); setNotice("文件读取未完成，可以重试。"); }
    } finally { if (job.current === run) { setBusy(false); request.current = null; } }
  }
  async function exportReport() {
    if (!report || !config || exporting) return;
    const run = job.current; setExporting(true);
    try {
      const { salesWorkbook } = await import("@/lib/agent-spreadsheets");
      const blob = await salesWorkbook(report, config.name);
      if (job.current !== run) return;
      const url = URL.createObjectURL(blob), link = document.createElement("a");
      link.href = url; link.download = "mobius-agent-report.xlsx"; document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
      setNotice("Excel已生成，包含经营汇总、异常清单、明细来源与运行说明。");
    } catch { if (job.current === run) setNotice("报表导出未完成，请重试。"); }
    finally { if (job.current === run) setExporting(false); }
  }
  function reset() {
    job.current++; request.current?.abort(); request.current = null;
    setName("小莫"); setGroupBy("store"); setDeduplicate(true); setConfig(null); setAttached(false); setMessages(initialMessages);
    setPrompt("@小莫 合并这些Excel，按门店汇总，列出异常并生成最终报表。"); setBusy(false); setExporting(false); setReport(null); setNotice("演示已重置，可以重新定制 Agent。");
  }
  return (
    <section className="demo-workbench agent-workbench" aria-label="定制 Agent 与企业群聊模拟器">
      <div className="agent-config"><form onSubmit={configure}><h2>定制一位 AI 同事</h2><label>Agent 名称<input value={name} maxLength={12} disabled={busy || exporting} onChange={event => setName(event.target.value)} /></label><label>汇总口径<select value={groupBy} disabled={busy || exporting} onChange={event => setGroupBy(event.target.value as "store" | "product")}><option value="store">按门店汇总</option><option value="product">按商品汇总</option></select></label><label className="demo-checkbox"><input type="checkbox" checked={deduplicate} disabled={busy || exporting} onChange={event => setDeduplicate(event.target.checked)} />排除重复订单</label><p>工作能力：Excel整理、字段统一、经营汇总与异常留痕。</p><button type="submit" className="demo-primary" disabled={busy || exporting}>{config ? "更新 Agent" : "创建并加入模拟群"}</button></form><p className="agent-config-note">规则修改后点击更新，应用到下一次任务。此处不连接真实企业微信群。</p><button type="button" onClick={reset}>重置演示</button></div>
      <div className="agent-chat"><div className="agent-chat-header"><div><h2>经营协作群</h2><p>企业微信群聊模拟</p></div><span>{config ? config.name + "已加入" : "等待 Agent 加入"}</span></div>
        <div className="agent-messages" ref={log} role="log" aria-label="模拟群聊消息" aria-live="polite">{messages.map(message => message.role === "system" ? <p className="agent-system-message" key={message.id}>{message.text}</p> : <div className={"agent-message agent-message-" + message.role} key={message.id}><span className="agent-message-name">{message.name}</span><div className="agent-message-body"><p>{message.text}</p>{message.files && <ul className="agent-attachments">{files.map((key, index) => <li key={key}><a href={"/company/spreadsheets/store-" + key + ".xlsx"} download={"门店" + ["A", "B", "C"][index] + "销售.xlsx"}><FileSpreadsheet size={20} strokeWidth={1.4} aria-hidden="true" /><span>门店{["A", "B", "C"][index]}销售.xlsx<small>示例Excel · 可下载原表</small></span></a></li>)}</ul>}</div></div>)}</div>
        <div className="agent-chat-tools"><button type="button" disabled={!config || attached || busy} onClick={attach}><FileSpreadsheet size={17} aria-hidden="true" />{attached ? "三份Excel已加入" : "加入三份Excel"}</button>{config && <button type="button" disabled={busy} onClick={() => setPrompt("@" + config.name + " 合并这些Excel，按商品汇总，列出异常并生成最终报表。")}>试试按商品汇总</button>}</div>
        <form className="agent-composer" onSubmit={send}><label htmlFor="agent-message">给群聊发消息</label><div><textarea id="agent-message" value={prompt} rows={2} maxLength={180} disabled={!config || busy || exporting} onChange={event => setPrompt(event.target.value)} onKeyDown={event => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} /><button type="submit" aria-label="发送群聊任务" disabled={!config || busy || exporting || !prompt.trim()}><ArrowUp size={19} aria-hidden="true" />发送</button></div></form>
      </div>
      <p className="agent-status demo-status" role="status">{notice}</p>
      {report && <div className="agent-report"><div className="agent-report-heading"><div><h2>最终报表</h2><p>{report.inputFiles}份Excel · {report.inputRows}行输入 · {report.rows.length}行进入汇总 · {report.issues.length}行待确认</p></div><button type="button" className="demo-primary" disabled={exporting} onClick={exportReport}><Download size={17} aria-hidden="true" />{exporting ? "正在导出" : "下载最终Excel"}</button></div>
        <div role="tablist" aria-label="报表工作表" className="agent-report-tabs">{tabs.map((item, index) => <button key={item.id} type="button" role="tab" id={"agent-tab-" + item.id} aria-controls="agent-report-panel" aria-selected={tab === item.id} tabIndex={tab === item.id ? 0 : -1} ref={element => { tabButtons.current[index] = element; }} onClick={() => setTab(item.id)} onKeyDown={event => { let next = index; if (event.key === "ArrowRight") next = (index + 1) % tabs.length; else if (event.key === "ArrowLeft") next = (index + tabs.length - 1) % tabs.length; else if (event.key === "Home") next = 0; else if (event.key === "End") next = tabs.length - 1; else return; event.preventDefault(); setTab(tabs[next].id); tabButtons.current[next]?.focus(); }}>{item.label}{item.id === "issues" && "（" + report.issues.length + "）"}</button>)}</div>
        <div id="agent-report-panel" role="tabpanel" aria-labelledby={"agent-tab-" + tab} className="demo-table-scroll" tabIndex={0}>
          {tab === "summary" ? <table className="demo-table"><caption>经营汇总</caption><thead><tr><th scope="col">{report.groupBy === "store" ? "门店" : "商品"}</th><th scope="col">有效订单数</th><th scope="col">销售数量</th><th scope="col">销售额</th></tr></thead><tbody>{report.summary.map(row => <tr key={row.name}><th scope="row">{row.name}</th><td>{row.orders}</td><td>{row.quantity}</td><td>{money(row.amountCents)}</td></tr>)}</tbody><tfoot><tr><th scope="row">合计</th><td>{report.rows.length}</td><td>{report.rows.reduce((sum, row) => sum + row.quantity, 0)}</td><td>{money(report.totalCents)}</td></tr></tfoot></table> : tab === "issues" ? <table className="demo-table"><caption>异常清单，已从汇总中排除</caption><thead><tr><th scope="col">订单号</th><th scope="col">原因</th><th scope="col">来源</th></tr></thead><tbody>{report.issues.map(row => <tr key={row.source}><th scope="row">{row.orderId || "未填写"}</th><td>{row.reason}</td><td>{row.source}</td></tr>)}</tbody></table> : <table className="demo-table"><caption>有效明细与来源</caption><thead><tr><th scope="col">订单号</th><th scope="col">门店</th><th scope="col">商品</th><th scope="col">数量</th><th scope="col">销售额</th><th scope="col">来源</th></tr></thead><tbody>{report.rows.map((row, index) => <tr key={row.source + index}><th scope="row">{row.orderId}</th><td>{row.store}</td><td>{row.product}</td><td>{row.quantity}</td><td>{money(row.amountCents)}</td><td>{row.source}</td></tr>)}</tbody></table>}
        </div><p className="demo-data-note"><Check size={14} aria-hidden="true" />每行保留来源文件、工作表与原始行号。{!report.deduplicate && "本次按配置保留重复订单。"}</p></div>}
    </section>
  );
}
