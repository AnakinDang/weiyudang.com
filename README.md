# Weiyu Dang Web

Initial Next.js version of `weiyudang.com`: a public personal AI company portal plus a protected private app shell.

## What Is Included

- Public routes: `/`, `/about`, `/projects`, `/projects/[slug]`, `/dora`, `/lab`, `/contact`
- Private routes: `/app`, `/app/command`, `/app/trading`, `/app/agents`, `/app/events`, `/app/settings`
- Structured content under `content/projects`, `content/notes`, and `content/agents`
- Static Dora public chat mock
- Read-only MiniDora Trading dashboard mock
- Token-gated private shell using `APP_ACCESS_TOKEN`

## Project Context

- `web_desgin_v0.1.md` is the original design blueprint.
- `docs/project-context-2026-05-11.md` captures the initial build conversation, implementation decisions, safety boundaries, validation results, and deployment next steps.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

For local private app access, use `demo-access` if `APP_ACCESS_TOKEN` is not set. For production, set a strong `APP_ACCESS_TOKEN` in Vercel.

## Validation

```bash
npm run build
```

The current build passes on Next.js 16.2.6.

## Vercel Deployment

Recommended first deployment path:

1. Push this project to a GitHub repository.
2. Import the repository into Vercel as a Next.js project.
3. Add `APP_ACCESS_TOKEN` in Vercel Project Settings -> Environment Variables.
4. Deploy production.
5. Add `weiyudang.com` and `www.weiyudang.com` in Vercel Project Settings -> Domains.
6. Use Vercel's domain inspection output as the source of truth for the exact DNS records.

Vercel's general-purpose values are commonly:

- Apex/root domain: `A @ 76.76.21.21`
- `www` subdomain: `CNAME www cname.vercel-dns-0.com`

But Vercel may provide project-specific values, so inspect the domain in Vercel before changing Cloudflare DNS.

## Cloudflare DNS Notes

Because the domain is managed in Cloudflare, add the Vercel-required records in Cloudflare DNS, not through Vercel DNS.

Typical setup after Vercel confirms the records:

- `A` record: name `@`, content from Vercel, proxy status based on the Vercel/Cloudflare compatibility state
- `CNAME` record: name `www`, target from Vercel, proxy status based on the Vercel/Cloudflare compatibility state

Cloudflare proxy status only applies to A, AAAA, and CNAME records. Domain-verification TXT/CNAME records should stay DNS-only.

## Safety Boundaries

- No official Doraemon artwork is used.
- `/dora` is a mock public guide and does not access private systems.
- `/app/trading` is read-only mock data.
- No order buttons are implemented.
- No broker write, paper submit, live submit, or phase auto-promotion paths exist.
