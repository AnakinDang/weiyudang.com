import ExcelJS from "exceljs";
import { mkdir, writeFile } from "node:fs/promises";
import { demoSalesSheets } from "../lib/demo-workflows.ts";
const directory = new URL("../public/company/spreadsheets/", import.meta.url);
await mkdir(directory, { recursive: true });
for (const [index, sheet] of demoSalesSheets.entries()) {
  const workbook = new ExcelJS.Workbook(), worksheet = workbook.addWorksheet(sheet.sheetName);
  worksheet.addRows(sheet.rows);
  worksheet.getRow(1).font = { bold: true };
  worksheet.columns.forEach(column => { column.width = 20; });
  await workbook.xlsx.writeFile(new URL("store-" + ["a", "b", "c"][index] + ".xlsx", directory).pathname);
}
await writeFile(new URL("SOURCE.json", directory), JSON.stringify({ source: "Synthetic retail records authored for this demonstration.", sheets: demoSalesSheets.map(sheet => ({ fileName: sheet.fileName, rows: sheet.rows.length - 1 })), expected: { inputRows: 11, acceptedRows: 8, issues: 3, totalCents: 530300 }, customerData: false }, null, 2) + "\n");
console.log("Created three genuine XLSX samples: 11 rows; 8 accepted, 3 exceptions; CNY5303 total.");
