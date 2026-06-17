# Weiyu Dang Web

Initial Next.js version of `weiyudang.com`: a light personal website for Weiyu Dang plus a protected private app shell.

## What Is Included

- Public routes: `/`, `/about`, `/projects`, `/projects/[slug]`, `/dora`, `/lab`, `/journal`, `/contact`
- Private routes: `/app`, `/app/command`, `/app/trading`, `/app/agents`, `/app/events`, `/app/settings`
- Structured content under `content/projects`, `content/notes`, and `content/agents`
- Journal content under `content/journal` for photography, life notes, and field observations
- Static Doraemon public chat mock
- Read-only MiniDora Trading dashboard mock
- Token-gated private shell using `APP_ACCESS_TOKEN` and a signed owner session cookie
- Original bright studio hero asset under `public/visuals`
- Pure front-end activity layer: live studio signal, project filters, AI Lab tabs, lab feed, and Doraemon typing state

## Project Context

- `docs/personal-os/README.md` is the current product/design source of truth for the Weiyu Personal OS redesign.
- `web_desgin_v0.1.md` is the original design blueprint.
- `docs/project-context-2026-05-11.md` captures the initial build conversation, implementation decisions, safety boundaries, validation results, and deployment next steps.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

For local private app access, use `demo-access` if `APP_ACCESS_TOKEN` is not set. For production, set a strong `APP_ACCESS_TOKEN` in Vercel. Login exchanges the token for an HttpOnly, signed, finite-lived owner session cookie.

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

- The current build uses original site artwork. Doraemon imagery can be swapped in later if Weiyu intentionally provides an asset for personal use.
- `/dora` is a mock public guide and does not access private systems.
- Public interactive elements are client-side UI only; they do not call agent runtimes, trading feeds, or external APIs.
- `/app/trading` is read-only mock data.
- No order buttons are implemented.
- No broker write, paper submit, live submit, or phase auto-promotion paths exist.
