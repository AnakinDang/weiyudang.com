# Dora Entry Spec

Status: v0.1
Date: 2026-06-13

## Purpose

`/dora` is the public front door to Doraemon and the Weiyu Personal OS.

It should not be a generic chatbot page. It should explain Doraemon as Weiyu's
long-term AI partner, coordinator, and command-room entrance.

The page should answer:

- Who is Doraemon in Weiyu's system?
- What are MiniDoras?
- What can the public see?
- What remains private?
- How do I enter the public Dora Office?

## Positioning

Recommended headline direction:

```text
Dora Office
```

Supporting line:

```text
The public window into Weiyu's personal AI command room.
```

Alternative supporting lines:

```text
Doraemon coordinates. MiniDoras work. Weiyu decides.
```

```text
A warm, read-only view of the agent team behind Weiyu's personal operating system.
```

## Required Modules

### 1. Doorway Hero

Responsibilities:

- make Doraemon visually and conceptually present in the first viewport
- make the page feel like an entrance, not a documentation page
- include one primary CTA into the office

Primary CTA:

```text
Enter Dora Office
```

Canonical destination:

```text
/dora/office
```

Current production bridge:

```text
https://dora.weiyudang.com
```

Secondary CTAs:

- `Meet the MiniDoras`
- `Read the project`
- `Contact Weiyu`

### 2. What Dora Does

Explain Doraemon through behavior, not lore.

Recommended capability cards:

- `Coordinate agents`
- `Track work`
- `Summarize signals`
- `Guard boundaries`

Each card should describe public-facing behavior in simple language. Avoid
claiming access to private systems on the public page.

### 3. Meet the MiniDoras

Preview the agent team:

- Research MiniDora
- Dev MiniDora
- Product MiniDora
- Ops MiniDora
- Memory MiniDora
- Trading MiniDora
- Media MiniDora

Each preview should include:

- role
- public-safe responsibility
- current public/demo status if available
- route to `Team Agents` in Dora Office

### 4. Office Preview

Show a compact public preview of the command room:

- live/demo badge
- current focus
- latest sanitized events
- one agent roster strip
- clear link to the full office

If live relay is unavailable, the preview should gracefully show demo mode. The
current live data source is the public visualizer bridge at `dora.weiyudang.com`
fed by the read-only relay at `relay.weiyudang.com`; the long-term site product
shape remains native `/dora/*` routes.

### 5. Public Safety Boundary

This should be visible but not alarmist.

Required message:

```text
Public Dora Office is read-only and sanitized. It does not expose private tasks,
prompts, memory, credentials, trading data, or owner-only controls.
```

### 6. Project Context

Link Doraemon to the broader project system:

- Doraemon Visualizer
- MiniDora Trading Team
- Knowledge Vault
- Weiyu Personal OS

## Interaction Model

Current default:

- curated public guide only
- no public RAG/LLM in this slice
- no tool calls
- no internal runtime actions

Allowed interactions:

- navigate to office sections
- expand public explanations
- filter public agent/team previews
- view demo/live state

Not allowed:

- public chat that queries private memory
- public prompt-to-agent execution
- trading data lookup
- internal logs or raw event access

## Visual Direction

The page should feel like a warm threshold into a command room.

Use:

- Dora blue accents
- warm white base
- bell yellow highlights
- soft red for small emphasis
- gentle motion that suggests an active office

Avoid:

- corporate SaaS hero cards
- giant fake chat interface as the main product
- dark cyberpunk treatment
- low-density decoration that hides the actual entry point

## Copy Tone

Tone should be:

- warm
- precise
- personal
- quietly playful
- clear about boundaries

Avoid:

- "AI will do everything" language
- fake AGI grandeur
- salesy SaaS claims
- hidden private capability hints

## Asset Policy

Current owner decision allows non-commercial public Doraemon display on
`weiyudang.com`. Implementation must still keep raw/source asset collections
private, deploy only the required runtime subset, and make replacement possible
if a takedown or redesign requires it.

This decision supersedes older project notes that recommended avoiding official
Doraemon visuals on the public site.

## Acceptance Criteria

- The first viewport immediately communicates Doraemon + public office.
- A visitor understands the public/private boundary before entering office views.
- The page routes to Dora Office without iframe dependency.
- No public interaction implies private memory, trading data, or execution access.
- Doraemon feels structurally important, not pasted on as a mascot.
