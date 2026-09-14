# Replix client handoff: two safe integration packages

## Goal
Deliver two ZIP packages the client can upload to their existing Lovable project, each with a copy-paste installation prompt and clear instructions. The client’s existing authentication, admin system, live Shopify connection, payments, user data, credits, and unrelated functionality remain the source of truth.

The new work wins only for:
- AI ad generation and its Generate Ads workflow
- The approved Replix UI/design across the customer-facing screens

Compliance is excluded because it was a typo. No admin system will be rebuilt or exported from this prototype.

## Important constraint
The client’s project is not accessible from this workspace. The install prompts must therefore begin by auditing that project before editing it, map its existing routes/data/auth/admin integrations, and stop for conflicts that cannot be resolved safely. They must never overwrite generated backend clients, credentials, authentication, admin access, payment logic, live Shopify logic, or existing production records.

## Package 1 — AI Ad Generation System
Create an integration-ready ZIP containing:

1. **Portable generation code**
   - Product intake from live Shopify products, image upload, and product URL.
   - 10MB upload validation and 2048px longest-edge normalization.
   - Product URL resolution with direct-image support, metadata/JSON-LD discovery, redirect handling, and blocked-page fallback.
   - Product-photo analysis and editable product insights.
   - Theme-aware copy generation.
   - Genuine reference-image ad generation with locked product identity, packaging, logo, wording, and colours.
   - Text rendered inside generated images, multiple formats/concept counts, regeneration, saving, and signed image access.

2. **Prompts as editable source files**
   - Vision/product-analysis system and user prompts.
   - Ad-copy prompt and per-theme copy rules.
   - Image-generation prompt and locked-reference requirements.
   - A prompt customization guide showing exactly what the client may change without breaking the request schemas.

3. **Backend integration templates**
   - Database/storage migration template for generated ads.
   - Production-safe ownership fields, grants, and row-level access templates instead of this demo’s anonymous policies.
   - Repository adapter interfaces so the client project can connect generation to its existing users, credits, products, and storage.
   - Dependency and environment-variable manifest without secret values.

4. **Installation prompt for Lovable**
   - Inspect the target project first.
   - Preserve existing auth, admin, Shopify, payments, credits, and database conventions.
   - Reuse the target project’s generated backend clients and server setup.
   - Merge the generation functions and UI into the target’s existing routes rather than replacing the application wholesale.
   - Apply schema changes only after checking for existing equivalent tables/columns.
   - Verify all three intake paths, generation, regeneration, persistence, ownership, and credit charging.

## Package 2 — Approved UI System
Create a separate integration-ready ZIP containing:

1. **Visual system**
   - Replix tokens, white dotted background, navy/gold palette, approved gradient, Archivo headings, and Inter Tight body text.
   - Approved logo, icons, campaign artwork, theme thumbnails, and other required assets as real portable files.
   - Reusable shell, page header, credits pill, buttons, product cards, ad cards, campaign cards/dialogs, empty states, and loading states.

2. **Screen implementations**
   - Dashboard
   - Generate Ads outer picker and inner workspace
   - My Creatives
   - My Campaigns list, create/edit/delete/add-creatives flows, and campaign detail
   - Analytics
   - Pricing & Billing
   - Help/FAQ

3. **Target-project adapters**
   - Presentational components receive data/actions from the client project instead of importing Zaffo demo state.
   - Route mapping guide so the client can retain its current URLs where required.
   - Explicit mappings for live credits, products, ads, campaigns, analytics, store status, and account plan.
   - No replacement of the client’s admin routes or internal admin design.

4. **Installation prompt for Lovable**
   - Audit the target design system, routes, providers, and live data bindings first.
   - Apply the approved customer-facing UI while retaining all production behavior.
   - Replace demo data with the target’s existing live sources.
   - Preserve the client’s admin area and any screens not named in this package.
   - Verify desktop/mobile layout, navigation, loading/error/empty states, and every interactive control.

## Handoff documentation
Include with the two ZIPs:

- `START-HERE.md`: which ZIP to install first, where to upload it, and which prompt to paste.
- `TARGET-PROJECT-PREFLIGHT.md`: backup/remix recommendation and the facts Lovable must inspect before changes.
- `FEATURE-OWNERSHIP.md`: new generation/UI wins; existing admin/auth/Shopify/payments/credits/data win.
- `FILE-MANIFEST.md`: every included file, purpose, destination pattern, and dependencies.
- `DATA-MAPPING.md`: target entities needed for users, products, ads, campaigns, credits, and plans.
- `MIGRATION-SAFETY.md`: schema conflict checks, data preservation, rollback, and no destructive migrations.
- `VERIFICATION-CHECKLIST.md`: end-to-end tests and acceptance criteria.
- `CLIENT-HANDOFF.md`: a short, non-technical step-by-step client delivery summary.

## Packaging rules
- Do not include demo-only Zaffo product records as production data.
- Do not include this project’s generated backend client files, secret values, `.lovable` metadata, or platform error-reporting files.
- Do not ship the current anonymous database policies as production migrations.
- Keep Lovable AI calls server-side and use the target Lovable project’s managed AI key.
- Keep all assets local to the package; do not rely on this project’s asset-pointer URLs.
- Use versioned migration names and avoid replacing existing target files unless the installation prompt has inspected them.

## Verification before delivery
1. Audit every exported file and dependency.
2. Inspect both ZIP contents after creation and confirm no secrets or project-specific backend identifiers are present.
3. Validate the generation package in this project: upload, URL, Shopify-source handoff, analysis, themes, generation, regeneration, persistence, and errors.
4. Validate the UI package across all customer-facing routes at desktop and mobile sizes.
5. Confirm the instructions explicitly preserve the unavailable client admin system and existing production integrations.
6. Produce both ZIPs and the concise client handoff document as downloadable files.

## Installation order for the client
1. Remix or back up the live Lovable project.
2. Upload the AI Ad Generation System ZIP and paste its installation prompt.
3. Test generation against the live project’s users, Shopify products, credits, and storage.
4. Upload the Approved UI System ZIP and paste its installation prompt.
5. Run the supplied acceptance checklist before publishing.
