# Trading Team Interface Spec

Status: v0.1
Date: 2026-06-13

## Purpose

MiniDora Trading Team is an agent research desk.

It is not:

- a brokerage terminal
- an order management system
- a portfolio management system
- a recommendation engine
- an autonomous trading system

Fixed disclaimer:

```text
Research-only. Not an order, recommendation, or execution system.
```

This disclaimer should appear in the public project page and the private trading
console.

## Product Split

### Public version

Purpose:

- explain the agent research team
- show methodology
- show sanitized sample workflows
- demonstrate evidence-first reasoning

Allowed content:

- agent desk roles
- public methodology
- example signal shapes with mock/sample data
- research-only boundary
- project narrative

Disallowed content:

- account data
- positions
- orders
- live private signals
- private watchlists
- raw source artifacts
- execution controls

## Team Model

Doraemon Office exposes one public roster member:

```text
Trading MiniDora
```

Trading Team itself can contain multiple private research desks under that
public agent identity. In other words, `Trading MiniDora` is the public-facing
agent/team lead, while the private console may show specialized desks.

Do not create seven unrelated public MiniDora roster members unless the Doraemon
Office roster is deliberately redesigned.

### Private version

Purpose:

- let Weiyu review research artifacts
- compare agent desks
- inspect evidence and counter-evidence
- replay how a conclusion formed
- track source degradation and risk gates

Still disallowed:

- broker write
- paper submit
- live submit
- one-click order placement
- phase auto-promotion
- hidden execution

## Core Private Views

### Today

Responsibilities:

- summarize the most important current market research state
- show top signals
- show desk disagreements
- show source health
- show owner review needs

Recommended sections:

- `What matters today`
- `Signals needing review`
- `Desk disagreement`
- `Source degradation`
- `Open questions`

### Signals

Responsibilities:

- list research signals
- expose direction, confidence, time horizon, source health, and evidence status
- make uncertainty visible

Each signal should include:

- instrument
- thesis summary
- confidence band
- evidence count
- counter-evidence count
- updated time
- responsible desk/agent
- research-only disclaimer nearby or persistent

### Desks

Responsibilities:

- show specialized research agents
- compare perspectives
- reveal disagreements

Suggested desks:

- Macro Desk
- Equity Desk
- Options Desk
- Risk Desk
- News Desk
- Crypto Desk
- Evidence Desk

### Instruments

Responsibilities:

- instrument-level research page
- signal history
- evidence timeline
- source quality
- risk flags

Do not include:

- order ticket
- buy/sell button
- account position controls

### Options Lab

Responsibilities:

- research volatility and options scenarios
- show term structure, skew, scenario notes, and risk discussion

Boundary:

- present scenarios as research artifacts only
- no strategy execution button

### Gates & Evidence

Responsibilities:

- central place for evidence quality
- source provenance
- open blockers
- pass/fail gates
- degraded feeds

Required product behavior:

- every important signal can be traced to evidence
- degraded sources are visible
- missing evidence is shown as a blocker, not hidden

### Replay

Responsibilities:

- reconstruct a research day
- show how agents formed or revised a view
- show handoffs and evidence changes

Replay should support:

- timeline
- desk filter
- instrument filter
- evidence filter
- state changes

### System Status

Responsibilities:

- data freshness
- source health
- agent run health
- artifact availability
- degraded-mode explanation

## Public Project Page Structure

Recommended route:

- `/projects/minidora-trading`

Recommended sections:

1. `Research desk, not trading terminal`
2. `Meet the desks`
3. `How a signal forms`
4. `Evidence and counter-evidence`
5. `Replay and review`
6. `Safety boundary`
7. `Private console preview`

## Visual Direction

Trading Team should be calmer and denser than the Doraemon Entry page.

Use:

- structured tables
- compact cards
- evidence badges
- source health indicators
- risk and uncertainty labels
- restrained color

Avoid:

- casino-like green/red dominance
- hype language
- broker/order-ticket visual patterns
- giant price widgets without evidence context

## Required Safety Copy

Short version:

```text
Research-only. Not an order, recommendation, or execution system.
```

Long version:

```text
MiniDora Trading Team helps organize market research, evidence, and uncertainty.
It does not place trades, submit orders, manage accounts, or provide financial
advice. Weiyu remains responsible for all decisions.
```

## Acceptance Criteria

- Public viewers understand the system as a research workflow.
- Private users can inspect evidence behind signals.
- Uncertainty and degraded sources are visible.
- No execution affordance exists anywhere in the interface.
- The fixed research-only disclaimer appears persistently enough to be impossible to miss.
