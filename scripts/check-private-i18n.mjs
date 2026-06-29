import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";

const ownerSurfaces = [
  {
    name: "today",
    dataFile: "lib/private/owner-cockpit.ts",
    componentFile: "components/OwnerTodaySurface.tsx"
  },
  {
    name: "command",
    dataFile: "lib/private/command.ts",
    componentFile: "components/OwnerCommandSurface.tsx",
    overrideName: "commandZhOverrides"
  },
  {
    name: "events",
    dataFile: "lib/private/events.ts",
    componentFile: "components/OwnerEventsSurface.tsx",
    overrideName: "eventZhOverrides",
    localTemplatePatterns: [/^\$\{[^}]+\} to \$\{[^}]+\}$/, /^\$\{[^}]+\} source posture$/]
  },
  {
    name: "agents",
    dataFile: "lib/agent-ops.ts",
    componentFile: "components/PrivateAgentsSurface.tsx",
    overrideName: "privateAgentZhOverrides",
    localPatterns: [/^Step \d+$/]
  },
  {
    name: "knowledge",
    dataFile: "lib/private/knowledge-vault.ts",
    componentFile: "app/app/knowledge/KnowledgeVaultCockpit.tsx"
  },
  {
    name: "review",
    dataFile: "lib/private/review-queue.ts",
    componentFile: "components/OwnerReviewQueueSurface.tsx",
    overrideName: "reviewQueueZhOverrides"
  },
  {
    name: "schedules",
    dataFile: "lib/private/schedules.ts",
    componentFile: "components/OwnerSchedulesSurface.tsx",
    overrideName: "scheduleZhOverrides"
  },
  {
    name: "settings",
    dataFile: "lib/private/settings.ts",
    componentFile: "components/OwnerSettingsSurface.tsx",
    overrideName: "settingsZhOverrides"
  },
  {
    name: "system",
    dataFile: "lib/private/system.ts",
    componentFile: "components/OwnerSystemHealthSurface.tsx",
    overrideName: "systemZhOverrides"
  },
  {
    name: "trading",
    dataFile: "lib/private/trading-team.ts",
    componentFile: "components/TradingResearchCockpit.tsx"
  }
];

// Update these fingerprints only after manually reviewing the private-data diff that changed
// which owner-only literals rely on global site i18n.
const expectedGlobalI18nFingerprints = {
  today: { count: 111, digest: "ac43eb46ffd863af401d5c1f6a0cf8972a932f9d21fa0319633e8e15380a5ec8" },
  command: { count: 155, digest: "f0ac9ea8e148d7a55b642eb3cc44c8f78a0d9d9d337e47fcfb80ca3701c9f5c7" },
  events: { count: 4, digest: "71fae926bbe4bb0339a872ce343a4083d7141257b37edad672a5a3594104e500" },
  agents: { count: 242, digest: "c002b859fe34d7ee35e900885bae4e3a7601f8fd3aab7b9131bbdf761e8658ae" },
  knowledge: { count: 168, digest: "7141cd0b2b5e507d3eecf8cd4e73fe2896e7c1889987afd731c1ffd7e1e5b664" },
  review: { count: 199, digest: "f4ed42fc89dcea144c09e90749a920cde6d89bdba5efc5c0a7d988995bdc21db" },
  schedules: { count: 212, digest: "695d15b2d3a83bf1e13b9642251a3385df3298867ba47b1b5443e45ccf19c15d" },
  settings: { count: 113, digest: "3fce46d281fac8e86076ba317136683f77d07fcdda38779c03bca1ff9cc2af23" },
  system: { count: 40, digest: "419670ece9e073d6dbc7d778702e9cc273a9af18a6291af37d8de7665070d3ae" },
  trading: { count: 224, digest: "1e1a5f394e3423c9ab817988af2842e97363f1bf48cdc2fdb5871a66b51b89d4" }
};

const ignoredPrivateDataFiles = new Set(["owner-session.ts"]);
const ignoredLiteralPattern =
  /^(normal|info|warning|private|danger|healthy|watch|blocked|high|medium|low|active|ready|held|planned|open|closed|manual|auto|draft)$/;
const machineTokenPattern = /^[a-z0-9_./?&=#:-]+$/;
const constantTokenPattern = /^[A-Z][A-Z0-9_-]+$/;
const stringLiteralPattern = /"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'|`((?:[^`\\]|\\.)*)`/g;
const verbose = process.argv.includes("--verbose");

function readSource(path) {
  return readFileSync(`${process.cwd()}/${path}`, "utf8");
}

function normalizedLiteral(raw) {
  return raw
    .replace(/\\n/g, " ")
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function hashValue(value) {
  return createHash("sha256").update(value).digest("hex").slice(0, 16);
}

function hashSetDigest(values) {
  return createHash("sha256").update([...values].sort().join("\n")).digest("hex");
}

function isMachineInterpolatedTemplate(value) {
  const tokenized = value.replace(/\$\{[^}]+\}/g, "x");
  return tokenized.startsWith("/") || machineTokenPattern.test(tokenized.toLowerCase());
}

function sourceStringLiterals(source) {
  const values = new Set();
  const dynamicTemplates = new Set();

  for (const match of source.matchAll(stringLiteralPattern)) {
    const raw = match[1] ?? match[2] ?? match[3] ?? "";
    if (!raw || raw.startsWith("@/") || raw === "server-only") {
      continue;
    }

    const value = normalizedLiteral(raw);
    if (value.includes("${")) {
      if (!isMachineInterpolatedTemplate(value)) {
        dynamicTemplates.add(value);
      }
      continue;
    }

    if (!value || value.length < 2) {
      continue;
    }

    if (machineTokenPattern.test(value) || ignoredLiteralPattern.test(value) || constantTokenPattern.test(value)) {
      continue;
    }

    values.add(value);
  }

  return {
    dynamicTemplates: [...dynamicTemplates].sort((left, right) => left.localeCompare(right)),
    literals: [...values].sort((left, right) => left.localeCompare(right))
  };
}

function objectBodyForConst(source, objectName) {
  const declarationPattern = new RegExp(`const\\s+${objectName}[\\s\\S]*?=\\s*\\{`, "m");
  const match = source.match(declarationPattern);
  if (!match || match.index === undefined) {
    return "";
  }

  const openIndex = match.index + match[0].lastIndexOf("{");
  let depth = 0;
  let inString = null;
  let inLineComment = false;
  let inBlockComment = false;

  for (let index = openIndex; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];

    if (inLineComment) {
      if (char === "\n") inLineComment = false;
      continue;
    }

    if (inBlockComment) {
      if (char === "*" && next === "/") {
        inBlockComment = false;
        index += 1;
      }
      continue;
    }

    if (inString) {
      if (char === "\\") {
        index += 1;
        continue;
      }
      if (char === inString) inString = null;
      continue;
    }

    if (char === "/" && next === "/") {
      inLineComment = true;
      index += 1;
      continue;
    }

    if (char === "/" && next === "*") {
      inBlockComment = true;
      index += 1;
      continue;
    }

    if (char === '"' || char === "'" || char === "`") {
      inString = char;
      continue;
    }

    if (char === "{") {
      depth += 1;
      continue;
    }

    if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return source.slice(openIndex + 1, index);
      }
    }
  }

  return "";
}

function keysFromObject(source, objectName) {
  const block = objectBodyForConst(source, objectName);
  if (!block) {
    return new Set();
  }

  const keys = new Set();
  const keyPattern = /(?:^|\n)\s*(?:"([^"]+)"|'([^']+)'|([A-Za-z][A-Za-z0-9 /&.,:;()-]+))\s*:/g;

  for (const match of block.matchAll(keyPattern)) {
    keys.add((match[1] ?? match[2] ?? match[3]).trim());
  }

  return keys;
}

function allTranslationKeys(source) {
  return keysFromObject(source, "exactZhTranslations");
}

const siteI18nKeys = allTranslationKeys(readSource("lib/site-i18n.ts"));
const violations = [];
const summaries = [];
const configuredPrivateDataFiles = new Set(
  ownerSurfaces
    .map((surface) => surface.dataFile)
    .filter((dataFile) => dataFile.startsWith("lib/private/"))
    .map((dataFile) => basename(dataFile))
);
const privateDirectoryEntries = readdirSync(join(process.cwd(), "lib/private"), { withFileTypes: true });
const unmappedPrivateDirectories = privateDirectoryEntries.filter((entry) => entry.isDirectory());
const unmappedPrivateFiles = privateDirectoryEntries
  .filter((entry) => entry.isFile())
  .map((entry) => entry.name)
  .filter((file) => file.endsWith(".ts"))
  .filter((file) => !configuredPrivateDataFiles.has(file) && !ignoredPrivateDataFiles.has(file));

for (const directory of unmappedPrivateDirectories) {
  violations.push({
    kind: "unmapped-private-data-directory",
    directory: directory.name
  });
}

for (const file of unmappedPrivateFiles) {
  violations.push({
    kind: "unmapped-private-data-file",
    file
  });
}

for (const surface of ownerSurfaces) {
  const dataSource = readSource(surface.dataFile);
  const componentSource = readSource(surface.componentFile);
  const localKeys = surface.overrideName
    ? keysFromObject(componentSource, surface.overrideName)
    : new Set();
  const localPatterns = surface.localPatterns ?? [];
  const localTemplatePatterns = surface.localTemplatePatterns ?? [];
  const { dynamicTemplates, literals } = sourceStringLiterals(dataSource);
  const globalHashes = literals
    .filter(
      (literal) =>
        !localPatterns.some((pattern) => pattern.test(literal)) &&
        !localKeys.has(literal) &&
        siteI18nKeys.has(literal)
    )
    .map(hashValue)
    .sort();
  const expectedGlobal = expectedGlobalI18nFingerprints[surface.name];
  const actualGlobalDigest = hashSetDigest(globalHashes);
  const missing = literals.filter(
    (literal) =>
      !localPatterns.some((pattern) => pattern.test(literal)) &&
      !localKeys.has(literal) &&
      !siteI18nKeys.has(literal)
  );
  const unreviewedTemplates = dynamicTemplates.filter(
    (template) => !localTemplatePatterns.some((pattern) => pattern.test(template))
  );

  summaries.push(`${surface.name}:${missing.length}`);

  if (
    !expectedGlobal ||
    expectedGlobal.count !== globalHashes.length ||
    expectedGlobal.digest !== actualGlobalDigest
  ) {
    violations.push({
      actual: { count: globalHashes.length, digest: actualGlobalDigest },
      expected: expectedGlobal,
      kind: "global-i18n-fingerprint",
      surface: surface.name
    });
  }

  if (missing.length > 0) {
    violations.push({
      dataFile: surface.dataFile,
      kind: "missing-translation",
      missing,
      surface: surface.name
    });
  }

  if (unreviewedTemplates.length > 0) {
    violations.push({
      dataFile: surface.dataFile,
      kind: "unreviewed-template",
      surface: surface.name,
      templates: unreviewedTemplates
    });
  }
}

function printValueList(values) {
  for (const value of values) {
    if (verbose) {
      console.error(`  - ${value}`);
      continue;
    }
    console.error(`  - sha256:${hashValue(value)}`);
  }
}

function printViolation(violation) {
  if (violation.kind === "unmapped-private-data-file") {
    console.error(`- unmapped lib/private data file: ${violation.file}`);
    return;
  }

  if (violation.kind === "unmapped-private-data-directory") {
    console.error(`- unmapped lib/private data directory: ${violation.directory}`);
    return;
  }

  if (violation.kind === "global-i18n-fingerprint") {
    console.error(
      `- ${violation.surface} global i18n fingerprint changed: expected count ${violation.expected?.count ?? "none"} digest ${violation.expected?.digest ?? "none"}, actual count ${violation.actual.count} digest ${violation.actual.digest}`
    );
    return;
  }

  if (violation.kind === "missing-translation") {
    console.error(`- ${violation.surface} (${violation.dataFile}) missing ${violation.missing.length} translation(s):`);
    printValueList(violation.missing);
    return;
  }

  if (violation.kind === "unreviewed-template") {
    console.error(`- ${violation.surface} (${violation.dataFile}) has ${violation.templates.length} unreviewed interpolated template(s):`);
    printValueList(violation.templates);
  }
}

if (violations.length > 0) {
  console.error("Private i18n check failed:");
  for (const violation of violations) {
    printViolation(violation);
  }
  if (!verbose) {
    console.error("Run `npm run check:private-i18n -- --verbose` locally to print literal values.");
  }
  process.exit(1);
}

console.log(`Private i18n check passed (${summaries.join(", ")}).`);
