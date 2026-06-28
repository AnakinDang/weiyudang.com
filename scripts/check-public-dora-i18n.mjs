import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const siteI18nPath = fileURLToPath(new URL("../lib/site-i18n.ts", import.meta.url));
const siteI18n = readFileSync(siteI18nPath, "utf8");
const sourceFile = ts.createSourceFile(siteI18nPath, siteI18n, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

const requiredPublicDoraCopy = {
  tasks: [
    "Doraemon Tasks",
    "Public task posture without private task content.",
    "Public Task Queue",
    "Filter public queue",
    "Sanitized task groups",
    "Public Task Boundary",
    "No prompts or owner notes",
    "No approve, retry, submit, or execution path",
    "Tasks are one signal in the operating loop"
  ],
  schedules: [
    "Doraemon Schedules",
    "Public operating rhythm without private automation internals.",
    "Public Rhythm Register",
    "Filter public rhythm",
    "Recurring operating windows",
    "Public Schedule Boundary",
    "No private automation",
    "Schedules set the rhythm for the public office",
    "Research schedules remain read-only and cannot change private systems."
  ],
  system: [
    "Doraemon System",
    "Public health signal without private infrastructure.",
    "Public Health Register",
    "Public System Boundary",
    "System health closes the public readiness loop",
    "Private area hidden"
  ]
};

function stringValue(node) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text.trim();
  }

  return null;
}

function variableInitializer(name) {
  let initializer = null;

  function visit(node) {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === name) {
      initializer = node.initializer ?? null;
      return;
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return initializer;
}

function unwrapExpression(expression) {
  let current = expression;

  while (
    current &&
    (ts.isAsExpression(current) || ts.isSatisfiesExpression(current) || ts.isParenthesizedExpression(current))
  ) {
    current = current.expression;
  }

  return current;
}

function readExactTranslations() {
  const initializer = unwrapExpression(variableInitializer("exactZhTranslations"));
  if (!initializer || !ts.isObjectLiteralExpression(initializer)) {
    throw new Error("Could not read exactZhTranslations from lib/site-i18n.ts");
  }

  const translations = new Map();
  const duplicates = new Set();
  for (const property of initializer.properties) {
    if (!ts.isPropertyAssignment(property)) continue;

    const key = stringValue(property.name);
    const value = stringValue(property.initializer);
    if (!key) continue;

    if (translations.has(key)) {
      duplicates.add(key);
    }
    translations.set(key, value ?? "");
  }

  return { duplicates: [...duplicates], translations };
}

function readPhraseTranslations() {
  const expression = unwrapExpression(variableInitializer("phraseZhTranslations"));

  if (!expression || !ts.isArrayLiteralExpression(expression)) {
    throw new Error("Could not read phraseZhTranslations from lib/site-i18n.ts");
  }

  const translations = new Map();
  const duplicates = new Set();
  for (const item of expression.elements) {
    if (!ts.isArrayLiteralExpression(item) || item.elements.length < 2) continue;

    const key = stringValue(item.elements[0]);
    const value = stringValue(item.elements[1]);
    if (!key) continue;

    if (translations.has(key)) {
      duplicates.add(key);
    }
    translations.set(key, value ?? "");
  }

  return { duplicates: [...duplicates], translations };
}

const exact = readExactTranslations();
const phrase = readPhraseTranslations();

function hasUsableTranslationEntry(value) {
  const exactValue = exact.translations.get(value);
  if (exactValue) return true;

  const phraseValue = phrase.translations.get(value);
  return Boolean(phraseValue);
}

const missing = Object.entries(requiredPublicDoraCopy).flatMap(([surface, values]) =>
  values.filter((value) => !hasUsableTranslationEntry(value)).map((value) => `${surface}: ${value}`)
);
const duplicates = [
  ...exact.duplicates.map((key) => `exactZhTranslations: ${key}`),
  ...phrase.duplicates.map((key) => `phraseZhTranslations: ${key}`)
];

if (missing.length > 0 || duplicates.length > 0) {
  console.error("Public Doraemon i18n check failed.");
}

if (missing.length > 0) {
  console.error("Missing or empty translations:");
  for (const item of missing) {
    console.error(`- ${item}`);
  }
}

if (duplicates.length > 0) {
  console.error("Duplicate translation keys:");
  for (const item of duplicates) {
    console.error(`- ${item}`);
  }
}

if (missing.length > 0 || duplicates.length > 0) {
  process.exit(1);
}

console.log(
  `Public Doraemon i18n check passed (${Object.values(requiredPublicDoraCopy).flat().length} critical strings).`
);
