import assert from "node:assert/strict";
import { aggregateSales, csv, demoSalesSheets, demoStock, financeSample, parseAmount, planStock, reconcileInvoices, subtitles, videoClips, videoPlan } from "../lib/demo-workflows.ts";
import ExcelJS from "exceljs";
import { salesWorkbook } from "../lib/agent-spreadsheets.ts";

assert.equal(parseAmount("4800.01"), 480001);
assert.equal(parseAmount("0.10"), 10);
for (const value of ["", "NaN", "Infinity", "-2", "1e3", "1.005", "0", "2,300"]) assert.equal(parseAmount(value), null, value);
const sample = financeSample();
const results = reconcileInvoices(sample.invoices, sample.orders);
assert.equal(results.filter(row => row.issues.length).length, 4);
assert.equal(results.find(row => row.id === "FP-002").differenceCents, 80000);
assert.deepEqual(results.filter(row => row.issues.includes("duplicate")).map(row => row.id), ["FP-003", "FP-004"]);
assert.equal(results.find(row => row.id === "FP-005").differenceCents, null);
const clean = financeSample(true);
assert.ok(reconcileInvoices(clean.invoices, clean.orders).every(row => !row.issues.length));
assert.ok(reconcileInvoices([{ ...clean.invoices[0], supplier: "其他供应商" }], clean.orders)[0].issues.includes("supplier"));
assert.equal(reconcileInvoices([{ ...clean.invoices[0], amountCents: clean.invoices[0].amountCents - 1 }], clean.orders)[0].differenceCents, -1);
assert.throws(() => reconcileInvoices([{ ...clean.invoices[0], amountCents: NaN }], clean.orders));
assert.ok(sample.invoices[3].invoiceNo === sample.invoices[2].invoiceNo, "Clean sample must not mutate the original fixture");

const baseline = planStock(demoStock, 0, 0), stressed = planStock(demoStock, 50, 7);
assert.equal(baseline.filter(row => row.risk === "urgent").length, 2);
assert.equal(baseline.filter(row => row.risk !== "stable").length, 3);
assert.equal(baseline.find(row => row.id === "SKU-101").coverDays, 4.5);
assert.equal(baseline.find(row => row.id === "SKU-101").orderQuantity, 500);
assert.equal(baseline.find(row => row.id === "SKU-103").orderQuantity, 550);
assert.equal(baseline.find(row => row.id === "SKU-102").orderQuantity, 0);
for (const row of stressed) {
  assert.ok(Number.isFinite(row.coverDays));
  assert.ok(row.orderQuantity >= baseline.find(item => item.id === row.id).orderQuantity);
  assert.equal(row.orderQuantity % row.minimumOrder, 0);
}
assert.equal(planStock([{ ...demoStock[0], reserved: 999 }], 0, 0)[0].available, 0);
for (const values of [[-1,0], [51,0], [0,8], [NaN,0]]) assert.throws(() => planStock(demoStock, ...values));
assert.throws(() => planStock([{ ...demoStock[0], minimumOrder: 0 }], 0, 0));
const output = csv([["含逗号,引号\"", "=2+2", "正常中文"]]);
assert.ok(output.startsWith("\uFEFF")); assert.ok(output.includes('"含逗号,引号"""')); assert.ok(output.includes("'=2+2"));

const captions = videoClips.map(clip => clip.caption), plan = videoPlan(18, true, captions);
assert.equal(plan.duration, 18); assert.equal(plan.clips[0].id, "agents"); assert.equal(plan.captions[0], captions[1]);
assert.throws(() => videoPlan(13, false, captions)); assert.throws(() => videoPlan(12, false, ["", ...captions.slice(1)])); assert.throws(() => videoPlan(12, false, ["字".repeat(27), ...captions.slice(1)]));
assert.ok(subtitles(plan).includes("00:00:06,000 --> 00:00:12,000"));
const sales = aggregateSales(demoSalesSheets, "store");
assert.equal(sales.inputRows, 11); assert.equal(sales.rows.length, 8); assert.equal(sales.issues.length, 3); assert.equal(sales.totalCents, 530300);
assert.equal(sales.summary.find(row => row.name === "门店A").amountCents, 231500);
assert.equal(aggregateSales(demoSalesSheets, "product").summary.find(row => row.name === "保温杯").amountCents, 306900);
assert.equal(aggregateSales(demoSalesSheets, "store", false).totalCents, 593500);
assert.ok(sales.rows.every(row => row.source.includes("第")));
assert.throws(() => aggregateSales([{ fileName: "缺列.xlsx", sheetName: "Sheet1", rows: [["订单号"], ["A1"]] }], "store"));
const actualSheets = [];
for (const [index, key] of ["a", "b", "c"].entries()) {
  const input = new ExcelJS.Workbook();
  await input.xlsx.readFile(new URL("../public/company/spreadsheets/store-" + key + ".xlsx", import.meta.url).pathname);
  const worksheet = input.worksheets[0], rows = [];
  worksheet.eachRow(row => rows.push([1,2,3,4,5].map(column => row.getCell(column).value ?? "")));
  actualSheets.push({ fileName: demoSalesSheets[index].fileName, sheetName: worksheet.name, rows });
}
assert.equal(aggregateSales(actualSheets, "store").totalCents, 530300, "Actual XLSX files must produce the displayed total");
const blob = await salesWorkbook(sales, "测试助理");
assert.ok(blob.size > 3000);
const outputWorkbook = new ExcelJS.Workbook();
await outputWorkbook.xlsx.load(await blob.arrayBuffer());
assert.deepEqual(outputWorkbook.worksheets.map(sheet => sheet.name), ["经营汇总", "异常清单", "明细与来源", "运行说明"]);
assert.equal(outputWorkbook.getWorksheet("经营汇总").getCell("D5").value, 5303);
assert.equal(outputWorkbook.getWorksheet("异常清单").rowCount, 4);
assert.equal(outputWorkbook.getWorksheet("明细与来源").rowCount, 9);
assert.ok(outputWorkbook.getWorksheet("运行说明").getCell("B2").value === "测试助理");
console.log("PASS: money/evidence, stock stress/MOQ, safe CSV, HTML editing plans/SRT, XLSX input parsing, 5303 total and four-sheet report roundtrip.");
