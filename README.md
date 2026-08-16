# Glass Dashboard Kit

A production-ready Next.js port of the **Extended System Telemetry** glassmorphism dashboard concept.

## Stack

- **Framework**: [Next.js 16](https://nextjs.org) (App Router, static export)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: [Lucide React](https://lucide.dev)
- **Charts**: [Chart.js](https://www.chartjs.org) (dynamically imported, client-only)
- **Fonts**: Inter + Geist Mono via `next/font/google`

## Project structure

```
app/           # Routes, global styles, layout, and server-side page
components/    # Reusable React components
  Dashboard.tsx  # Shell: skip link, sidebar, header, sections
  Sidebar.tsx    # Collapsible rail / mobile drawer
  Header.tsx     # Sticky, scroll-condensed header
  sections.tsx   # All dashboard section cards
lib/           # Data types, static data, and external API helpers
  data.ts        # Fetchers for RandomUser, JSONPlaceholder todos & posts
  utils.ts       # `cn()` Tailwind + clsx/tailwind-merge helper
docs/          # Original standalone HTML proof-of-concept
```

## Features

- 20+ glassmorphic dashboard components (metrics, process table, hardware toggles, disk usage, top services, charts, team directory, tasks, logs, status controls, deployment pipeline, inventory, media gallery, forms, alerts).
- Responsive layout with 6-column expansion on ultrawide screens (`min-[1920px]:grid-cols-6`).
- Accessible sidebar: icon rail on desktop, mobile drawer with focus trap, `Esc` to close, swipe-to-close.
- Sticky header that condenses on scroll and expands on hover/focus.
- Sortable process table and real-time clock.
- Server component fetches placeholder APIs at build time; static data fallback.
- Static export configured to `dist/`.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — Start the dev server with Turbopack
- `npm run build` — Build and export a static site to `dist/`
- `npm run lint` — Run ESLint

## Data sources

- `https://randomuser.me/api/?results=8&seed=telemetry` — team avatars/names
- `https://jsonplaceholder.typicode.com/todos?_limit=6` — pending tasks
- `https://jsonplaceholder.typicode.com/posts?_limit=6` — system logs

Fetched data is cached for 1 hour via `next.revalidate`.

## HTML proof-of-concept

The original single-file prototype lives in `docs/extended-system-telemetry-poc.html`. It was used as the design reference for this Next.js implementation.

## Deployment

The project is configured for static export. After `npm run build`, deploy the contents of `dist/` to any static host, or push the repo and import it into [Vercel](https://vercel.com).
