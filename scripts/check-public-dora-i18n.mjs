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
    "Last",
    "Public Schedule Boundary",
    "No private automation",
    "Schedules set the rhythm for the public office",
    "Research schedules remain read-only and cannot change private systems."
  ],
  system: [
    "Doraemon System",
    "Public health signal without private infrastructure.",
    "Public Health Register",
    "Filter public health",
    "Every control filters sanitized health posture only.",
    "The public relay health endpoint responded with an OK posture and safe aggregate counters.",
    "The relay has a sanitized public registry snapshot available.",
    "Freshness is derived from the public event stream without exposing event-rate counters.",
    "Replay and dedupe posture are summarized without publishing raw counter values.",
    "Public health stream",
    "Public schema check",
    "Freshness posture",
    "The page reports a coarse demo-safe snapshot instead of private telemetry.",
    "Dedupe posture",
    "Diagnostics and owner actions stay in authenticated owner surfaces.",
    "Public visitors can see live/demo posture and public schema health.",
    "Private operational detail and owner-only operations stay behind owner access.",
    "Live relay probe",
    "Owner-only operations stay behind authenticated access.",
    "System readiness",
    "Public System Boundary",
    "System health closes the public readiness loop",
    "Private area hidden"
  ],
  office: [
    "Current Focus",
    "Relay is connected; the visible feed keeps the demo-safe snapshot until a public event arrives.",
    "System Heartbeat",
    "Recent public activity",
    "Full-screen bridge"
  ],
  knowledge: [
    "Doraemon Knowledge",
    "Public synthesis without exposing private source material.",
    "Public Synthesis",
    "Curated pages cross the boundary. Source records, drafts, and unreleased reports stay private.",
    "Public Knowledge Register",
    "Curated outputs, visible boundaries, and the publish path from private source material to public-safe pages.",
    "Public Knowledge Vault principles",
    "Public synthesis outputs",
    "Curated destinations that can be read without exposing private source material.",
    "Knowledge boundary",
    "Source privacy",
    "No private querying",
    "No owner context, source records, or unreleased research drafts are rendered.",
    "Vault lanes",
    "Owner review gate",
    "Private source layer",
    "Publication requires explicit owner-approved rewriting before anything reaches public routes.",
    "How private source material becomes public-safe site content."
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
