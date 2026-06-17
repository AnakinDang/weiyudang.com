# Design System Brief

Status: v0.1
Date: 2026-06-13

## Design Goal

Unify three moods without making the site feel fragmented:

```text
personal research studio
+ warm Doraemon command room
+ precise research cockpit
```

The system should be personal, warm, and imaginative, while still supporting
dense operational dashboards.

## Personality

Use these words as design checks:

- warm
- precise
- calm
- alive
- trustworthy
- technical
- personal
- evidence-first

Avoid:

- generic SaaS landing page
- cold enterprise dashboard
- cyberpunk command center
- toy-like interface with weak information hierarchy
- crypto/trading hype aesthetic

## Color Direction

### Base

- warm white
- soft gray
- ink text
- quiet borders

Initial tokens:

- `--color-bg`: `#fbfaf7`
- `--color-surface`: `#ffffff`
- `--color-surface-soft`: `#f3f0ea`
- `--color-text`: `#1f2933`
- `--color-muted`: `#64748b`
- `--color-border`: `#ded8cf`

Use this for:

- homepage
- About
- Projects
- Lab
- Journal
- Dora Entry base

### Dora layer

- Dora blue
- bell yellow
- soft red
- warm white
- gentle shadow/highlight

Initial tokens:

- `--color-dora-blue`: `#1f7ae0`
- `--color-dora-blue-deep`: `#1559a8`
- `--color-bell-yellow`: `#f6c945`
- `--color-dora-red`: `#e94b4b`
- `--color-pocket-white`: `#fffdf8`

Use this for:

- Dora Entry
- Dora Office accents
- agent identity
- live/demo state

### Operational layer

- muted slate/ink
- restrained green
- amber
- red only for true alert
- blue for live/system state

Initial tokens:

- `--color-op-bg`: `#111827`
- `--color-op-panel`: `#182230`
- `--color-op-line`: `#2d3748`
- `--color-live`: `#2563eb`
- `--color-success`: `#16a34a`
- `--color-warning`: `#d97706`
- `--color-danger`: `#dc2626`

Use this for:

- Owner Cockpit
- Trading Team
- System Health
- dense tables

## Typography

Recommended:

- Sans: system UI, Inter, Geist, or similar
- Mono: Geist Mono, JetBrains Mono, or similar
- Chinese fallback: system Chinese sans stack

Typography rules:

- hero-scale type only on true hero sections
- dashboard headings should be compact
- timeline and table text must be scannable
- do not use negative letter spacing
- do not scale font size directly with viewport width

## Layout Principles

### Public pages

- generous but not empty
- strong first-viewport signal
- clear next section visible below hero
- content-led, not decoration-led

### Dora Office

- animated stage has priority
- panels explain the stage
- side navigation on desktop
- compact route navigation on narrow screens
- no card-inside-card patterns

### Owner Cockpit

- dense but calm
- predictable nav
- compact state cards
- fast scanning
- clear owner-review queues

### Trading Team

- evidence surfaces are first-class
- use tables when comparison matters
- show uncertainty and source health
- avoid brokerage terminal patterns

## Component System

### Agent card

Required fields:

- avatar/profile
- name
- role
- current state
- recent event
- last updated
- public/private badge when relevant

### Timeline event

Required fields:

- time
- public event kind
- agent
- fixed public title
- state/severity
- optional evidence/status link in private views

### Status badge

Allowed public states are defined canonically in
[Dora Office Dashboard Spec](04_DORA_OFFICE_DASHBOARD_SPEC.md). Do not create a
parallel state vocabulary in component code.

Badge examples:

- Live
- Demo
- Working
- Owner review
- Completed
- Attention
- Offline
- Research-only
- Private
- Public-safe

### Boundary badge

Use clear badges for:

- Public-safe
- Owner-only
- Research-only
- Read-only
- Demo replay

### Evidence card

Used primarily for Trading Team:

- source
- freshness
- confidence
- counter-evidence
- degradation state

## Motion

Motion should clarify state.

Use motion for:

- live heartbeat
- agent state changes
- handoff
- waiting review
- demo replay rhythm
- loading/sync transitions

Avoid:

- decoration-only motion that competes with data
- constant distracting loops in dense private views
- motion that hides current state

## Asset Policy

Current owner decision:

- public non-commercial `weiyudang.com` may display official Doraemon material
- raw/source asset collections remain private
- deploy only required runtime subsets
- keep replacement path open
- comply with takedown if needed

Implementation implication:

- do not place official raw asset libraries in public source repos
- keep asset references centralized
- make skin/profile replacement possible
- document which assets ship in public builds

## Accessibility and Responsiveness

Requirements:

- sufficient color contrast
- keyboard-readable focus states
- no text overlap on mobile
- no unreachable route when sidebar is hidden
- status not conveyed by color alone
- responsive constraints for stage, cards, tables, and route tabs

## Visual Acceptance Criteria

- The homepage feels personal before it feels corporate.
- Dora pages feel warm and alive without losing product clarity.
- Dora Office reads as a command room, not a generic admin dashboard.
- Trading Team reads as a research cockpit, not a trading terminal.
- Mobile pages preserve navigation and do not overlap topbar, tabs, or content.
