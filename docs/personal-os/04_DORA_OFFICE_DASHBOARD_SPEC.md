# Dora Office Dashboard Spec

Status: v0.1
Date: 2026-06-13

## Purpose

Dora Office is the public, read-only command room for the Doraemon Agent System.

It should make the AI one-person company visible:

```text
Doraemon coordinates.
MiniDoras work.
Weiyu decides.
The public sees only sanitized state.
```

## Product Shape

Dora Office should be integrated into the personal site experience. The long-term
product shape is native `weiyudang.com` routes under `/dora/*`, not an iframe
portal and not a permanent separate visualizer portal.

Canonical routes:

- `/dora/office`
- `/dora/activity`
- `/dora/team`
- `/dora/tasks`
- `/dora/schedules`
- `/dora/knowledge`
- `/dora/system`

Current production bridge:

- `dora.weiyudang.com` is the deployed public visualizer/dashboard.
- `relay.weiyudang.com` is the deployed read-only relay for sanitized live events.
- The implementation may continue to reuse the existing visualizer internally,
  but the user experience should converge into the native `/dora/*` route map.

## Core Views

### Overview

Responsibilities:

- show the animated Doraemon/MiniDora command room
- display current focus
- show recent activity
- show live/demo mode
- surface owner-review or alert states

Required behavior:

- if live relay is connected, show live state
- if live relay fails, fall back to demo replay
- recent activity is sorted by event creation time, newest first
- visual stage can remount cleanly when navigating away/back

### Activity

Responsibilities:

- full public event timeline
- filters by event kind, agent, severity, and time range
- public-safe labels and titles

Required event groups:

- agent work
- handoffs
- tool calls
- owner review
- alerts
- system

Do not expose:

- raw event IDs
- raw run IDs
- raw task IDs
- private task titles
- prompts
- payloads
- artifacts
- internal paths

### Team Agents

Responsibilities:

- agent roster
- current state
- role labels
- recent events
- recent handoffs
- public-safe avatar/profile

Recommended roster:

- Doraemon: coordinator / orchestrator
- Research MiniDora: research and synthesis
- Dev MiniDora: engineering, tests, deployment
- Product MiniDora: planning, scope, product quality
- Ops MiniDora: schedules, health, automation
- Memory MiniDora: knowledge and context
- Trading MiniDora: market research only
- Media MiniDora: creative assets and content

### Tasks

Responsibilities:

- aggregate sanitized runs/tasks
- show state counts
- show waiting-for-owner items
- show completed/failed/active groups

Allowed public fields:

- opaque task ID
- fixed public title
- state
- agent role
- created/updated time
- severity

Disallowed public fields:

- raw task names
- prompt body
- private project paths
- owner notes
- execution controls

### Schedules

Responsibilities:

- show recurring operating rhythm
- public names such as `Daily brief`, `Market scan`, `System health`, `Weekly review`
- next/last run at a coarse level

Do not expose:

- cron command strings
- local paths
- tokens
- private prompt text
- internal service names when not already public

### Knowledge

Responsibilities:

- explain what the Knowledge Vault does
- display public synthesis outputs
- link to public notes/projects when available

Do not expose:

- raw private vault pages
- private source files
- memory records
- unpublished reports

### System

Responsibilities:

- relay health
- live/demo status
- last event age
- public schema version
- buffer/dedupe health at a safe abstraction level

Allowed:

- `Live`
- `Demo replay`
- `Last event: 12s ago`
- `Public schema: OK`

Disallowed:

- raw internal hostnames
- local ports
- LaunchAgent labels when not necessary
- token locations
- filesystem paths

## Canonical Public State Vocabulary

Public labels should be stable, simple, and non-leaky:

- `Idle`
- `Planning`
- `Working`
- `Tool call`
- `Handoff`
- `Owner review`
- `Completed`
- `Attention`
- `Offline`
- `Demo`

Tool lifecycle states should never become raw agent runtime state. Map tool
events into public labels before rendering.

Do not introduce alternate public review labels unless this canonical list is
updated first.

## Layout Principles

- The animated stage is the center of the Overview.
- Dashboard panels explain the stage; they do not overpower it.
- On desktop, sidebar navigation can carry the route structure.
- On narrow screens, compact route tabs or another visible nav must appear.
- No page should become unreachable when sidebars collapse.

## Data Contract Dependency

Dora Office must follow [Public/Private Data Contract](07_PUBLIC_PRIVATE_DATA_CONTRACT.md).

The public dashboard should treat the relay/worker public schema as the only
trusted input. Frontend code should still render defensively if an unknown state
appears.

## Acceptance Criteria

- Public visitors can understand what the agent team is doing without seeing private details.
- Overview, Activity, and Team Agents are useful as separate views.
- Tasks and Schedules expose operating rhythm without leaking task content.
- System health is reassuring but not operationally sensitive.
- The dashboard remains display-only in public.
