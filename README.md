# Cekat.AI Website

Rebuild of cekat.ai (Framer → Next.js). See [docs/PRD.md](docs/PRD.md) for the full spec and [docs/superpowers/plans](docs/superpowers/plans) for implementation plans.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui (Base UI) · next-intl (EN/ID) · @iconify/react · Vitest

## Getting started

```bash
pnpm install
pnpm dev      # http://localhost:3000 (EN) and /id (Indonesian)
```

## Scripts

- `pnpm dev` — dev server
- `pnpm build` — production build
- `pnpm start` — serve production build
- `pnpm test` — run unit tests

## Localization

- English is served at the root (`/crm`); Indonesian is prefixed (`/id/crm`).
- Copy lives in `messages/en.json` and `messages/id.json`.

## Environment

Copy `.env.example` to `.env` and fill values (see PRD §17). None are required for the Phase 1 shell.
