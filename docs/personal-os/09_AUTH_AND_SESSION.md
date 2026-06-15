# Auth and Session Spec

Status: v0.1
Date: 2026-06-13

## Purpose

This document defines how private Personal OS surfaces are protected.

Product rule:

```text
Public pages explain the system.
Private pages require owner authentication.
Unauthenticated users should not learn private route structure or private state.
```

This spec covers the site-level auth model. It does not design any trading,
agent, email, calendar, file, or execution permission system.

## Route Classes

### Public routes

Examples:

- `/`
- `/about`
- `/projects`
- `/projects/[slug]`
- `/lab`
- `/journal`
- `/contact`
- `/dora`
- `/dora/office`
- `/dora/activity`
- `/dora/team`
- `/dora/tasks`
- `/dora/schedules`
- `/dora/knowledge`
- `/dora/system`

Behavior:

- accessible without auth
- may use static, curated, demo, or public relay data
- must follow [Public/Private Data Contract](07_PUBLIC_PRIVATE_DATA_CONTRACT.md)
- must never call private owner APIs

### Private owner routes

Examples:

- `/app`
- `/app/command`
- `/app/trading`
- `/app/agents`
- `/app/events`
- `/app/schedules`
- `/app/knowledge`
- `/app/settings`

Behavior:

- require owner authentication before route content loads
- render no private UI shell to unauthenticated users
- call only authenticated private APIs
- treat all owner-specific data as private by default

## Current Baseline

The current site uses a lightweight `APP_ACCESS_TOKEN` gate for `/app/*`.

This is acceptable as a v0/private-owner baseline, but any redesign should make
the behavior explicit:

- token value lives in server environment only
- token is not rendered into public bundles
- middleware/proxy protects `/app/*`
- unauthenticated requests do not receive private route data
- local fallback token is allowed only for development

## Target Session Model

Recommended v1 model:

1. User opens a private `/app/*` route.
2. Server-side route middleware checks for a valid owner session cookie.
3. If valid, request proceeds.
4. If missing/invalid, user sees an owner gate that does not reveal private data.
5. Owner submits the access token or future auth credential.
6. Server validates credential and sets an HttpOnly, Secure, SameSite session cookie.
7. Session expires automatically and can be cleared manually.

Recommended cookie properties:

- `HttpOnly`
- `Secure` in production
- `SameSite=Lax` or stricter
- path scoped to `/app` where practical
- finite expiration

Do not store the owner access token in `localStorage` or expose it to browser
JavaScript.

## Unauthenticated Behavior

Default behavior:

- show a private owner gate for `/app/*`
- do not render the private app shell behind it
- do not fetch private data before auth
- do not reveal detailed private route names beyond the requested URL

Acceptable alternatives for more privacy-sensitive routes:

- generic `404`
- generic `Not found`
- generic `Private area`

Choose one behavior per route class and document it before implementation. Do
not mix behaviors accidentally.

## Owner Gate

The owner gate should be minimal:

- site identity
- `Private owner area`
- token/passphrase input or future auth action
- clear error state
- no list of private agents, projects, schedules, or trading data

The owner gate must not include:

- private route preview
- agent state
- event counts
- trading summaries
- secret hints
- server error details

## Session Lifecycle

Required states:

- unauthenticated
- authenticating
- authenticated
- expired
- invalid credential
- logout/clear session

Required behavior:

- expired sessions return to the owner gate
- failed auth does not leak whether a private resource exists
- logout clears the session cookie
- private API responses return generic unauthorized errors when not authenticated

## Bundle and Import Boundary

Public routes must not import private-only data modules, mock private datasets,
or owner API clients in a way that ships them to the public bundle.

Allowed:

- shared layout primitives
- shared design tokens
- public-safe schema/types
- public-safe mock/demo data

Disallowed in public bundles:

- private task fixtures
- private trading artifacts
- private knowledge snippets
- private API clients with endpoint details
- raw internal route maps
- secrets or token validation logic

## Private API Boundary

Private APIs must:

- check owner session server-side
- return no private payload before auth
- avoid detailed unauthorized error bodies
- never expose raw secrets
- log failures safely

Public APIs must:

- expose only curated or sanitized data
- avoid importing private source readers
- avoid accepting commands that mutate private systems

## Future Auth Upgrade Path

The token gate can later be replaced by:

- passkey
- OAuth with owner allowlist
- Cloudflare Access
- Tailscale/private network access
- device-bound session

Any upgrade must preserve:

- owner-only access
- no private data in public bundles
- no private API calls before auth
- auditable write/approval boundaries

## Acceptance Criteria

- A developer can implement `/app/*` protection without guessing the session model.
- Unauthenticated users cannot see private app shell content.
- Public bundles do not contain private datasets or token logic.
- Private APIs reject unauthenticated requests server-side.
- The auth model is strong enough for owner-only dashboards, but does not claim
  to authorize trading or other execution systems.

