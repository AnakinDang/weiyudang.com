# Weiyu Personal OS Docs

Status: v0.1 product/design source of truth
Date: 2026-06-13
Owner: Weiyu Dang

This folder is the pre-implementation product and design documentation package
for the next redesign of `weiyudang.com`.

`weiyudang.com` should not behave like a normal resume site or a generic lab
homepage. It is the public front door to Weiyu's personal AI operating system:

```text
public personal site
+ Doraemon entry
+ public Doraemon Office
+ private owner cockpit
+ MiniDora agent team surfaces
+ research-only trading team interface
```

## Read Order

1. [Product Blueprint](01_PRODUCT_BLUEPRINT.md)
2. [Information Architecture](02_INFORMATION_ARCHITECTURE.md)
3. [Doraemon Entry Spec](03_DORA_ENTRY_SPEC.md)
4. [Doraemon Office Dashboard Spec](04_DORA_OFFICE_DASHBOARD_SPEC.md)
5. [Trading Team Interface Spec](05_TRADING_TEAM_INTERFACE_SPEC.md)
6. [Design System Brief](06_DESIGN_SYSTEM_BRIEF.md)
7. [Public/Private Data Contract](07_PUBLIC_PRIVATE_DATA_CONTRACT.md)
8. [Implementation Readiness Checklist](08_IMPLEMENTATION_READINESS_CHECKLIST.md)
9. [Auth and Session Spec](09_AUTH_AND_SESSION.md)
10. [Content Model](10_CONTENT_MODEL.md)

## Product Layers

| Layer | Primary routes | Purpose |
| --- | --- | --- |
| Public identity | `/`, `/about`, `/projects`, `/lab`, `/journal`, `/contact` | Explain Weiyu, the work, the lab, and the public research trail. |
| Doraemon entry | `/dora` | Warm front door to Doraemon and the agent system. |
| Doraemon Office | `/dora/office`, `/dora/activity`, `/dora/team`, `/dora/tasks`, `/dora/schedules`, `/dora/knowledge`, `/dora/system` | Public, read-only, sanitized command room and dashboard. |
| Owner cockpit | `/app/*` | Private working surface for Weiyu. |
| Trading team | public project page + private `/app/trading` | Research-only agent team showcase and private evidence console. |

Current bridge:

- `dora.weiyudang.com` is the deployed public visualizer and dashboard surface.
- `relay.weiyudang.com` is the deployed read-only public relay feeding live sanitized events.
- The long-term product shape is native/merged `weiyudang.com` routes under `/dora/*`, not an iframe.

## Repository Boundary

This folder is the product source of truth for the personal site. Runtime,
protocol, deployment, and relay implementation details continue to live in the
specialized repositories:

- `weiyu-ai/doraemon-visualizer`: visualizer, relay, event protocol, dashboard implementation.
- `weiyu-ai/minidora-trading-team-webui`: trading research UI prototypes.
- `weiyu-ai/doraemon-workspace`: identity, operating principles, and private working memory.
- `weiyu-ai/doraemon-knowledge-vault`: private knowledge synthesis layer.

Do not duplicate those implementation docs here. Link to them or summarize the
product-facing contract when needed.

## Non-Negotiables

- Doraemon is the entrance personality, not a decorative sticker.
- MiniDoras are a team with roles, states, history, and evidence.
- Public surfaces are display-only and sanitized by default.
- Private surfaces remain owner-only and auditable.
- MiniDora Trading is research-only. It is not an order, recommendation, or
  execution system.
- Private `/app/*` behavior is defined in [Auth and Session Spec](09_AUTH_AND_SESSION.md).
- Public Projects, Lab, Journal, About, and agent profiles follow [Content Model](10_CONTENT_MODEL.md).
- Current owner decision allows non-commercial public Doraemon display on
  `weiyudang.com`, while source repositories and raw assets stay private,
  minimal, replaceable, and takedown-friendly.
