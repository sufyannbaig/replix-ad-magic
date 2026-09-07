# Replix AI — Ad Studio (demo prototype)

A client-facing demo of an ad-creative tool for Shopify sellers. Rich mock data, no real sign-in, no payments, no live generation. The store "Zaffo Coffee" is already linked, shown as a "Connected to zaffo-coffee.myshopify.com" badge.

## Look and feel

- Deep navy #12213D for the sidebar and headers, warm gold #E8A93B as the single accent (primary buttons, highlights), soft off-white #FAF8F3 canvas, slate gray secondary text, muted green for "winning/favorited" tags.
- Confident geometric sans for headings, clean readable sans for body.
- Rounded-xl cards, soft shadows, generous whitespace.

## Layout

Persistent left sidebar: Dashboard, Create Ad, Ad Gallery, Collections, Pricing, Billing, Help. Credits badge pinned in the sidebar footer on every screen. Logged-in user shown in the header, no real auth.

## Screens

**1. Dashboard** — welcome header with the user's name; credits meter "89 / 100 free ads remaining" as a progress bar; large "Generate Your Next Winning Ad" CTA card; four stat tiles: Ads Generated, Instagram Creatives, Facebook Creatives, Current Plan.

**2. Create Ad wizard (centerpiece)** — four steps with a progress indicator.

- Step 1 "Pick a product": grid of the four Zaffo Coffee products ranked by best-seller, one-click select. Chocolate Raspberry Truffle, Iced Vanilla Cream Drizzle, Cookie Dough, White Chocolate Mocha — all $35.99, each with its own product photo.
- Step 2 "Understanding your product" (signature moment): three items tick off one at a time with a delay and a checkmark animation — "Reading product photo", "Extracting colors, materials and claims", "Finding the strongest selling angle" — taking a deliberate 3–4 seconds minimum, no skipping. Then a "Here's what we found" card reveals 3–4 short, product-specific insights (a convenience angle, an ingredient story, a best-fit audience).
- Step 3 "Choose your angle": one objective from Product Launch, Sale/Discount, New Collection, Brand Awareness, Retargeting; multi-select up to 3 theme cards, each stating its selling logic in one line (Product Showcase — let the product be the hero; Statistics and Social Proof — borrow trust from numbers; Testimonial — let a happy customer sell it; Us vs Them — position against the old way); format chips for 1:1, 4:5, 9:16.
- Step 4 "Generate": batch size 3 / 5 / 10 (default 5) with the note that we generate more than you need because the first couple are warm-ups — pick your favorites. A generation-progress state, then a results grid of concept cards. Each card: a distinct hero image (different scene or angle per card, never a repeated crop), "Target audience:", "Core idea:" one-liner, headline/hook, caption copy, CTA button text; icon actions for Regenerate, Edit copy, Download, Push to Instagram/Facebook (opens a small platform-preview modal), and a favorite/star toggle. "Generate 5 more" button below the grid.

**3. Ad Gallery** — grid of 8–10 seeded past ads across Instagram and Facebook, search bar, platform filter tabs (All / Instagram / Facebook), stat tiles for Total Ads, Instagram, Facebook.

**4. Collections** — two seeded folders, each showing its saved ads.

**5. Pricing** and **6. Billing** — simple minimal placeholder pages. **Help** — short placeholder.

## Technical notes

- TanStack Start route file per screen, shadcn/ui components, brand tokens defined in `src/styles.css` (Tailwind v4 `@theme inline`), fonts loaded via a `<link>` in the root route.
- Typed mock data in `src/data/*` (user, store, products, seeded ads, collections, insights and copy variants per product/theme); session-only in-memory state for favorites, edits, and newly generated ads via a React context.
- Wizard staging and generation use timed steps for a real-feeling pace; imagery is generated ad/product art saved under `src/assets/`, with a distinct image per concept card.
- Unique per-route `head()` title and description.

## Out of scope

Real auth, payments, Shopify API, and AI calls — all can be added later on Lovable Cloud.
