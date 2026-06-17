# Project Context - 2026-05-11

This document captures the working context from the initial build conversation for `weiyudang.com`.

## Original Ask

Weiyu wanted to turn the design blueprint in `web_desgin_v0.1.md` into a personal website.

The domain was purchased on Cloudflare, and the preferred deployment target is Vercel.

## Product Direction

The website is not meant to be a standard personal resume page. After the light-theme revision, it should feel first like Weiyu Dang's personal research studio:

- Personal identity for Weiyu Dang
- Public explanation of Weiyu AI as one lab inside the personal site
- Project index
- Public Doraemon guide
- Journal / Field Notes for photography, life notes, and personal observations
- Private command center shell
- Future bridge to internal agent and trading dashboards

The key framing is:

> Weiyu decides. Doraemon coordinates. MiniDora executes.

## Implementation Decisions

- Framework: Next.js App Router
- Language: TypeScript
- Styling: Tailwind CSS
- Deployment target: Vercel
- DNS/security owner: Cloudflare
- Content source: structured files under `content/`
- Private app protection: lightweight `APP_ACCESS_TOKEN` gate
- Current dashboards: mock data only
- Public activity layer: client-side only, no backend calls

## Routes Built

Public routes:

- `/`
- `/about`
- `/projects`
- `/projects/[slug]`
- `/dora`
- `/lab`
- `/journal`
- `/contact`

Private app routes:

- `/app`
- `/app/command`
- `/app/trading`
- `/app/agents`
- `/app/events`
- `/app/settings`

## Important Boundaries

Public Doraemon page:

- Static mock in the MVP
- Explains public project content only
- Does not access private memory, files, email, calendar, credentials, trading data, or internal agent runtime

MiniDora Trading:

- Public page explains research/evidence workflow only
- Private dashboard is read-only mock data
- No order buttons
- No broker write
- No paper submit
- No live submit
- No phase auto-promotion

Visual:

- Public site uses a warm light theme, original bright studio imagery, and scoped `.page-shell` styles
- Private `/app` keeps the dark dashboard shell
- Doraemon imagery can be swapped into the Doraemon entrance later if Weiyu intentionally provides an asset for personal use
- Homepage now includes pure front-end live studio signal, project filters, AI Lab tabs, and lab-feed interactions

## Files To Know

- `README.md` - local dev, validation, Vercel, Cloudflare notes
- `web_desgin_v0.1.md` - original blueprint
- `app/page.tsx` - homepage
- `app/dora/page.tsx` - public Doraemon page
- `app/app/trading/page.tsx` - private trading dashboard route
- `components/DoraChatMock.tsx` - static Doraemon guide mock
- `components/TradingDashboardMock.tsx` - read-only trading dashboard
- `components/StudioScene.tsx` - bright personal research studio visual
- `content/projects/*.mdx` - project content
- `content/journal/*.mdx` - photography and personal journal content
- `content/agents/*.json` - agent registry mock
- `proxy.ts` - private `/app` route protection

## Local Commands

Install:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Local private app token:

```text
demo-access
```

Production should set a strong `APP_ACCESS_TOKEN` in Vercel.

## Validation Already Done

- `npm run build` passed
- `npm audit --omit=dev` reported 0 vulnerabilities after PostCSS override/update
- Browser preview checked homepage, project index, Doraemon mock interaction, and `/app/trading` login flow

## Deployment Next Steps

1. Initialize git or move this into a GitHub repository.
2. Push the project to GitHub.
3. Import the repository into Vercel.
4. Set `APP_ACCESS_TOKEN` in Vercel environment variables.
5. Add `weiyudang.com` and `www.weiyudang.com` in Vercel Domains.
6. Use Vercel's domain inspection output to add the required DNS records in Cloudflare.
7. Keep verification TXT/CNAME records DNS-only in Cloudflare.
8. Decide whether the Vercel A/CNAME records should be proxied after confirming the Vercel/Cloudflare compatibility state.

## Future Work

- Replace Doraemon static mock with constrained public content retrieval and API rate limiting.
- Add Cloudflare Turnstile or equivalent bot protection for public forms/API.
- Connect `/app/events` to a real authenticated event stream.
- Connect `/app/trading` to read-only artifacts from MiniDora Trading.
- Add real contact mailbox routing for `hello@weiyudang.com`.
- Add more lab notes and project pages as the system grows.
