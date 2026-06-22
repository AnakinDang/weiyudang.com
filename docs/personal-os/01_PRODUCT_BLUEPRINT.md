# Product Blueprint

Status: v0.1
Date: 2026-06-13

## North Star

`weiyudang.com` is a public personal site and a private personal operating
system entry point.

The site should let a visitor understand Weiyu Dang's work, and let Weiyu enter
the Doraemon/MiniDora operating system without switching contexts.

One-line definition:

```text
Weiyu's personal website is a living personal operating system:
Doraemon is the entrance personality, MiniDoras are the agent team,
and Weiyu remains the final authority.
```

## Product Thesis

The redesign should make four ideas visible:

1. Weiyu is building personal AI systems, not a generic portfolio.
2. Doraemon is a long-term AI partner and orchestrator, not a chatbot gimmick.
3. MiniDoras are specialized teammates with responsibilities and audit trails.
4. Trading and market work are evidence-first research surfaces, never execution systems.

The site should feel like:

```text
personal research studio
+ warm Doraemon command room
+ precise agent operations layer
+ private owner cockpit
```

## Audiences

### Public visitors

They may be friends, collaborators, investors, recruiters, researchers, or
people curious about AI agents. They need a fast, concrete explanation of:

- who Weiyu is
- what Weiyu is building
- why Doraemon and MiniDoras exist
- which projects are public
- how to contact Weiyu

They must not see private tasks, prompts, raw event IDs, trading data, account
state, or private knowledge.

### Weiyu

Weiyu needs a fast route into:

- today's work state
- Doraemon command surface
- MiniDora agent state
- trading research console
- schedules and recurring workflows
- review queues
- knowledge vault outputs
- system health

This private surface should be dense, calm, and useful every day.

### Future agents and engineers

They need enough product context to implement the next screens without
re-deciding the product. This doc package should answer what the product is,
what belongs in public, what belongs in private, and what must remain impossible.

## Product Layers

### 1. Public Identity

Routes:

- `/`
- `/about`
- `/projects`
- `/projects/[slug]`
- `/lab`
- `/journal`
- `/contact`

Purpose:

- introduce Weiyu
- explain the lab and projects
- publish field notes and research notes
- route users toward Doraemon or contact

Design posture:

- warm, personal, readable
- not a resume template
- not a startup landing page
- not a cold enterprise dashboard

### 2. Doraemon Entry

Route:

- `/dora`

Purpose:

- introduce Doraemon as the AI partner/orchestrator
- explain MiniDoras in public language
- send users to the public Doraemon Office
- preserve safety boundaries

Design posture:

- friendly, warm, slightly magical
- precise about limits
- no fake omniscience or private system access

### 3. Doraemon Office

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
- The long-term product shape is native `weiyudang.com` routes under `/dora/*`,
  not an iframe or permanent separate portal.

Purpose:

- show a public, sanitized command room
- display agent state, activity, schedules, and team structure
- make the AI one-person company legible

Design posture:

- visual stage first, dashboard second
- read-only
- live when available, demo fallback when not
- public schema enforced

### 4. Owner Cockpit

Routes:

- `/app`
- `/app/command`
- `/app/trading`
- `/app/agents`
- `/app/review`
- `/app/settings`
- future `/app/schedules`
- future `/app/knowledge`

Purpose:

- private daily command surface for Weiyu
- authenticated access only
- higher density, deeper history, owner-specific controls

Authentication behavior is defined in [Auth and Session Spec](09_AUTH_AND_SESSION.md).

Design posture:

- calm operational cockpit
- owner-only
- auditable
- clear separation between view, approval, and execution

### 5. MiniDora Trading Team

Routes:

- public project or lab page for explanation
- private `/app/trading` for the console

Purpose:

- public: explain the research process and team structure
- private: review market research, signals, evidence, gates, and replay

Design posture:

- research desk, not brokerage terminal
- evidence-first
- uncertainty visible
- no execution affordances

## Experience Principles

### Warm but not childish

Doraemon-inspired warmth is allowed, but the product must retain professional
structure. Avoid treating the system as a toy.

### Public tells the story; private shows the state

Public pages explain concepts. Private pages expose deeper operational state.

### Agent identity matters

MiniDoras should have names, roles, status, recent work, and histories. Avoid
anonymous rows like `agent_1`.

### Auditability beats magic

Every important result should connect to evidence, source status, or event
history. This is especially important for trading research.

### No hidden execution

Public surfaces never execute actions. Private surfaces should distinguish
viewing, drafting, approval, and execution boundaries explicitly.

## V1 Success Criteria

- A first-time visitor understands the site is a personal AI systems studio within 10 seconds.
- `/dora` feels like the front door to Doraemon, not a generic chat mock.
- Doraemon Office makes MiniDora teamwork visible through state, timeline, and roles.
- Trading Team reads as a research desk, not a broker terminal.
- The private owner cockpit remains useful for daily work.
- Public/private data boundaries are visible in the UI and enforced by data contracts.

## Anti-Goals

- Do not turn the homepage into a SaaS landing page.
- Do not make Doraemon a decorative mascot detached from product behavior.
- Do not expose private runtime details for the sake of visual richness.
- Do not create any trading execution path.
- Do not duplicate implementation docs from the visualizer or trading repositories.
