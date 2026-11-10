export type Invoice = { id: string; supplier: string; orderId: string; invoiceNo: string; amountCents: number };
export type PurchaseOrder = { id: string; supplier: string; amountCents: number };
export type FinanceIssue = "amount" | "duplicate" | "missing-order" | "supplier";
export type FinanceResult = Invoice & { issues: FinanceIssue[]; order?: PurchaseOrder; differenceCents: number | null };

export const demoOrders: PurchaseOrder[] = [
  { id: "PO-2601", supplier: "供应商A", amountCents: 1280000 },
  { id: "PO-2602", supplier: "供应商B", amountCents: 480000 },
  { id: "PO-2603", supplier: "供应商C", amountCents: 360000 },
  { id: "PO-2604", supplier: "供应商E", amountCents: 240000 }
];
export const demoInvoices: Invoice[] = [
  { id: "FP-001", supplier: "供应商A", orderId: "PO-2601", invoiceNo: "F-61101", amountCents: 1280000 },
  { id: "FP-002", supplier: "供应商B", orderId: "PO-2602", invoiceNo: "F-61102", amountCents: 560000 },
  { id: "FP-003", supplier: "供应商C", orderId: "PO-2603", invoiceNo: "F-61103", amountCents: 360000 },
  { id: "FP-004", supplier: "供应商C", orderId: "PO-2603", invoiceNo: "F-61103", amountCents: 360000 },
  { id: "FP-005", supplier: "供应商D", orderId: "PO-2699", invoiceNo: "F-61105", amountCents: 180000 },
  { id: "FP-006", supplier: "供应商E", orderId: "PO-2604", invoiceNo: "F-61106", amountCents: 240000 }
];
export function financeSample(clean = false) {
  const orders = demoOrders.map(order => ({ ...order }));
  const invoices = demoInvoices.map(invoice => ({ ...invoice }));
  if (clean) {
    invoices[1].amountCents = 480000;
    invoices[3].invoiceNo = "F-61104";
    invoices[3].orderId = "PO-2605";
    orders.push({ id: "PO-2605", supplier: "供应商C", amountCents: 360000 });
    orders.push({ id: "PO-2699", supplier: "供应商D", amountCents: 180000 });
  }
  return { orders, invoices };
}
export function parseAmount(value: string): number | null {
  const text = value.trim();
  if (!/^\d{1,9}(?:\.\d{1,2})?$/.test(text)) return null;
  const parts = text.split(".");
  const result = Number(parts[0]) * 100 + Number((parts[1] || "").padEnd(2, "0"));
  return Number.isSafeInteger(result) && result > 0 ? result : null;
}
export function money(cents: number) {
  return new Intl.NumberFormat("zh-CN", { style: "currency", currency: "CNY", maximumFractionDigits: 2, minimumFractionDigits: 0 }).format(cents / 100);
}
export const issueLabels: Record<FinanceIssue, string> = {
  amount: "金额差异", duplicate: "重复发票", "missing-order": "未找到订单", supplier: "供应商不一致"
};
export function reconcileInvoices(invoices: readonly Invoice[], orders: readonly PurchaseOrder[]): FinanceResult[] {
  const byOrder = new Map(orders.map(order => [order.id, order]));
  const copies = new Map<string, number>();
  for (const invoice of invoices) {
    if (!Number.isSafeInteger(invoice.amountCents) || invoice.amountCents <= 0) throw new Error("请填写大于0、最多两位小数的金额。");
    const key = invoice.supplier + ":" + invoice.invoiceNo;
    copies.set(key, (copies.get(key) || 0) + 1);
  }
  return invoices.map(invoice => {
    const order = byOrder.get(invoice.orderId);
    const issues: FinanceIssue[] = [];
    if (!order) issues.push("missing-order");
    else {
      if (order.supplier !== invoice.supplier) issues.push("supplier");
      if (order.amountCents !== invoice.amountCents) issues.push("amount");
    }
    if ((copies.get(invoice.supplier + ":" + invoice.invoiceNo) || 0) > 1) issues.push("duplicate");
    return { ...invoice, order, issues, differenceCents: order ? invoice.amountCents - order.amountCents : null };
  });
}

export type StockItem = { id: string; name: string; onHand: number; reserved: number; dailyDemand: number; leadDays: number; minimumOrder: number };
export type StockResult = StockItem & { available: number; adjustedDemand: number; coverDays: number; adjustedLead: number; orderQuantity: number; risk: "urgent" | "watch" | "stable" };
export const demoStock: StockItem[] = [
  { id: "SKU-101", name: "芯片模组", onHand: 260, reserved: 80, dailyDemand: 40, leadDays: 7, minimumOrder: 50 },
  { id: "SKU-102", name: "包装盒", onHand: 1200, reserved: 200, dailyDemand: 100, leadDays: 5, minimumOrder: 50 },
  { id: "SKU-103", name: "驱动组件", onHand: 680, reserved: 80, dailyDemand: 60, leadDays: 9, minimumOrder: 50 },
  { id: "SKU-104", name: "连接线", onHand: 1800, reserved: 200, dailyDemand: 80, leadDays: 4, minimumOrder: 100 },
  { id: "SKU-105", name: "壳体", onHand: 390, reserved: 90, dailyDemand: 50, leadDays: 8, minimumOrder: 50 }
];
export function planStock(items: readonly StockItem[], growthPercent: number, leadDelay: number): StockResult[] {
  if (!Number.isFinite(growthPercent) || growthPercent < 0 || growthPercent > 50 || !Number.isInteger(leadDelay) || leadDelay < 0 || leadDelay > 7) throw new Error("请检查需求增长与交期设置。");
  return items.map(item => {
    if (![item.onHand, item.reserved, item.dailyDemand, item.leadDays, item.minimumOrder].every(Number.isFinite) || item.dailyDemand <= 0 || item.minimumOrder <= 0 || item.onHand < 0 || item.reserved < 0 || item.leadDays < 0) throw new Error("库存样本数据不完整。");
    const available = Math.max(0, item.onHand - item.reserved);
    const adjustedDemand = Math.ceil(item.dailyDemand * (1 + growthPercent / 100));
    const adjustedLead = item.leadDays + leadDelay;
    const coverDays = available / adjustedDemand;
    const risk: StockResult["risk"] = coverDays < adjustedLead ? "urgent" : coverDays < adjustedLead + 3 ? "watch" : "stable";
    const quantity = Math.max(0, Math.ceil(((adjustedLead + 3 + 7) * adjustedDemand - available) / item.minimumOrder) * item.minimumOrder);
    return { ...item, available, adjustedDemand, coverDays, adjustedLead, orderQuantity: risk === "stable" ? 0 : quantity, risk };
  }).sort((a, b) => ({ urgent: 0, watch: 1, stable: 2 }[a.risk] - { urgent: 0, watch: 1, stable: 2 }[b.risk]) || (a.coverDays - a.adjustedLead) - (b.coverDays - b.adjustedLead));
}
export function csv(rows: readonly (readonly (string | number)[])[]): string {
  return "\uFEFF" + rows.map(row => row.map(cell => {
    let text = String(cell);
    if (/^[=+\-@\t\r]/.test(text)) text = "'" + text;
    return '"' + text.replaceAll('"', '""') + '"';
  }).join(",")).join("\r\n");
}

export type VideoClip = { id: string; label: string; caption: string };
export const videoClips: VideoClip[] = [
  { id: "knowledge", label: "知识", caption: "让知识，连接行动。" },
  { id: "agents", label: "协作", caption: "让协作，成为日常。" },
  { id: "improvement", label: "进化", caption: "让每一次实践，推动进化。" }
];
export type VideoPlan = { duration: 12 | 18; clips: VideoClip[]; captions: string[] };
export function videoPlan(duration: number, reverse: boolean, captions: readonly string[]): VideoPlan {
  if (duration !== 12 && duration !== 18) throw new Error("请选择12秒或18秒。");
  if (captions.length !== 3 || captions.some(text => text.trim().length === 0 || [...text].length > 26)) throw new Error("请为每个镜头填写1至26字字幕。");
  const order = reverse ? [1, 0, 2] : [0, 1, 2];
  return { duration, clips: order.map(index => videoClips[index]), captions: order.map(index => captions[index].trim()) };
}
export function subtitles(plan: VideoPlan) {
  const stamp = (seconds: number) => "00:00:" + String(seconds).padStart(2, "0") + ",000";
  return plan.clips.map((_, index) => String(index + 1) + "\n" + stamp(index * plan.duration / 3) + " --> " + stamp((index + 1) * plan.duration / 3) + "\n" + plan.captions[index]).join("\n\n") + "\n";
}

export type SalesSheet = { fileName: string; sheetName: string; rows: (string | number)[][] };
export type SalesRecord = { orderId: string; store: string; product: string; quantity: number; amountCents: number; source: string };
export type SalesIssue = { source: string; orderId: string; reason: string; original: string };
export type SalesReport = { groupBy: "store" | "product"; deduplicate: boolean; inputFiles: number; inputRows: number; rows: SalesRecord[]; issues: SalesIssue[]; summary: { name: string; quantity: number; amountCents: number; orders: number }[]; totalCents: number };
export const demoSalesSheets: SalesSheet[] = [
  { fileName: "门店A销售.xlsx", sheetName: "销售明细", rows: [
    ["订单号", "门店", "商品", "销售数量", "销售额"],
    ["A01", "门店A", "保温杯", 12, 1188], ["A02", "门店A", "帆布包", 8, 632], ["A03", "门店A", "便携水壶", 5, 495]
  ] },
  { fileName: "门店B销售.xlsx", sheetName: "销售明细", rows: [
    ["单号", "门店名称", "产品", "数量", "金额"],
    ["B01", "门店B", "保温杯", 10, 990], ["B02", "门店B", "帆布包", 6, 474], ["A02", "门店A", "帆布包", 8, 632], ["B03", "门店B", "", 2, 198]
  ] },
  { fileName: "门店C销售.xlsx", sheetName: "销售明细", rows: [
    ["订单编号", "销售门店", "商品名称", "销量", "销售金额"],
    ["C01", "门店C", "保温杯", 9, 891], ["C02", "门店C", "便携水壶", 4, 396], ["C03", "门店C", "帆布包", 3, 237], ["C04", "门店C", "保温杯", "待确认", 100]
  ] }
];
const salesAliases = {
  orderId: ["订单号", "订单编号", "单号"], store: ["门店", "门店名称", "销售门店"],
  product: ["商品", "商品名称", "产品"], quantity: ["销售数量", "数量", "销量"], amount: ["销售额", "销售金额", "金额"]
};
export function aggregateSales(sheets: readonly SalesSheet[], groupBy: "store" | "product", deduplicate = true): SalesReport {
  const rows: SalesRecord[] = [], issues: SalesIssue[] = [], seen = new Set<string>();
  let inputRows = 0;
  for (const sheet of sheets) {
    const headers = (sheet.rows[0] || []).map(value => String(value).trim());
    const columns = Object.fromEntries(Object.entries(salesAliases).map(([key, aliases]) => [key, headers.findIndex(header => aliases.includes(header))])) as Record<keyof typeof salesAliases, number>;
    if (Object.values(columns).some(index => index < 0)) throw new Error(sheet.fileName + "缺少订单、门店、商品、数量或金额列。");
    for (let index = 1; index < sheet.rows.length; index++) {
      const values = sheet.rows[index];
      if (values.every(value => String(value).trim() === "")) continue;
      inputRows++;
      const source = sheet.fileName + " / " + sheet.sheetName + " / 第" + (index + 1) + "行";
      const orderId = String(values[columns.orderId] ?? "").trim(), store = String(values[columns.store] ?? "").trim(), product = String(values[columns.product] ?? "").trim();
      const quantityText = String(values[columns.quantity] ?? "").trim(), amount = parseAmount(String(values[columns.amount] ?? "").trim());
      let reason = "";
      if (!orderId || !store || !product) reason = "缺少订单号、门店或商品";
      else if (!/^\d+$/.test(quantityText) || !Number.isSafeInteger(Number(quantityText)) || Number(quantityText) <= 0) reason = "数量不是有效正整数";
      else if (amount === null) reason = "销售金额无效";
      else if (deduplicate && seen.has(orderId)) reason = "重复订单，已从汇总中排除";
      if (reason) { issues.push({ source, orderId, reason, original: values.map(String).join(" | ") }); continue; }
      seen.add(orderId);
      rows.push({ orderId, store, product, quantity: Number(quantityText), amountCents: amount!, source });
    }
  }
  const groups = new Map<string, { name: string; quantity: number; amountCents: number; orders: number }>();
  for (const row of rows) {
    const name = row[groupBy], group = groups.get(name) ?? { name, quantity: 0, amountCents: 0, orders: 0 };
    group.quantity += row.quantity; group.amountCents += row.amountCents; group.orders++; groups.set(name, group);
  }
  return { groupBy, deduplicate, inputFiles: sheets.length, inputRows, rows, issues, summary: [...groups.values()].sort((a, b) => b.amountCents - a.amountCents || a.name.localeCompare(b.name, "zh-CN")), totalCents: rows.reduce((sum, row) => sum + row.amountCents, 0) };
}
