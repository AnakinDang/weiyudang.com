# Claude Frontend Handoff

Status: active handoff
Date: 2026-06-28
Audience: Claude Code or another frontend implementation agent
Repository: `/Users/doraemon/weiyudang.com`

This document is the practical handoff for continuing the Weiyu Personal OS
frontend after the current Codex slice. It does not replace the product docs in
this folder. It tells the next implementation agent what is already shipped,
what must not regress, and which frontend slices to take next.

## 1. Current Frontend Baseline

As of this handoff refresh, the local frontend baseline is the latest synced
`origin/main`.

- Latest synced commit: `2a976f9` -
  `Keep the active office route visible on the mobile route rail (#154)`
- Latest reviewed PR before this bilingual slice:
  `https://github.com/AnakinDang/weiyudang.com/pull/154`
- Production alias to verify after every merge: `https://weiyudang.com`

The key shipped safety slice to preserve:

- Added `lib/dora-public-client.ts` as the browser-safe runtime and client event
  view module.
- Marked `lib/dora-office.ts` as `server-only`.
- Projected full server-side `PublicDoraEvent` values into
  `PublicDoraEventClientView` before crossing RSC/client boundaries.
- Extended `scripts/check-private-boundaries.mjs` so `"use client"` files cannot
  runtime import `@/lib/dora-office`.
- Verified local and production bundles do not contain `browser_check`,
  `tool_name`, raw ID keys, or raw relay counters on public Doraemon routes.

## 2. Mandatory Read Order

Read these before changing UI:

1. `docs/personal-os/README.md`
2. `docs/personal-os/01_PRODUCT_BLUEPRINT.md`
3. `docs/personal-os/02_INFORMATION_ARCHITECTURE.md`
4. `docs/personal-os/03_DORA_ENTRY_SPEC.md`
5. `docs/personal-os/04_DORA_OFFICE_DASHBOARD_SPEC.md`
6. `docs/personal-os/06_DESIGN_SYSTEM_BRIEF.md`
7. `docs/personal-os/07_PUBLIC_PRIVATE_DATA_CONTRACT.md`
8. `docs/personal-os/08_IMPLEMENTATION_READINESS_CHECKLIST.md`
9. `docs/personal-os/09_AUTH_AND_SESSION.md`
10. `docs/personal-os/10_CONTENT_MODEL.md`
11. This handoff.

Use implementation files only after the product direction is clear. The docs are
the source of truth; existing code is the current implementation state.

## 3. Product Direction to Preserve

The site is not a normal personal homepage. It is a public front door to Weiyu's
Personal OS:

```text
premium personal site
+ Doraemon entry
+ public Doraemon Office
+ MiniDora agent team
+ private owner cockpit
+ research-only trading cockpit
```

The desired visual feel is closer to Apple-level product storytelling:

- high-end, minimal, spacious, exacting
- alive through motion and depth, not static cards
- warm and personal rather than generic SaaS
- public enough to understand, private enough to trust
- Doraemon as an entrance personality and operating metaphor, not a decorative
  sticker

For Doraemon pages, the target is a luminous white/blue command-room language:

- large first-viewport signal: "Doraemon Office"
- glassy dimensional doorway or office scene
- MiniDoras arranged as a visible team with roles and states
- public live/demo activity strip
- strict public/private boundary explanations
- no raw internals in copy or data

Use generated or real bitmap assets when a hero scene needs depth. Avoid a pure
CSS mock if the page is supposed to feel like a product launch-quality hero.

## 4. Non-Negotiable Boundaries

Public routes are display-only and sanitized by default.

Never expose on public routes or public bundles:

- raw run IDs, task IDs, agent IDs, session IDs, account IDs
- task titles, prompts, private notes, owner commands
- local paths such as `/Users/...`
- credentials, tokens, API keys, cookies, private endpoint names
- trading account data, orders, positions, executions, broker controls
- mutation controls such as approve, retry, restart, deploy, purge, send, submit

Doraemon public event rules:

- Client components must use `PublicDoraEventClientView`.
- Client values must come from `lib/dora-public-client.ts` or other explicitly
  browser-safe modules.
- Do not runtime import `@/lib/dora-office` from a `"use client"` file.
- Type-only imports from `@/lib/dora-office` are acceptable only when they are
  erased from the client bundle.
- Keep `lib/dora-office.ts` server-only.
- Run `npm run check:private-boundaries` after every relevant change.

Trading Team rules:

- Always include the fixed disclaimer when relevant:
  `Research-only. Not an order, recommendation, or execution system.`
- Do not add order buttons, broker writes, paper-submit, live-submit, or
  automatic phase promotion.
- Evidence, uncertainty, source freshness, and missing data states are first
  class UI objects.

Public wording rules:

- Do not say "Live", "Updated just now", or imply owner actions unless the data
  is truly live and safe.
- Public demo fallback copy must be honest.
- Prefer "public-safe", "read-only", "demo fallback", "research-only", and
  "owner-only" badges over vague assurances.

Bilingual surface rules:

- Public routes stay statically rendered in English by default. Do not add
  `cookies()` or request-time locale reads to the root layout unless you are
  intentionally accepting dynamic public routes.
- The language bootstrap may set `html[data-i18n-pending="zh"]` before the
  client provider mounts. `body[data-i18n-root]` is temporarily hidden to avoid
  an English flash on Chinese cold loads, and the provider must remove that flag
  after the first locale application. Keep the 1500ms fallback ceiling so a
  JavaScript failure does not leave the page invisible.
- Keep the translation observer scoped to `[data-i18n-root]`, preserve the
  `[data-i18n-skip]` escape hatch, and avoid widening the observer to the whole
  document without a performance review.

## 5. Recommended Next Frontend Slices

Take one coherent slice at a time. Finish verification and independent review
before starting the next slice.

### Slice A - Doraemon Entry High-Fidelity Hero

Primary route: `/dora`

Goal:

- Make `/dora` match the intended premium Doraemon Office entry, closer to the
  user's reference image: Apple-like white space, blue glass, dimensional office
  portal, MiniDora orbit/team presence, public activity preview, and clear
  boundary story.

Implementation notes:

- Inspect current `app/dora/page.tsx`, `components/DoraOffice*`, and
  `app/globals.css` before editing.
- Reuse existing `DoraemonMark`, MiniDora roles, office route map, and
  public-safe event projection.
- Generate or add a replaceable hero asset if needed. Keep source/raw asset
  management private and takedown-friendly.
- Keep the first viewport strong, but leave a hint of the next section visible.
- Add subtle motion that feels alive; respect reduced-motion preferences.
- Avoid nested cards and generic SaaS feature grids.

Acceptance:

- `/dora` immediately reads as Doraemon Office / Personal OS entry.
- The page has a premium, minimal, alive visual quality.
- Mobile 390px and desktop 1440px have no overlaps or horizontal scroll.
- CTA routing to `/dora/office`, `/dora/team`, and project context works.
- Public/private boundary copy remains safe.

### Slice B - Public Homepage Product Showroom Polish

Primary route: `/`

Goal:

- Align the public homepage with the same Apple-like product quality: quiet,
  premium, personal, alive, with clear bridges into Doraemon, research, writing,
  and projects.

Implementation notes:

- Preserve site identity and content model.
- Use motion sparingly: atmospheric, responsive, and purposeful.
- Do not let the homepage become a generic landing page or resume page.
- The Doraemon entry should feel like a flagship product path, not a side link.

Acceptance:

- First viewport explains who Weiyu is and what the Personal OS is becoming.
- The Doraemon path is prominent and coherent.
- Public research/project content remains easy to scan.
- Motion does not hurt readability or mobile performance.

### Slice C - Doraemon Office Dashboard Visual Upgrade

Primary routes:

- `/dora/office`
- `/dora/activity`
- `/dora/team`
- `/dora/tasks`
- `/dora/schedules`
- `/dora/system`

Goal:

- Make the native dashboard feel like a coherent public command room rather than
  several adjacent pages.

Implementation notes:

- Keep the public client event contract from PR #149 intact.
- Use `lib/dora-public-client.ts` for browser-safe values.
- Do not weaken `server-only` on `lib/dora-office.ts`.
- Keep compact route navigation usable on narrow screens.
- Preserve live/demo fallback behavior for `/dora/office`.

Acceptance:

- Office routes share one visual grammar.
- Activity timeline remains newest-by-created-at.
- Team Agents shows role, state, and recent public activity.
- Tasks and Schedules keep fixed public labels and opaque IDs.
- System page avoids internal hostnames, ports, raw counters, and control words.

### Slice D - Public Content Surfaces

Primary routes:

- `/projects`
- `/projects/[slug]`
- `/lab`
- `/lab/[slug]`
- `/journal`
- `/about`

Goal:

- Make public writing, research, and project content feel like a thoughtful
  research studio connected to the Personal OS.

Implementation notes:

- Follow `10_CONTENT_MODEL.md`.
- Use curated public summaries; do not pull raw private knowledge vault content.
- Trading-related public content must be methodology/sample/evidence focused and
  research-only.

Acceptance:

- Public taxonomy is consistent.
- Project pages explain context, evidence, and next questions.
- Metadata is public-safe.

### Slice E - Private Owner Cockpit and Trading Research Cockpit

Primary routes:

- `/app/*`
- `/app/trading`

Goal:

- Continue the private app toward a calm owner cockpit and research-only trading
  evidence console.

Implementation notes:

- Follow `09_AUTH_AND_SESSION.md`.
- Unauthenticated `/app/*` must redirect to `/login?next=...`.
- No private shell content should render before auth.
- Trading remains research-only and evidence-first.

Acceptance:

- Auth gate survives route smoke.
- No public route imports private data sources.
- No trading execution path exists.

## 6. Required Workflow Per Slice

Use this exact loop:

1. Start from clean `main`.
2. Create a focused branch, for example `claude/dora-entry-fidelity`.
3. Read the relevant docs and current implementation files.
4. Implement one coherent slice.
5. Run local validation.
6. Get an independent review before PR merge.
   - If Claude Code implemented the slice, ask Codex or a separate reviewer to
     review the diff.
   - Review should classify findings as P1/P2/P3.
   - Fix P1 and P2 before merging.
7. Open PR with validation evidence.
8. Merge only after checks pass.
9. Deploy production.
10. Verify production by direct domain, not only by deployment success.

Do not move to the next slice just because the page looks good locally.

## 7. Local Validation Commands

Run at minimum:

```bash
cd /Users/doraemon/weiyudang.com
git status --short --branch
npm run check:private-boundaries
npm run build
git diff --check
```

Public route smoke:

```bash
for path in / /dora /dora/office /dora/activity /dora/tasks /dora/schedules /dora/system /dora/team; do
  code=$(/usr/bin/curl -sS -o /dev/null -w '%{http_code}' "http://127.0.0.1:PORT$path")
  printf '%s %s\n' "$path" "$code"
done
```

Private gate smoke:

```bash
for path in /app /app/trading; do
  /usr/bin/curl -sS -o /dev/null -w "$path %{http_code} %{redirect_url}\n" "http://127.0.0.1:PORT$path"
done
```

Leak probes for touched public Doraemon routes:

```bash
/opt/homebrew/bin/rg -l 'browser_check|tool_name' .next/static .next/server/app/dora -g '*' || true
/opt/homebrew/bin/rg -o 'browser_check|tool_name|"run_id"|"task_id"|"payload"|"agent_id"|[0-9]+ buffered|[0-9]+ seen' .next/static .next/server/app/dora -g '*' | sort | uniq -c || true
```

Browser QA:

- Check desktop around `1440x1000`.
- Check mobile around `390x900`.
- Check console errors and warnings.
- Check horizontal overflow.
- Check text overlap.
- Check that active navigation and CTA routes work.

## 8. Production Verification

After merge and deploy:

- Confirm Vercel build ran `npm run build`.
- Record deployment ID and URL.
- Verify `https://weiyudang.com` directly.
- Re-run route smoke against production.
- Re-run public HTML and bundle leak probes against production.
- For Doraemon pages, verify hydrated DOM and console in browser.

Minimum production evidence to include in the PR or final handoff:

```text
commit:
PR:
deployment:
public routes:
private gate:
bundle leak scan:
browser QA:
review result:
```

## 9. PR Body Template

```md
## Summary

- ...
- ...

## Product Intent

- Which Personal OS layer this changes.
- Which doc/spec this implements.

## Public/Private Boundary

- Public data used:
- Private data not exposed:
- Auth behavior touched or not touched:

## Validation

- npm run build
- npm run check:private-boundaries
- Route smoke
- HTML/bundle leak scan
- Browser QA
- Independent review result
```

## 10. Stop Conditions

Stop and ask the owner before proceeding if:

- A requested UI requires private raw data on a public route.
- A public route needs owner actions or mutation controls.
- Trading UI starts implying execution, recommendation, or broker integration.
- Generated/official Doraemon asset handling would require committing a raw
  source asset library to the public repo.
- Local browser QA cannot run and the issue cannot be proven by build/curl
  evidence alone.
- The working tree contains unrelated user changes.

## 11. What Good Looks Like

The next frontend work is successful when:

- The site feels like a premium personal operating system, not a template.
- Doraemon Office feels like a native product surface inside `weiyudang.com`.
- MiniDoras feel like a real team with state and evidence.
- Public visitors understand the system without seeing private work.
- Weiyu has a private path for actual operation.
- The safety boundary remains boringly strong.
