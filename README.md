# Sabai Shop

A production-quality **demo storefront** for a small online shop, inspired by
Facebook / Page365-style single-vendor stores. It ships with a curated sample
catalog, a shopping cart, a no-payment checkout, a lightweight **admin panel**
(products + orders), full **English / Lao** bilingual UI, dark mode, and SEO.

- **Live demo:** https://sabai-shop.vercel.app
- **Admin:** https://sabai-shop.vercel.app/admin (passcode: `admin`)

> **This is a portfolio/demo clone.** The brand ("Sabai Shop"), products, prices,
> phone number and email are all **placeholders** — not a real business. There is
> no online payment and no real backend; orders are saved in the browser.

---

## Features

**Storefront**

- Home page with hero, category grid, featured & new-arrival sections
- Product listing with **search**, **category filter** and **sorting** (URL-shareable)
- Product detail page: image gallery, price + promo badge, stock, related products
- Category pages
- Cart (slide-out sheet + full page) with quantity steppers
- Checkout with validated form → generated order ID → success page
- About, Contact (WhatsApp / Messenger / Instagram / phone / email), Privacy, Terms
- Custom 404

**Admin panel** (`/admin`, passcode-gated)

- Dashboard with product / category / order counts and total revenue
- Product **CRUD** (create, edit, delete) via a side sheet — bilingual fields
- Order management: view line items & customer details, change status, export CSV
- **Export / Import** the whole catalog as JSON, and reset to defaults

**Platform**

- Bilingual **English + Lao** with a toggle (persisted per browser)
- **LAK** currency formatting (`179,000 LAK`, integer)
- Light / dark theme (`next-themes`)
- SEO: per-page metadata, OpenGraph, JSON-LD (WebSite / Product / Breadcrumb),
  `sitemap.xml`, `robots.txt`, web manifest, favicon
- Responsive, mobile-first, accessible (semantic HTML, keyboard-friendly)
- Deploys to **Vercel, Netlify, Cloudflare Pages, or GitHub Pages** (static export)

---

## Tech stack

| Concern            | Choice                                        |
| ------------------ | --------------------------------------------- |
| Framework          | Next.js 16 (App Router) + React 19            |
| Language           | TypeScript (strict)                           |
| Styling            | Tailwind CSS v4                               |
| UI components      | shadcn/ui (on Base UI) + Lucide icons         |
| Forms / validation | React Hook Form + Zod                         |
| State              | Zustand (+ `localStorage` persistence)        |
| Animation          | Framer Motion                                 |
| Theme              | next-themes                                   |
| Toasts             | Sonner                                        |

---

## Getting started

**Prerequisites:** Node.js 20+ and npm.

```bash
npm install          # install dependencies
npm run dev          # start the dev server → http://localhost:3000
```

Optional configuration lives in `.env.local` (copy from `.env.example`):

```bash
cp .env.example .env.local
```

### Scripts

| Script                 | What it does                                                   |
| ---------------------- | -------------------------------------------------------------- |
| `npm run dev`          | Start the development server                                   |
| `npm run build`        | Production build (SSR — for Vercel/Netlify/Cloudflare)         |
| `npm start`            | Serve the production build locally                             |
| `npm run export`       | **Static** export to `./out` (for GitHub Pages / any static host) |
| `npm run lint`         | Run ESLint                                                     |
| `npm run placeholders` | Regenerate the SVG product/brand images from the catalog       |

---

## Configuration

Almost everything is driven from a few files — no code changes needed for basic
rebranding.

### Branding, contact & currency — `src/lib/config.ts`

Edit `siteConfig` to change the shop name (EN + Lao), tagline, about text, URL,
OG image, currency, and all contact channels (phone, email, Messenger username,
Instagram handle, address). Every component reads from here.

### Products & categories — `src/data/catalog.json`

The seed catalog (6 categories, 24 products). Each product has bilingual
name/description, `price`, optional `fullPrice` (shows a strike-through + promo
badge), `images`, `stock`, `featured`, and `createdAt`. To add a product, add a
JSON entry and drop matching images in `public/products/` (or point `images` at
any URL). You can also manage products live from the admin panel and export the
result back to this file (see below).

### Admin passcode — `.env.local`

```bash
NEXT_PUBLIC_ADMIN_PASSCODE=your-passcode   # defaults to "admin"
```

> This is a **client-side gate for a demo**, not real authentication (the value
> ships in the client bundle). Don't put anything sensitive behind it.

---

## Admin panel & data model

Open **`/admin`** (also linked in the mobile menu) and enter the passcode.

Because there is **no backend**, all mutable state lives in the visitor's
browser via `localStorage` / `sessionStorage`:

- `store/cart.ts` — the shopping cart
- `store/orders.ts` — placed orders (what the admin "Orders" tab reads)
- `store/catalog.ts` — admin edits to products/categories, layered over the JSON seed

**Implication:** edits and orders are **per-browser** and are not shared between
devices or visitors. This is intentional for a zero-cost demo. To publish
product changes for everyone, use the admin **Export catalog JSON** button and
commit the file to `src/data/catalog.json`.

### Upgrade path to real persistence

When you outgrow `localStorage`, the data layer is isolated enough to swap in:

- **Git-based CMS** (Keystatic / Decap) editing `catalog.json` — keeps static hosting
- **Serverless DB** (Supabase, Turso, Neon, Upstash) + Next.js Route Handlers /
  Server Actions for orders — requires an SSR host (Vercel/Netlify/Cloudflare)
- **Email notifications** (Resend / EmailJS) wired into the checkout submit

---

## Internationalization

A small custom i18n layer (no heavy dependency):

- `src/lib/i18n/dictionaries.ts` — the `en` dictionary is the source of truth;
  `lo` mirrors its shape (TypeScript enforces that both stay in sync).
- `src/lib/i18n/index.tsx` — `I18nProvider` + `useI18n()` hook exposing
  `locale`, `setLocale`, `toggleLocale`, and `t` (the active dictionary).

The chosen locale is stored per browser and sets `<html lang>`.

---

## Deployment

The app builds two ways. Pick based on your host.

### Vercel / Netlify / Cloudflare Pages (recommended — SSR)

Zero config. Import the repo; the platform auto-detects Next.js.

- **Build command:** `npm run build`
- **Output:** framework default (leave as detected)
- **Env vars:** optionally set `NEXT_PUBLIC_ADMIN_PASSCODE`

Update `siteConfig.url` in `src/lib/config.ts` to your final domain so canonical
URLs, the sitemap and OpenGraph tags are correct.

### GitHub Pages (static export — free, no server)

A workflow is included at `.github/workflows/deploy.yml`. It builds a static
export and publishes it on every push to `main`.

1. Push the repo to GitHub.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
3. Push to `main` (or run the workflow manually). Done.

The workflow sets `NEXT_PUBLIC_BASE_PATH=/<repo-name>` automatically for project
sites (`https://<user>.github.io/<repo>`). For a user site or custom domain,
set that variable to an empty string.

To reproduce the static build locally:

```bash
npm run export        # → ./out
npx serve out         # preview the static site
```

Because it's a static export, admin edits/orders still work (they're
client-side), but there is no server — which is exactly what this demo needs.

---

## Architecture

Server Components render static content and SEO; Client Components (marked
`"use client"`) own all interactivity and browser-persisted state.

```
                         ┌───────────────────────────────────────┐
                         │  Build-time data (static)              │
                         │  src/data/catalog.json ─► src/lib/data │
                         └───────────────────┬───────────────────┘
                                             │ (server components read at build)
                 ┌───────────────────────────┴───────────────────────────┐
                 │                    Next.js App Router                   │
                 │  app/*  (pages, layout, sitemap, robots, manifest)      │
                 │   ├─ Server Components → static HTML + JSON-LD/SEO       │
                 │   └─ Client Components ("use client")                    │
                 └───────────────────────────┬───────────────────────────┘
                                             │
              ┌──────────────────────────────┼──────────────────────────────┐
              │                              │                              │
      ┌───────┴────────┐           ┌─────────┴────────┐          ┌──────────┴─────────┐
      │  UI providers  │           │  Zustand stores  │          │   i18n + theme     │
      │ shadcn/Base UI │           │  cart / orders / │◄────────►│  EN·Lao · dark     │
      │  Tailwind v4   │           │     catalog      │          │  (localStorage)    │
      └────────────────┘           └─────────┬────────┘          └────────────────────┘
                                             │  persisted in localStorage
                                   ┌─────────┴──────────┐
                                   │  /admin panel      │
                                   │  products + orders │
                                   │  JSON export/import│
                                   └────────────────────┘
```

### Project structure

```
src/
├─ app/                    # App Router: pages, layout, SEO routes
│  ├─ page.tsx             # Home
│  ├─ products/            # Listing + [slug] detail (SSG)
│  ├─ categories/          # Listing + [slug] (SSG)
│  ├─ cart/ checkout/      # Cart + checkout
│  ├─ order/success/       # Order confirmation
│  ├─ about/ contact/ privacy/ terms/
│  ├─ admin/               # Admin entry
│  ├─ sitemap.ts robots.ts manifest.ts   # SEO
│  └─ layout.tsx globals.css not-found.tsx
├─ components/
│  ├─ home/ product/ category/ cart/ checkout/ order/ contact/ about/
│  ├─ admin/              # Dashboard, product form, product & order tables
│  ├─ layout/             # Header, footer, container, cart sheet
│  └─ ui/                 # shadcn/ui primitives
├─ lib/
│  ├─ config.ts           # Branding, contact, currency (single source of truth)
│  ├─ data.ts             # Catalog access + filter/sort helpers
│  ├─ types.ts            # Domain types (+ localized() helper)
│  ├─ format.ts           # Price / link / order-id formatting
│  ├─ validation.ts       # Zod schemas
│  ├─ seo.ts              # JSON-LD builders
│  └─ i18n/               # Dictionaries + provider/hook
├─ store/                 # Zustand stores (cart, orders, catalog)
├─ hooks/                 # use-hydrated
└─ data/catalog.json      # Seed catalog
scripts/generate-placeholders.mjs   # SVG image generator
public/                   # Generated SVGs, logo, og image, favicon
.github/workflows/deploy.yml        # GitHub Pages CI
```

---

## Known limitations (by design)

- **No real payment / backend.** Checkout only records an order locally and shows
  a confirmation — matching the original store's chat-to-order model.
- **Per-browser data.** Orders and admin edits don't sync across devices; see
  the upgrade path above.
- **Demo admin gate.** The passcode is client-side only.

## License

MIT — sample content and images are placeholders for demonstration only.
