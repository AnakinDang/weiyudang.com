import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";

const root = process.cwd();
const sourceRoots = ["app", "components", "lib"];
const sourceExtensions = new Set([".js", ".jsx", ".mjs", ".cjs", ".ts", ".tsx"]);
const ignoredDirectories = new Set([".next", ".git", "node_modules", "output"]);

const importSpecifierPattern =
  /(?:from\s+["']([^"']+)["']|import\s*\(\s*["']([^"']+)["']|require\s*\(\s*["']([^"']+)["'])/g;

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
}

if (violations.length > 0) {
  console.error("Private boundary check failed:");
  for (const violation of violations) {
    console.error(`- ${violation}`);
  }
  process.exit(1);
}

console.log("Private boundary check passed.");
