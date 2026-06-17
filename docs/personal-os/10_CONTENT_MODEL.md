# Content Model

Status: v0.1
Date: 2026-06-13

## Purpose

This document defines the public content model for the personal site.

The Personal OS redesign has two kinds of surfaces:

- live/system surfaces such as Dora Office and private `/app/*`
- editorial/content surfaces such as Projects, Lab, Journal, and About

The first kind is governed by data contracts and auth. The second kind needs a
content model so public pages can be implemented consistently.

## Storage Baseline

Current baseline:

- public project content lives under `content/projects`
- journal content lives under `content/journal`
- agent mock/content data may live under `content/agents`
- older notes mention `content/notes`

Recommended v1 convention:

```text
content/
  projects/
  lab/
  journal/
  pages/
  agents-public/
```

Use MDX or typed structured content. Do not use private Knowledge Vault files
directly as public page sources.

## Content Types

### Project

Route:

- `/projects/[slug]`

Purpose:

- explain a durable system, project, prototype, or research line

Required fields:

- `title`
- `slug`
- `summary`
- `status`
- `category`
- `visibility`
- `publishedAt`
- `updatedAt`
- `hero`
- `links`
- `body`

Recommended fields:

- `tags`
- `featured`
- `systems`
- `relatedAgents`
- `safetyBoundary`
- `repoVisibility`

Allowed statuses:

- `concept`
- `prototype`
- `active`
- `paused`
- `archived`

Allowed visibility:

- `public`
- `private-summary`
- `unlisted`
- `draft`

### Lab Note

Route:

- `/lab/[slug]`

Purpose:

- explain experiments, build logs, product thinking, design explorations, and
  system notes

Required fields:

- `title`
- `slug`
- `summary`
- `publishedAt`
- `updatedAt`
- `category`
- `visibility`
- `body`

Recommended fields:

- `tags`
- `relatedProject`
- `artifactLinks`
- `sourceStatus`

Allowed categories:

- `agent-systems`
- `dora-office`
- `trading-research`
- `design`
- `engineering`
- `creative-media`
- `operations`

### Journal Entry

Route:

- `/journal/[slug]`

Purpose:

- personal notes, photography, observations, and essays

Required fields:

- `title`
- `slug`
- `summary`
- `publishedAt`
- `visibility`
- `body`

Recommended fields:

- `location`
- `photos`
- `tags`
- `mood`

Journal should be more human and less operational than Lab.

### Static Page

Routes:

- `/about`
- `/contact`
- selected evergreen pages

Purpose:

- stable public information

Required fields if content-backed:

- `title`
- `slug`
- `updatedAt`
- `body`

### Public Agent Profile

Purpose:

- public-safe MiniDora role descriptions
- used by `/dora`, `/dora/team`, and project pages

Required fields:

- `id`
- `displayName`
- `role`
- `summary`
- `visibility`
- `profileAsset`
- `colorToken`

Disallowed:

- private system prompt
- private capability config
- private tool list
- internal runtime IDs

## Project Taxonomy

Canonical public project categories:

- `personal-ai-systems`
- `agent-infrastructure`
- `research-tools`
- `trading-research`
- `creative-media`
- `games-experiments`
- `writing-field-notes`

Initial key projects:

- `doraemon-agent-system`
- `doraemon-visualizer`
- `minidora-trading`
- `knowledge-vault`
- `openclaw-runtime`
- `weiyu-personal-os`

## Draft and Publish Flow

Recommended flow:

1. Draft in private notes, branch, or local content file.
2. Mark content as `draft`.
3. Review for public/private leakage.
4. Set `visibility: public` or `private-summary`.
5. Build preview.
6. Check generated page and metadata.
7. Publish through normal site deployment.

Rules:

- private vault source text is never auto-published
- private agent logs are never copied directly into content pages
- trading research pages require the research-only disclaimer
- content with private project details uses `private-summary`

## Public Summary Pattern

For private systems, public pages should use the `private-summary` pattern:

- explain what the system is
- explain why it exists
- show public architecture or workflow
- link to public demos if available
- omit private data, raw logs, prompts, and source artifacts

Examples:

- Knowledge Vault can have a public summary page, not raw vault pages.
- MiniDora Trading can have methodology and mock examples, not private signals.
- Doraemon Workspace can explain operating principles, not private memory.

## Metadata and SEO

Each public page should define:

- title
- description
- canonical URL
- open graph title
- open graph description
- optional image

Do not expose private project names or internal labels in metadata.

## Checklist for Content PRs

- [ ] Content type and route are clear.
- [ ] Required fields are present.
- [ ] `visibility` is set intentionally.
- [ ] No private memory, prompt, raw event, account, token, path, or internal hostname is included.
- [ ] Trading-related content includes the research-only disclaimer.
- [ ] Project category uses the canonical taxonomy.
- [ ] Links point to public URLs or clearly private owner routes.
- [ ] Metadata is public-safe.
- [ ] Draft content is not included in production output unless intentionally unlisted.

## Acceptance Criteria

- A developer can add a new project, lab note, or journal entry without
  inventing a schema.
- Public content does not depend on private Knowledge Vault raw files.
- Private systems can be summarized publicly without leaking implementation
  details.
- Content PRs have a checklist comparable to dashboard/data PRs.

