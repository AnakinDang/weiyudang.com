# Public/Private Data Contract

Status: v0.1
Date: 2026-06-13

## Purpose

This contract defines what can cross from Weiyu's private systems into public
`weiyudang.com` surfaces.

Default rule:

```text
Private by default. Public only after explicit schema reconstruction.
```

Sanitization should be a product and engineering invariant, not a UI cleanup
step.

Public schemas must be allowlist-by-construction. Do not implement this contract
as a broad object passthrough plus a denylist of removed fields.

## Public Surface Classes

### Public marketing/content pages

Examples:

- `/`
- `/about`
- `/projects`
- `/lab`
- `/journal`
- `/contact`

Allowed:

- curated copy
- public project descriptions
- public images/assets intended for the site
- public journal/lab content
- public contact information

Disallowed:

- private memory
- private source notes
- credentials
- private runtime state
- trading account data

### Public Doraemon Entry

Example:

- `/dora`

Allowed:

- curated Doraemon explanation
- public-safe MiniDora roles
- public-safe office preview
- live/demo mode label
- links to public project pages

Disallowed:

- public RAG over private vault
- private task lookup
- internal prompt access
- tool execution
- runtime control

### Public Doraemon Office

Examples:

- `/dora/office`
- `dora.weiyudang.com`
- live public data source: `relay.weiyudang.com`

Allowed:

- opaque event IDs
- opaque run/task IDs when needed for pairing
- fixed public titles
- public event kind
- public agent role/name/profile
- public state label
- severity
- created/updated time
- public-safe `tool_name` when it passes shape validation
- public-safe `visual` when rebuilt from allowlisted fields
- live/demo/system health at safe abstraction level

Disallowed:

- raw event IDs
- raw run IDs
- raw task IDs
- raw task names
- prompt text
- message bodies
- payloads
- artifacts
- detail fields
- local paths
- usernames
- session keys
- tokens
- internal service hostnames/ports
- private registry fields
- private scene metadata

## Public Doraemon Office Event Schema

The public event schema is closed. A public event may contain only these
semantic fields, plus timestamps and opaque IDs needed for pairing:

- `event_id`
- `run_id`
- `task_id`
- `created_at`
- `event_type`
- `agent`
- `state`
- `severity`
- `title`
- `tool_name`
- `visual`

Rules:

- `event_id`, `run_id`, and `task_id` must be opaque and stable.
- `title` must be a fixed public string derived from event type/state.
- `tool_name` is allowed when it passes public shape validation; it is not a
  separate editorial approval workflow.
- `visual` must be rebuilt from explicit public fields. It is not a container
  for arbitrary upstream payloads.
- Unknown fields are dropped even when they look harmless.
- Unknown enum values are nulled, mapped to a safe fallback, or rejected before
  reaching public clients.

Current deployed public relay guardrails to preserve unless a future review
explicitly changes them:

- event batch/request body cap: `64KB`
- registry/scenes push body cap: `256KB`
- public WebSocket is read-only; client messages are ignored/dropped
- public viewer cap: `300`
- relay/worker deduplicates by public `event_id`
- replay buffer contains only sanitized public events
- relay/worker re-sanitizes even if the pusher already sanitized

### Private Owner Cockpit

Examples:

- `/app/*`

Allowed after auth:

- owner-specific tasks
- private agent state
- private research artifacts
- private schedules
- review queues
- system diagnostics

Auth/session behavior is defined in [Auth and Session Spec](09_AUTH_AND_SESSION.md).

Still disallowed:

- raw secret display
- unreviewed public publishing
- hidden execution
- unsafe trading execution paths

## ID Policy

Public IDs must be opaque.

Rules:

- raw IDs never leave private systems
- public IDs use stable opaque hashes
- hashing should be idempotent
- already-public opaque IDs can pass through
- raw-looking IDs must be rehashed at the public boundary
- pairing logic should use opaque IDs only

Examples:

```text
raw: evt_health_999          -> disallowed
public: evt_68815d67         -> allowed
raw: active-memory-LEAK      -> disallowed
public: t_3f91ac20           -> allowed
```

## Title and Message Policy

Public event titles should be fixed strings derived from event type/state.

Allowed examples:

- `Working`
- `Completed`
- `Owner review`
- `Tool call`
- `Handoff`
- `System update`
- `Attention needed`

Disallowed:

- raw task title
- private project name
- prompt fragment
- file path
- person-specific private note
- trading thesis text unless explicitly curated for public

## Registry and Scene Policy

Public registries and scene snapshots must be rebuilt field by field.

Allowed agent fields:

- public ID
- display name
- role
- safe avatar/profile reference
- public color token
- public motion profile
- public asset profile token
- public state
- public relative avatar/background asset paths when explicitly allowed

Disallowed:

- private config
- capabilities not intended for public
- local asset paths
- source directories
- prompt templates
- system instructions
- credentials
- arbitrary upstream fields
- path traversal such as `../`
- absolute filesystem paths
- arbitrary nested `animation_map` values

Value rules:

- `color` must be a known public color token or allowed enum value.
- `motion_profile` must be a known public enum value.
- `asset_profile` must match the safe public token policy.
- avatar/background paths must be relative public asset paths and must not
  contain traversal, home directories, or private collection paths.

If upstream adds a field, it should not appear publicly until explicitly added
to the public schema.

## Schedule Policy

Public schedules may show rhythm, not commands.

Allowed:

- public schedule name
- coarse category
- last/next run
- public state

Disallowed:

- scheduler command
- private prompt
- local script path
- secret env var
- owner-only note

## Trading Policy

Public trading content is methodology only.

Public allowed:

- research desk roles
- sample/mock signal shape
- public methodology
- research-only disclaimer

Private allowed after auth:

- research artifacts
- evidence
- source health
- signal history
- replay

Always disallowed:

- broker write
- order submit
- live submit
- account credentials
- hidden execution
- public display of account/position data

Required disclaimer:

```text
Research-only. Not an order, recommendation, or execution system.
```

## Enforcement Layers

Use multiple layers:

1. Private runtime emits internal events.
2. Pusher or adapter builds a public candidate shape.
3. Public relay/worker re-sanitizes and becomes authority.
4. Frontend renders only public schema fields.
5. Browser QA and production bundle checks verify no known leak strings.

The worker/relay boundary should not trust the pusher. Public schema
reconstruction should happen at the final public boundary.

## Testing Requirements

For any public data path, test with malicious probes containing:

- raw-looking IDs
- `/Users/` paths
- `secret`
- `session_key`
- private title fragments
- arbitrary nested fields
- unexpected enum values
- path traversal strings such as `../`

Expected result:

- probes are removed, replaced, nulled, or rehashed
- public response remains schema-valid
- frontend does not crash on unknown state

## Acceptance Criteria

- A future engineer can determine whether a field may be public.
- Public schema is explicit and allowlist-based.
- Unknown upstream fields do not leak by default.
- Trading boundary is impossible to miss.
- Public pages and bundles contain no private runtime strings.
