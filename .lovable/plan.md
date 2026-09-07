# Replix AI — Ad Studio (demo prototype)

A polished, client-facing demo of an ad-creative generation tool for Shopify sellers. Everything runs on rich mock data: no real sign-up, no payments, no live image generation. A logged-in seller ("Nadia at Lumen Goods", store: lumen-goods.myshopify.com) is assumed throughout.

## Screens

1. **Dashboard (/)** — greeting, store connection badge, credit meter, recent generated ad sets, quick "New ad" entry, performance snapshot cards.
2. **Products (/products)** — mock Shopify catalog grid (12–16 products with images, price, tags), search + filter, "Generate ads" action per product.
3. **Generate (/generate)** — the centrepiece flow: pick product, pick objective (awareness / conversion / retargeting), pick platform + format (Feed 1:1, Story 9:16, Reels), tone and brand-voice controls, then a fake "generating" state with staged progress that resolves into a set of ad variants (image + headline + primary text + CTA).
4. **Creative detail (/creatives/$id)** — large preview mockup inside a phone/feed frame, copy variants list with copy-to-clipboard, edit-in-place text, predicted-performance chips, version history.
5. **Library (/library)** — all saved creatives, filter by product / platform / status (draft, approved, published), bulk select, export mock.
6. **Campaigns (/campaigns)** — mock campaign list with spend, ROAS, CTR, small trend charts.
7. **Brand kit (/brand)** — logo, palette, fonts, tone-of-voice presets, do/don't phrases.
8. **Settings (/settings)** — profile, store connection, plan/credits display (read-only, no checkout).

Shared app shell: collapsible sidebar nav, top bar with store switcher, credits, and avatar menu (with a fake "Sign out" that just returns to the dashboard).

## Design

Before building, I'll generate three visual directions as clickable previews for you to pick from — since no palette or style was specified, the look should be a deliberate choice, not a default. The chosen direction's colors, type, and layout carry into the app's design tokens.

## Technical notes

- TanStack Start route files per screen, shadcn/ui components, Tailwind v4 tokens in `src/styles.css`.
- Mock data in `src/data/*` (products, creatives, campaigns, brand kit, user) with typed models; client-side state via React context + TanStack Query against mock async functions so loading/success states feel real.
- Generation is simulated with timed staged progress and pre-written copy variants; creative imagery uses generated assets stored in `src/assets/`.
- Edits, approvals, and saves persist in memory for the session only.
- Per-route `head()` metadata with unique titles/descriptions.

## Out of scope

Real auth, real payments, real Shopify API, real AI calls. Can be added later on Lovable Cloud.
