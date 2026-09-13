# Replix AI full UI redesign

## Approach
Rebuild the approved interface in reviewable stages, preserving the existing TanStack routes, real ad generation, saved ads, credit usage, and Shopify-backed product flow. The uploaded reference implementation will be used only as a visual and copy guide; its React Router/Vite code will not be copied into the app.

## Delivery sequence
Each stage will be implemented, verified at desktop and mobile sizes, and shown for approval before the next stage begins.

1. **Global navigation shell**
   - Replace the left sidebar with the shared top navigation: Replix mark and wordmark, six route links, and a gradient **Generate Ads** action.
   - Add the live `remaining/total FREE` credit pill to page headers.
   - Keep all current URLs working, including `/create`, `/gallery`, `/campaigns`, `/analytics`, `/billing`, `/pricing`, `/help`, and `/collections`.
   - Add a compact mobile navigation without changing desktop structure.

2. **Dashboard — connected and not-connected states**
   - Match the headline, Shopify connection banner, best-seller grid, upload/URL entry cards, recent generated ads, and referral card.
   - Use real products, saved ads, connection state, and live credits where data already exists.

3. **Generate Ads — product picker and inner workspace**
   - Restyle both the outer product-selection view and the inner analysis/theme/generation workspace.
   - Add the Product URL visual entry point only where existing logic supports it; preserve upload validation, AI analysis, theme selection, generation, per-card regeneration, persistence, and credit spending.
   - Keep the existing ten original theme thumbnails and real `AdCard` behavior.

4. **My Creatives**
   - Match the Figma filters and creative grid while preserving live saved ads, platform filtering, search where retained, editing, downloading, favoriting, and previews.

5. **My Campaigns / Collections**
   - Replace the placeholder with the approved empty and filled campaign-folder presentation.
   - Derive folder counts and previews from existing collections and saved ads rather than static mock campaign totals.
   - Keep `/collections` working as a compatible entry to the same underlying collection data.

6. **Analytics**
   - Build the credit usage, current plan, ads generated, monthly usage, and referrals layout.
   - Bind available values to the existing studio state; clearly retain zero/default referral values where no referral backend exists.

7. **Pricing & Billing**
   - Apply the approved launch-offer, pricing-plan, and billing presentation.
   - Keep payments non-functional as required by the current demo and preserve both `/pricing` and `/billing` routes.

8. **Help**
   - Rebuild the searchable, category-filtered FAQ experience and support panel using the existing accordion/design-system controls.

## Shared implementation details
- Extend `src/styles.css` only with semantic tokens/utilities required by the approved navy, gold, and off-white design.
- Reuse existing shadcn controls and the production `AdCard`; add small shared pieces only for the navbar, page header/credit pill, product card, and campaign folder card.
- Adapt approved reference imagery through the project asset flow where it is part of the final interface; do not import the standalone app structure or routing.
- Keep every leaf route’s existing unique metadata complete.

## Verification for every stage
- Check the route visually at desktop and mobile widths.
- Exercise its interactive controls and confirm no browser errors.
- For Generate Ads, run the existing product analysis and generation flow only when validating that stage, so credits are not consumed during unrelated visual work.
