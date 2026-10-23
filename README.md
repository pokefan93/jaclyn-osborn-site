# Jaclyn Osborn author website

Astro 7 on Cloudflare Workers, with D1 for books, series, editable page content, and uploaded images. Public pages render HTML on the server. No React runtime, third-party font request, or social embed is needed for the public site.

## Local development

Node 24 is recommended. Run:

```sh
npm ci
npm run db:migrate:local
npm run db:seed:local
npm run dev -- --host 127.0.0.1
```

Open http://127.0.0.1:4321/. The editor is http://127.0.0.1:4321/admin/.
The development server bypasses Access only in development mode on loopback hostnames. Never expose the development server publicly. Production builds require a valid Access JWT even on loopback.

```sh
npm run build
npm run images:optimize
npm audit
node --test tests/site.integration.mjs
```

Integration tests require a seeded LOCAL development server on port 4321. They temporarily edit local content and restore it. They never accept a remote hostname.

## Author editing

- **Books:** add, edit, hide, reorder, or delete books; edit full descriptions, short blurbs, genres, formats, covers, alt text, retail links, direct purchase links, prices, and availability.
- **Pages & settings:** homepage feature, announcements, page headings and introductions, author biography/photo, newsletter destination, social link, contact addresses, search title/description, and FAQs.
- **Series:** create and edit series, reading-guide text, visibility and display order. Hiding a series does not automatically hide its books.
- **Images:** upload JPG/PNG/WebP files up to 1 MB; copy the returned URL into the cover or author photo field. Images are immutable and stored in D1. SVG/HTML uploads are rejected.

Save changes to publish them to the site's database. There is no draft/publish approval layer. Book slugs stay stable after renaming to preserve links. Code/layout changes still require development and deployment; this is a content editor, not a drag-and-drop page builder.

Uploaded media is public by URL. Do not upload private documents. Local cover assets have pre-generated responsive WebP variants at 240/480/720px; originals remain as fallback. After replacing a local cover, rerun `npm run images:optimize` and commit both the generated assets and manifest. Remote or uploaded covers are served as supplied; keep them small.

## Authentication and Taylor's Tech Solutions

Taylor's Tech Solutions uses Firebase sign-in on both its client portal and Expo app. The new `/api/portal/*` endpoints use the same Firebase bearer token and the existing `tts-control` role registry. Every request calls the `CONTROL` service binding's `/api/control/authorize?siteId=jaclyn`: no cached role grants, shared browser secret, new login, or automatic owner assignment. Missing configuration and authorization failures deny access. Viewers can read; editors can save; deleting books requires the owner role. The separate `/admin` fallback remains protected by Cloudflare Access.

Portal page settings, FAQs, series, covers, books, prices and payment links all write the D1 data used by the public pages. Multiple Payhip/retailer/Stripe links and format prices are preserved. Saving changes is immediate for the next page request. It does not push changes into a visitor's already-open page. This is a content editor, not a visual layout builder.

Changing a displayed price does not change the payment-provider checkout amount. Update the provider amount and matching link together. Seed Stripe test links are suppressed from public pages.

### Coordinated release

This release requires changes in four repositories:

1. `tts-control`: deploy the read-only authorization endpoint first. Existing active account and exact site membership are required; disabled/deleted accounts and revoked memberships are denied. It does not provision Jaclyn's account.
2. `jaclyn-osborn-site`: back up and compare the current `jaclyn-portal` content and the production catalog before switching editors. The old portal is a separate service and may contain author edits absent from this historical seed. Import reviewed differences; do **not** reseed production. Apply migrations 0003 and 0004 (additive media table and book details column), build, and deploy with the `CONTROL` binding to `tts-control`.
3. `taylorstechsolutions`: publish only the reviewed `portal.html` from the business-site-refresh branch, preserving the rest of the live Firebase Hosting release. Jaclyn's API destination points to her public site's new API; other clients keep their existing destination.
4. `tts-app`: release the app changes through the existing Expo/store release process. Older installed versions continue using `jaclyn-portal` until updated. Do not retire that service until users have updated and existing data is reconciled.
5. Test a real assigned owner, editor, viewer and unrelated account against the live site. Verify edits, upload, hidden-book removal and sign-out. Confirm Jaclyn's contact addresses, newsletter URL, and checkout links before launch.

For the optional standalone `/admin` editor, configure an Access application protecting `/admin` and `/api/admin` on every hostname, with runtime `ACCESS_TEAM_DOMAIN` and `ACCESS_AUD`. Without those it stays closed in production; the TTS portal does not require them.

No production database writes, account provisioning, hosting deployment, or store release have been performed. The Firebase connection was suggested; Cloudflare CLI is not authenticated. These remain release gates, not completed steps.

### Portal integration tests

After `npm run build` and local migrations, run the built site and its **local-only** control-service test double in one process:

```sh
npx wrangler dev --config dist/_worker.js/wrangler.json --config tests/fixtures/wrangler.jsonc --local --port 8787 --persist-to .wrangler/state
node --test tests/portal.integration.mjs
```

Never deploy `tests/fixtures/wrangler.jsonc`. The test double supplies roles only in the local multi-worker test process; production verifies Firebase identity in the real control service. Tests are fixed to loopback, restore edited records, and remove the temporary book they create. They cover tenant isolation, role enforcement, unsafe links, persistence, prices, multiple purchase links, stable book URLs, FAQs, series and sitemap visibility.

## Domain and SEO

`SITE_URL` is a build-time variable in `astro.config.mjs`. It defaults to the existing Cloudflare hostname. When the custom domain is ready, set it to the canonical HTTPS origin, rebuild, redirect the old public hostname, and submit `/sitemap.xml` in Search Console.

The sitemap is generated from visible books and public pages. Each visible book has `/books/{slug}/`, its own title/description, and Book JSON-LD. Hidden or missing books return 404. The base layout supplies canonical URLs, author/WebSite metadata, Open Graph/Twitter images, and noindex for the editor, error pages and checkout acknowledgement. Book markup does not imply eligibility for Google's restricted book-action program, and no ranking/rich-result guarantee is made.

The legacy newsletter was an email draft, not a subscription integration. Set the real provider-hosted signup URL in Pages & settings. Until then, the site explicitly labels the email enquiry and does not claim anyone subscribed. The historical contact addresses also need owner verification.

The old workbook/Google Apps Script utilities and seed source remain in the repository for reference. They are not the runtime source of truth and are not run by CI.
