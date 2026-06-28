import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";

const root = process.cwd();
const sourceRoots = ["app", "components", "lib"];
const sourceExtensions = new Set([".js", ".jsx", ".mjs", ".cjs", ".ts", ".tsx"]);
const ignoredDirectories = new Set([".next", ".git", "node_modules", "output"]);

const importSpecifierPattern =
  /(?:from\s+["']([^"']+)["']|import\s*\(\s*["']([^"']+)["']|require\s*\(\s*["']([^"']+)["'])/g;
const leadingCommentsPattern = /^\s*(?:(?:\/\/[^\n]*|\/\*[\s\S]*?\*\/)\s*)*/;
const clientDirectivePattern = /^["']use client["']\s*;?/;
const doraOfficeRuntimeImportPattern =
  /import\s+(?!type\b)[^;]*\s+from\s+["']@\/lib\/dora-office["']\s*;?|import\s*\(\s*["']@\/lib\/dora-office["']\s*\)|require\s*\(\s*["']@\/lib\/dora-office["']\s*\)/g;
const fullPublicDoraEventTypePattern = /\bPublicDoraEvent\b/;
const publicToolNamePattern = /\btool_name\b/;
const fixedTradingDisclaimerPattern = /<strong\s+data-i18n-skip>\s*\{\s*data\.disclaimer\s*\}\s*<\/strong>/;

// These scan source tokens, not rendered copy, so labels such as "No-go actions"
// remain valid while actual JSX/Router/form affordances stay blocked.
const settingsMutationPatterns = [
  /<button\b/i,
  /<form\b/i,
  /\bonClick\s*=/,
  /\bformAction\s*=/,
  /\baction\s*=/,
  /\bhref\s*=/,
  /\buseRouter\b/,
  /\brouter\./,
  /\bexport\s+const\s+metadata\b/,
  /\bexport\s+(?:async\s+)?function\s+generateMetadata\b/
];

function toPosix(path) {
  return path.split(sep).join("/");
}

function extensionFor(filePath) {
  const match = filePath.match(/\.[^.]+$/);
  return match ? match[0] : "";
}

function listSourceFiles(directory) {
  const entries = [];

  for (const name of readdirSync(directory)) {
    if (ignoredDirectories.has(name)) {
      continue;
    }

    const fullPath = join(directory, name);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      entries.push(...listSourceFiles(fullPath));
      continue;
    }

    if (stats.isFile() && sourceExtensions.has(extensionFor(fullPath))) {
      entries.push(fullPath);
    }
  }

  return entries;
}

function lineNumberFor(source, index) {
  return source.slice(0, index).split("\n").length;
}

function hasClientDirective(source) {
  const withoutBom = source.replace(/^\uFEFF/, "");
  const leadingCommentsMatch = withoutBom.match(leadingCommentsPattern);
  const directiveStart = leadingCommentsMatch?.[0].length ?? 0;

  return clientDirectivePattern.test(withoutBom.slice(directiveStart));
}

function privateImportTarget(file, specifier) {
  if (specifier === "@/lib/private" || specifier.startsWith("@/lib/private/")) {
    return specifier;
  }

  if (!specifier.startsWith(".")) {
    return null;
  }

  const absoluteTarget = resolve(dirname(file), specifier);
  const relativeTarget = toPosix(relative(root, absoluteTarget));
  if (relativeTarget === "lib/private" || relativeTarget.startsWith("lib/private/")) {
    return specifier;
  }

  return null;
}

const files = sourceRoots.flatMap((sourceRoot) => listSourceFiles(join(root, sourceRoot)));
const violations = [];

for (const file of files) {
  const relativePath = toPosix(relative(root, file));
  const source = readFileSync(file, "utf8");

  if (!relativePath.startsWith("app/app/") && !relativePath.startsWith("lib/private/")) {
    importSpecifierPattern.lastIndex = 0;
    for (const match of source.matchAll(importSpecifierPattern)) {
      const specifier = match[1] ?? match[2] ?? match[3] ?? "";
      const privateTarget = privateImportTarget(file, specifier);
      if (!privateTarget) {
        continue;
      }

      violations.push(
        `${relativePath}:${lineNumberFor(source, match.index ?? 0)} imports ${privateTarget} outside app/app/**`
      );
    }
  }

  if (relativePath === "app/app/settings/page.tsx") {
    for (const pattern of settingsMutationPatterns) {
      const match = source.match(pattern);
      if (match?.index !== undefined) {
        violations.push(`${relativePath}:${lineNumberFor(source, match.index)} matches forbidden settings mutation pattern ${pattern}`);
      }
    }
  }

  if (hasClientDirective(source)) {
    doraOfficeRuntimeImportPattern.lastIndex = 0;
    for (const match of source.matchAll(doraOfficeRuntimeImportPattern)) {
      violations.push(
        `${relativePath}:${lineNumberFor(source, match.index ?? 0)} imports @/lib/dora-office at runtime inside a client component; use @/lib/dora-public-client for browser-safe values and import type for server-only shapes`
      );
    }

    const fullEventTypeMatch = source.match(fullPublicDoraEventTypePattern);
    if (fullEventTypeMatch?.index !== undefined) {
      violations.push(
        `${relativePath}:${lineNumberFor(source, fullEventTypeMatch.index)} uses full PublicDoraEvent inside a client component; use PublicDoraEventClientView instead`
      );
    }

    const toolNameMatch = source.match(publicToolNamePattern);
    if (toolNameMatch?.index !== undefined) {
      violations.push(
        `${relativePath}:${lineNumberFor(source, toolNameMatch.index)} references tool_name inside a client component; project to fixed public labels before crossing the client boundary`
      );
    }
  }
}

const tradingCockpitSource = readFileSync(join(root, "components/TradingResearchCockpit.tsx"), "utf8");
if (!fixedTradingDisclaimerPattern.test(tradingCockpitSource)) {
  violations.push(
    "components/TradingResearchCockpit.tsx must render the fixed trading disclaimer with data-i18n-skip so the English compliance sentence stays exact across locales"
  );
}

if (violations.length > 0) {
  console.error("Private boundary check failed:");
  for (const violation of violations) {
    console.error(`- ${violation}`);
  }
  process.exit(1);
}

console.log("Private boundary check passed.");
