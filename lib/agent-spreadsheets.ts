import type { SalesReport, SalesSheet } from "./demo-workflows";

async function excel() {
  const module = await import("exceljs");
  return module.default;
}
export async function readDemoSheets(signal: AbortSignal): Promise<SalesSheet[]> {
  const ExcelJS = await excel();
  const sources = ["a", "b", "c"], sheets: SalesSheet[] = [];
  for (const [index, key] of sources.entries()) {
    const response = await fetch("/company/spreadsheets/store-" + key + ".xlsx", { signal });
    if (!response.ok) throw new Error("示例Excel暂时无法读取，请重试。");
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(await response.arrayBuffer());
    const worksheet = workbook.worksheets[0];
    if (!worksheet) throw new Error("示例工作表为空。");
    const rows: (string | number)[][] = [];
    worksheet.eachRow(row => {
      const cells: (string | number)[] = [];
      for (let column = 1; column <= 5; column++) { const value = row.getCell(column).value; cells.push(typeof value === "number" ? value : row.getCell(column).text); }
      rows.push(cells);
    });
    sheets.push({ fileName: "门店" + ["A", "B", "C"][index] + "销售.xlsx", sheetName: worksheet.name, rows });
  }
  return sheets;
}
export async function salesWorkbook(report: SalesReport, agentName: string) {
  const ExcelJS = await excel();
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "莫比乌斯交互演示";
  const summary = workbook.addWorksheet("经营汇总");
  summary.addRow([report.groupBy === "store" ? "门店" : "商品", "有效订单数", "销售数量", "销售额（元）"]);
  report.summary.forEach(row => summary.addRow([row.name, row.orders, row.quantity, row.amountCents / 100]));
  summary.addRow(["合计", report.rows.length, report.rows.reduce((sum, row) => sum + row.quantity, 0), report.totalCents / 100]);
  const issues = workbook.addWorksheet("异常清单");
  issues.addRow(["订单号", "原因", "来源", "原始内容"]);
  report.issues.forEach(row => issues.addRow([row.orderId, row.reason, row.source, row.original]));
  const source = workbook.addWorksheet("明细与来源");
  source.addRow(["订单号", "门店", "商品", "数量", "销售额（元）", "来源"]);
  report.rows.forEach(row => source.addRow([row.orderId, row.store, row.product, row.quantity, row.amountCents / 100, row.source]));
  const notes = workbook.addWorksheet("运行说明");
  notes.addRows([["项目", "说明"], ["智能体", agentName], ["环境", "企业群聊模拟器，规则演示，未连接真实企业微信"], ["汇总口径", report.groupBy === "store" ? "按门店" : "按商品"], ["重复订单", report.deduplicate ? "排除并保留在异常清单" : "按配置保留"], ["输入", report.inputFiles + "份Excel / " + report.inputRows + "行"], ["有效明细", report.rows.length], ["待确认", report.issues.length]]);
  workbook.eachSheet(sheet => {
    sheet.views = [{ state: "frozen", ySplit: 1 }];
    sheet.getRow(1).font = { bold: true, color: { argb: "FF111621" } };
    sheet.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFDDE6F1" } };
    sheet.getRow(1).height = 26;
    sheet.columns.forEach((column, index) => { column.width = index >= 2 ? 32 : 22; });
    sheet.eachRow(row => { row.alignment = { vertical: "middle", wrapText: true }; row.height = row.number === 1 ? 26 : sheet.name === "运行说明" ? 48 : 36; });
  });
  summary.getColumn(4).numFmt = "#,##0.00"; source.getColumn(5).numFmt = "#,##0.00";
  const buffer = await workbook.xlsx.writeBuffer();
  return new Blob([new Uint8Array(buffer)], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
}
