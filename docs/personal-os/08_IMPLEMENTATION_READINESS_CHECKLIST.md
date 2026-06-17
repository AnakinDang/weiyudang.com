# Implementation Readiness Checklist

Status: v0.1
Date: 2026-06-13

Use this checklist before starting major implementation work on the redesign and
again before merging each related PR.

## 1. Product Scope

- [ ] The target surface is named: public site, Doraemon Entry, Doraemon Office, Owner Cockpit, or Trading Team.
- [ ] The user/audience is clear.
- [ ] The page has a single primary job.
- [ ] Public/private boundary is written before implementation begins.
- [ ] The work does not silently introduce execution capability.

## 2. Route and Navigation

- [ ] Route path is defined.
- [ ] Desktop navigation path is defined.
- [ ] Mobile/narrow navigation path is defined.
- [ ] No page becomes unreachable when sidebar or rail collapses.
- [ ] Back/forward route behavior is expected and tested.
- [ ] Unknown route has a safe fallback.

## 3. Data Source

- [ ] Data mode is explicit: static, demo, live public relay, or private authenticated source.
- [ ] Public fields follow [Public/Private Data Contract](07_PUBLIC_PRIVATE_DATA_CONTRACT.md).
- [ ] Private fields require owner authentication.
- [ ] Loading, empty, stale, degraded, and error states are designed.
- [ ] Live failure has a fallback when appropriate.

## 4. Auth and Permissions

- [ ] Public route does not require private token.
- [ ] Private route requires owner authentication.
- [ ] `/app/*` behavior follows [Auth and Session Spec](09_AUTH_AND_SESSION.md).
- [ ] Unauthenticated users do not receive private app shell content.
- [ ] Private API requests check auth server-side.
- [ ] Owner session token/cookie is not readable by browser JavaScript.
- [ ] UI does not show unavailable or unauthorized controls.
- [ ] No secret is rendered in the browser.
- [ ] No private API endpoint is callable from public unauthenticated UI.

## 5. Public Content Pages

- [ ] Projects, Lab, Journal, About, and public agent profiles follow [Content Model](10_CONTENT_MODEL.md).
- [ ] Required content fields are present.
- [ ] `visibility` is set intentionally.
- [ ] Draft/unlisted/public behavior is verified.
- [ ] Canonical project taxonomy is used.
- [ ] Public metadata is safe and does not expose private system names.
- [ ] Trading-related content includes the research-only disclaimer.
- [ ] Private Knowledge Vault raw files are not used directly as public page sources.

## 6. Doraemon and Asset Policy

- [ ] Official Doraemon assets are used only under the current owner decision.
- [ ] Raw/source asset libraries remain private.
- [ ] Public build ships only required runtime assets.
- [ ] Asset references are centralized enough to replace later.
- [ ] No public source repository becomes a raw asset library.

## 7. UI Quality

- [ ] First viewport communicates the page's purpose.
- [ ] Text does not overlap on mobile or desktop.
- [ ] Cards are not nested inside other cards.
- [ ] Dashboard text is compact and readable.
- [ ] Status is not conveyed by color alone.
- [ ] Buttons, tabs, filters, menus, and controls work when shown.
- [ ] Empty states explain what is missing without exposing internals.

## 8. Doraemon Office Checks

- [ ] Overview stage renders and can remount after navigation.
- [ ] Activity timeline sorts by event creation time, newest first.
- [ ] Team Agents shows role, state, and recent activity.
- [ ] Tasks use fixed public titles and opaque IDs.
- [ ] Schedules do not expose command strings or local paths.
- [ ] System page avoids internal hostnames, tokens, ports, and filesystem paths.
- [ ] Public state labels are stable and safe.
- [ ] Routes use the canonical `/dora/*` route map.
- [ ] `dora.weiyudang.com` / `relay.weiyudang.com` bridge behavior is preserved when touched.

## 9. Trading Team Checks

- [ ] The fixed research-only disclaimer is present.
- [ ] No order button or submit path exists.
- [ ] No broker write, paper submit, live submit, or phase auto-promotion path exists.
- [ ] Signals link to evidence or clearly show missing evidence.
- [ ] Source degradation is visible.
- [ ] Public version uses methodology/sample data only.

## 10. Security and Data Leak Checks

- [ ] Probe strings are tested: `/Users/`, `secret`, `session_key`, raw IDs, `../`.
- [ ] Public responses contain only allowlisted fields.
- [ ] Public Doraemon Office event fields match the closed schema in [Public/Private Data Contract](07_PUBLIC_PRIVATE_DATA_CONTRACT.md).
- [ ] Public IDs are opaque and idempotently rehashed at the public boundary.
- [ ] `visual` is rebuilt from allowlisted fields, not passed through.
- [ ] `tool_name` follows public shape validation.
- [ ] Registry values enforce `color`, `motion_profile`, and `asset_profile` value rules.
- [ ] Public push body caps and registry/scenes body caps are preserved.
- [ ] Public WebSocket remains read-only and drops client messages.
- [ ] Public relay deduplicates events by public `event_id`.
- [ ] Public viewer cap is preserved or deliberately changed with review.
- [ ] Unknown upstream fields are dropped by default.
- [ ] Public bundle does not contain private strings.
- [ ] Browser console has no runtime error on malformed public state.

## 11. Browser QA

Check at minimum:

- [ ] Mobile narrow viewport around 375-390px.
- [ ] Tablet/narrow desktop around 900-1120px.
- [ ] Desktop around 1440px.
- [ ] Public homepage.
- [ ] `/dora`.
- [ ] Doraemon Office overview/activity/team.
- [ ] Private `/app` gate.
- [ ] Trading page or mock when touched.

## 12. Build and Test

- [ ] Typecheck passes.
- [ ] Unit tests pass if relevant.
- [ ] Production build succeeds.
- [ ] No unrelated tracked file was changed.
- [ ] Existing user changes are preserved.

## 13. Deployment Verification

- [ ] Deployment command fails hard on build failure.
- [ ] Use `set -o pipefail` when piping build output.
- [ ] Verify the deployed bundle contains the expected new route/component strings.
- [ ] Verify the deployed page directly by domain.
- [ ] Verify live/demo fallback after deployment when Doraemon Office is touched.
- [ ] Record which production bundle or deployment ID was verified.

## 14. Documentation Update

- [ ] Update the relevant doc in `docs/personal-os/` when changing product behavior.
- [ ] Link implementation-specific details to the correct specialized repo instead of duplicating them.
- [ ] If a safety boundary changes, update [Public/Private Data Contract](07_PUBLIC_PRIVATE_DATA_CONTRACT.md).
- [ ] If navigation changes, update [Information Architecture](02_INFORMATION_ARCHITECTURE.md).
- [ ] If private auth behavior changes, update [Auth and Session Spec](09_AUTH_AND_SESSION.md).
- [ ] If public content schema changes, update [Content Model](10_CONTENT_MODEL.md).

## Merge Gate

Do not merge a major redesign PR until these are true:

- [ ] The product surface matches this doc package or the docs were updated.
- [ ] Public/private data boundary is verified.
- [ ] Mobile navigation is not broken.
- [ ] Production build was checked.
- [ ] The user-facing experience is coherent, not just technically present.
