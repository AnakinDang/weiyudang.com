import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const siteI18nPath = fileURLToPath(new URL("../lib/site-i18n.ts", import.meta.url));
const siteI18n = readFileSync(siteI18nPath, "utf8");
const sourceFile = ts.createSourceFile(siteI18nPath, siteI18n, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
const scannedPublicComponentPaths = [
  "../components/LiveNotesFeed.tsx",
  "../components/ProjectArchive.tsx",
  "../components/LabNotesBrowser.tsx"
];

const requiredPublicSiteCopy = {
  home: [
    "One operating system. Four clear surfaces.",
    "Four clear Personal OS surfaces",
    "Selected systems",
    "Selected project artifacts",
    "Selected work public safety boundaries",
    "Safe to browse. Curated and sanitized.",
    "High-level overview only. Internals stay private.",
    "For research and learning. Not for execution.",
    "No prompts, accounts, orders, IDs, or paths.",
    "research feed",
    "drafting",
    "annotating",
    "connecting",
    "publishing",
    "Open notes",
    "Notes, projects, or a focused conversation."
  ],
  projects: [
    "Projects as artifacts.",
    "Browse the archive",
    "Public by design",
    "Projects content model",
    "Search projects",
    "Selected artifact"
  ],
  tradingProject: [
    "MiniDora Trading Research",
    "A public-safe window into the research desks behind Trading MiniDora: questions, evidence, desk disagreement, replay, and owner review. It explains how thinking forms without turning the site into a trading terminal.",
    "Open read-only console",
    "Trading research disclaimer",
    "Trading research console summary",
    "Public trading research workflow preview",
    "Market context enters as research, not a trade idea.",
    "Packets name proof, blockers, and counter-evidence.",
    "Desks, method, evidence shapes, sample blockers.",
    "Evidence packets, replay, gates, source health.",
    "Accounts, orders, broker writes, private signals.",
    "Research desk, not trading terminal",
    "Public page can show",
    "Private console preview",
    "Open read-only dashboard"
  ],
  research: [
    "Research notes.",
    "Read the latest note",
    "Research protocol",
    "Public Research",
    "Private Vault",
    "Research model",
    "Search notes"
  ],
  journal: [
    "Field notes from life outside the lab.",
    "Photography, everyday observations, places, and personal fragments. A softer shelf beside the technical work.",
    "Photography Walks",
    "Life Outside the Lab",
    "Field Observations",
    "Read entry"
  ],
  contact: [
    "Start with a focused note.",
    "AI agent systems",
    "Use the domain mailbox once it is configured in Cloudflare or your preferred mail provider.",
    "Public contact should stay separate from private command, trading, and credential systems.",
    "Ask Doraemon about public projects"
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

const missing = Object.entries(requiredPublicSiteCopy).flatMap(([surface, values]) =>
  values.filter((value) => !hasUsableTranslationEntry(value)).map((value) => `${surface}: ${value}`)
);

function publicComponentSourceFile(relativePath) {
  const path = fileURLToPath(new URL(relativePath, import.meta.url));
  const source = readFileSync(path, "utf8");
  return {
    path,
    sourceFile: ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  };
}

function readLiteralLocalizationCalls() {
  const values = [];

  for (const file of scannedPublicComponentPaths.map(publicComponentSourceFile)) {
    function visit(node) {
      if (ts.isCallExpression(node)) {
        const callee = node.expression;
        const firstArg = node.arguments[0];
        const isLocalTranslator =
          (ts.isIdentifier(callee) && callee.text === "t") ||
          (ts.isIdentifier(callee) && callee.text === "localizeSiteText");

        if (isLocalTranslator && firstArg) {
          const literal = stringValue(firstArg);
          if (literal) {
            values.push(`${file.path}: ${literal}`);
          }
        }
      }

      ts.forEachChild(node, visit);
    }

    visit(file.sourceFile);
  }

  return values;
}

const missingLiteralCalls = readLiteralLocalizationCalls()
  .map((item) => {
    const separator = item.indexOf(": ");
    return {
      label: item,
      value: item.slice(separator + 2)
    };
  })
  .filter((item) => !hasUsableTranslationEntry(item.value))
  .map((item) => item.label);

const duplicates = [
  ...exact.duplicates.map((key) => `exactZhTranslations: ${key}`),
  ...phrase.duplicates.map((key) => `phraseZhTranslations: ${key}`)
];

if (missing.length > 0 || missingLiteralCalls.length > 0 || duplicates.length > 0) {
  console.error("Public site i18n check failed.");
}

if (missing.length > 0) {
  console.error("Missing or empty translations:");
  for (const item of missing) {
    console.error(`- ${item}`);
  }
}

if (missingLiteralCalls.length > 0) {
  console.error("Literal localization calls without translations:");
  for (const item of missingLiteralCalls) {
    console.error(`- ${item}`);
  }
}

if (duplicates.length > 0) {
  console.error("Duplicate translation keys:");
  for (const item of duplicates) {
    console.error(`- ${item}`);
  }
}

if (missing.length > 0 || missingLiteralCalls.length > 0 || duplicates.length > 0) {
  process.exit(1);
}

console.log(
  `Public site i18n check passed (${Object.values(requiredPublicSiteCopy).flat().length} critical strings).`
);
