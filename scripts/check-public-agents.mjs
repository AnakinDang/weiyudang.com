import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const root = process.cwd();
const sourcePath = `${root}/lib/public-agents.ts`;
const source = readFileSync(sourcePath, "utf8");
const maxPublicCollaborators = 8;

function loadPublicAgentsModule() {
  // This intentionally imports the self-contained public registry module only; future imports in lib/public-agents.ts
  // should stay type-only or this lightweight build guard may need a real module loader.
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      target: ts.ScriptTarget.ES2022,
      isolatedModules: true,
      verbatimModuleSyntax: true
    },
    fileName: sourcePath,
    reportDiagnostics: true
  });

  const diagnostics = output.diagnostics ?? [];
  if (diagnostics.length > 0) {
    const messages = diagnostics.map((diagnostic) =>
      ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")
    );
    throw new Error(`Could not transpile lib/public-agents.ts:\n${messages.join("\n")}`);
  }

  const encoded = Buffer.from(`${output.outputText}\n//# sourceURL=${pathToFileURL(sourcePath).href}`).toString("base64");
  return import(`data:text/javascript;base64,${encoded}`);
}

function assert(condition, message, violations) {
  if (!condition) {
    violations.push(message);
  }
}

function countBy(values) {
  const counts = new Map();

  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  return counts;
}

const publicAgentsModule = await loadPublicAgentsModule();
const agents = publicAgentsModule.getPublicAgents();
const violations = [];

assert(Array.isArray(agents) && agents.length > 0, "getPublicAgents() must return public agents.", violations);

const displayNames = new Set(agents.map((agent) => agent.displayName));
const displayNameCounts = countBy(agents.map((agent) => agent.displayName));
const slugCounts = countBy(agents.map((agent) => agent.slug));
const publicIdCounts = countBy(agents.map((agent) => agent.publicId));

for (const agent of agents) {
  assert(agent.visibility === "public", `${agent.displayName} must stay public visibility.`, violations);
  assert(agent.profileAsset.endsWith("-mark"), `${agent.displayName} profileAsset must end with "-mark".`, violations);
  assert(
    /^[a-z0-9-]+$/.test(agent.profileAsset),
    `${agent.displayName} profileAsset must be a lowercase public token.`,
    violations
  );
  assert(
    publicAgentsModule.publicAgentProfileInitial(agent) === agent.stageName.slice(0, 1).toUpperCase(),
    `${agent.displayName} profile initial must match its stageName initial.`,
    violations
  );
  assert(
    agent.collaboratesWith.length <= maxPublicCollaborators,
    `${agent.displayName} has ${agent.collaboratesWith.length} collaborators; keep public profile grids at ${maxPublicCollaborators} or fewer.`,
    violations
  );
  assert(
    !agent.collaboratesWith.includes(agent.displayName),
    `${agent.displayName} must not collaborate with itself.`,
    violations
  );

  for (const collaboratorName of agent.collaboratesWith) {
    assert(
      displayNames.has(collaboratorName),
      `${agent.displayName} collaboratesWith unknown public agent "${collaboratorName}".`,
      violations
    );

    const collaborator = agents.find((candidate) => candidate.displayName === collaboratorName);
    if (!collaborator) {
      continue;
    }

    assert(
      collaborator.collaboratesWith.includes(agent.displayName),
      `${agent.displayName} collaboratesWith ${collaboratorName}, but the relationship is not reciprocal.`,
      violations
    );
  }
}

for (const [displayName, count] of displayNameCounts) {
  assert(count === 1, `Duplicate public agent displayName: ${displayName}`, violations);
}

for (const [slug, count] of slugCounts) {
  assert(count === 1, `Duplicate public agent slug: ${slug}`, violations);
}

for (const [publicId, count] of publicIdCounts) {
  assert(count === 1, `Duplicate public agent publicId: ${publicId}`, violations);
}

if (violations.length > 0) {
  console.error("Public agent check failed:");
  for (const violation of violations) {
    console.error(`- ${violation}`);
  }
  process.exit(1);
}

console.log(`Public agent check passed (${agents.length} agents).`);
