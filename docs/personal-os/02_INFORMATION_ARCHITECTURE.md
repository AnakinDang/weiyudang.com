# Information Architecture

Status: v0.1
Date: 2026-06-13

## Architecture Summary

The site has three navigation systems:

1. Public site navigation for visitors.
2. Doraemon Office navigation for the public command room.
3. Owner Cockpit navigation for private daily work.

These systems should feel connected, but they should not collapse into one
generic menu.

## Public Site Navigation

Primary public nav:

- `Home` -> `/`
- `Doraemon` -> `/dora`
- `Projects` -> `/projects`
- `Research` -> `/lab`
- `Journal` -> `/journal`
- `About` -> `/about`
- `Contact` -> `/contact`

### Home

Route: `/`

Responsibilities:

- identify Weiyu immediately
- explain the personal AI systems direction
- show Doraemon as a first-class entry
- highlight selected systems and latest notes
- provide routes into projects, Doraemon, and contact

Required first-viewport signals:

- Weiyu's name
- personal AI systems framing
- Doraemon/Personal OS entry point
- one visible next step

### About

Route: `/about`

Responsibilities:

- explain Weiyu's background, taste, operating style, and current focus
- avoid a resume-only structure
- connect personal identity to the AI systems work

### Projects

Routes:

- `/projects`
- `/projects/[slug]`

Responsibilities:

- expose a curated project index
- distinguish public demos, private systems, and research notes
- give Doraemon Visualizer, MiniDora Trading, and Knowledge Vault clear project pages
- follow [Content Model](10_CONTENT_MODEL.md)

Canonical project taxonomy is defined in [Content Model](10_CONTENT_MODEL.md).


### Research

Route: `/lab`

Responsibilities:

- publish experiments, build logs, design notes, and system sketches
- sit between project pages and journal entries
- show process without exposing private internals
- follow [Content Model](10_CONTENT_MODEL.md)

### Journal

Route: `/journal`

Responsibilities:

- hold personal notes, photography, life observations, and essays
- preserve a more human rhythm than the lab
- follow [Content Model](10_CONTENT_MODEL.md)

### Contact

Route: `/contact`

Responsibilities:

- provide a direct contact path
- explain collaboration areas
- avoid exposing private operational channels

## Doraemon Navigation

Primary Doraemon nav:

- `Overview` -> `/dora`
- `Office Live` -> `/dora/office`
- `Activity` -> `/dora/activity`
- `Team Agents` -> `/dora/team`
- `Tasks` -> `/dora/tasks`
- `Schedules` -> `/dora/schedules`
- `Knowledge` -> `/dora/knowledge`
- `System` -> `/dora/system`

Route strategy:

- `/dora` remains the entry and guide.
- Doraemon Office uses native `weiyudang.com` routes under `/dora/*`.
- `dora.weiyudang.com` remains the current deployed live visualizer bridge while
  the main-site route integration is built.
- Do not use an iframe as the long-term product shape.

### Doraemon Overview

Responsibilities:

- introduce Doraemon
- show current office status
- provide a clear path to live/demo office
- make public safety boundaries visible

### Office Live

Responsibilities:

- show the animated Doraemon/MiniDora command room
- display current focus, heartbeat, and recent activity
- provide demo fallback if live relay is unavailable

### Activity

Responsibilities:

- full sanitized event timeline
- filters by kind, agent, severity, and time range
- newest-first ordering by event creation time

### Team Agents

Responsibilities:

- public roster of Doraemon and MiniDoras
- role, current state, recent events, and handoffs
- no private task titles or raw internal identifiers

### Tasks

Responsibilities:

- public task/run aggregation
- generic public titles
- state counts and owner-review status
- no prompt bodies, private task names, or execution controls

### Schedules

Responsibilities:

- public recurring workflow rhythm
- examples: daily brief, market scan, system health, weekly review
- no private cron command strings or secret paths

### Knowledge

Responsibilities:

- explain the Knowledge Vault concept
- show public synthesis outputs
- no private source notes, private memory, or raw vault pages

### System

Responsibilities:

- public relay/dashboard health
- last event age, live/demo mode, schema status
- no internal service paths, ports, tokens, or hostnames beyond public domains

## Owner Cockpit Navigation

Primary private nav:

- `Today`
- `Command`
- `Agents`
- `Trading Team`
- `Knowledge Vault`
- `Schedules`
- `Review Queue`
- `System Health`
- `Settings`

### Today

Responsibilities:

- give Weiyu the daily brief
- show top priorities, waiting approvals, market alerts, schedule pressure, and system health

### Command

Responsibilities:

- owner-level Doraemon command surface
- input, draft planning, approval flow, and status review
- all write/execution actions must be authenticated and auditable
- follow [Auth and Session Spec](09_AUTH_AND_SESSION.md)

### Agents

Responsibilities:

- full MiniDora roster
- per-agent history, capabilities, current leases, last outputs, and source health

### Trading Team

Responsibilities:

- research-only console
- signals, evidence, gates, replay, desk disagreement, and source degradation

### Knowledge Vault

Responsibilities:

- private synthesis and source navigation
- public-publish workflow should be explicit and reviewed

### Schedules

Responsibilities:

- private recurring jobs and reminders
- visible owner controls only after separate auth/safety design

### Review Queue

Responsibilities:

- owner decisions needed
- approvals, rejects, notes, deferrals
- no silent auto-promotion

### System Health

Responsibilities:

- service status, recent failures, event lag, queue health
- safe diagnostics without exposing secrets in the UI

### Settings

Responsibilities:

- profile, private token/auth status, display modes, notification preferences
- no raw secret display

## Mobile IA

Mobile must keep navigation available when sidebars collapse.

Required behavior:

- public nav remains reachable
- Doraemon Office exposes compact tabs or a bottom route rail
- Owner Cockpit exposes a private mobile nav pattern only after auth
- no page should become a dead end when the sidebar is hidden
