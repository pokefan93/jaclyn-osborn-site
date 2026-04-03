# Jaclyn Osborn Site on Cloudflare Workers + D1

This repo runs as an Astro site deployed to Cloudflare Workers with D1-backed catalog data.

The public site keeps the existing design system and page structure where practical, but the live catalog is no longer loaded from a local TypeScript file at runtime. Public pages and the `/admin` dashboard read and write catalog data through Cloudflare D1.

## Version 1 goals

- Keep the existing author-site look and public pages.
- Move catalog storage from local files to D1.
- Add a simple non-technical admin UI at `/admin`.
- Use the Astro Cloudflare adapter for Worker-based server rendering.
- Keep Stripe manual for now.
- Rely on Cloudflare Access to protect `/admin` and `/api/admin/*`.

## Architecture

- Framework: Astro + Tailwind + TypeScript
- Hosting: Cloudflare Workers
- Server runtime: Astro server output on Cloudflare Workers
- Static assets: Worker static assets binding via `ASSETS`
- Database: Cloudflare D1 via the `DB` binding
- Admin auth: external Cloudflare Access protection
- Payments: external Stripe Payment Links stored in D1

## What changed from the old static setup

- `src/data/catalog.ts` is no longer the runtime catalog source.
- Public catalog pages now query D1 through `src/lib/catalog/repository.ts`.
- The repo includes SQL migrations and a seed based on the current catalog snapshot.
- `/admin` provides simple CRUD for books without editing code.
- Stripe secret-key automation is not part of this version.

## Important runtime notes

- `src/data/catalog-data.ts` is treated as legacy seed input only.
- Schema migrations live in `migrations/`.
- Catalog seed data lives in `seeds/catalog.sql`.
- The seed is safe to re-run in the sense that it upserts by unique keys instead of inserting duplicate rows.
- Re-running the seed updates matching seeded rows, but does not automatically delete extra rows added later.
- Static Worker asset serving is configured in `wrangler.jsonc`.
- `public/.assetsignore` prevents internal Worker build artifacts from being exposed as static files.
- After the initial seed, day-to-day catalog changes should happen in `/admin`, not in source files.

## Key file tree

```text
.
|-- .node-version
|-- astro.config.mjs
|-- package.json
|-- public/
|   |-- covers/
|   `-- .assetsignore
|-- migrations/
|   |-- 0001_init.sql
|   `-- 0002_cover_alt.sql
|-- seeds/
|   `-- catalog.sql
|-- scripts/
|   `-- generate_d1_seed.mjs
|-- src/
|   |-- components/
|   |-- data/
|   |   |-- catalog-data.ts
|   |   |-- catalog.ts
|   |   `-- site.ts
|   |-- layouts/
|   |-- lib/
|   |   |-- api.ts
|   |   `-- catalog/
|   |       |-- covers.ts
|   |       |-- repository.ts
|   |       |-- shared.ts
|   |       `-- validation.ts
|   |-- pages/
|   |   |-- admin/
|   |   |   `-- index.astro
|   |   |-- api/
|   |   |   `-- admin/
|   |   |       |-- books/
|   |   |       |   |-- [id].ts
|   |   |       |   `-- reorder.ts
|   |   |       |-- books.ts
|   |   |       `-- catalog.ts
|   |   |-- about.astro
|   |   |-- books.astro
|   |   |-- contact.astro
|   |   |-- faq.astro
|   |   |-- index.astro
|   |   |-- newsletter.astro
|   |   |-- series.astro
|   |   `-- thank-you.astro
|   `-- types/
|       `-- catalog.ts
|-- worker-configuration.d.ts
`-- wrangler.jsonc
```

## Database schema

### `series`

Used for public grouping and admin series selection.

Core fields:

- `slug`
- `name`
- `lane`
- `tagline`
- `description`
- `entry_point`
- `visible`
- `sort_priority`

### `books`

Used for public rendering and admin editing.

Editable version-1 fields include:

- `title`
- `series_id`
- `series_order`
- `publish_year`
- `cover_image_url`
- `cover_alt`
- `short_blurb`
- `availability_status`
- `availability_label`
- `amazon_link`
- `retailer_link`
- `stripe_payment_link`
- `display_price`
- `signed_copy`
- `direct_from_author`
- `visible`
- `sort_priority`

### `site_settings`

Included for future lightweight site-level settings. Seeded in version 1, but not yet exposed in the admin UI.

## Local development

### Prerequisites

- Node.js `22.12.0` or newer
- npm
- A logged-in Wrangler CLI session

### First-time local setup

```sh
npm install
npx wrangler login
npm run db:migrate:local
npm run db:seed:local
npm run dev
```

Open `http://localhost:4321/`.

### Notes

- Local development uses the local D1 database, not the remote production database.
- If you change the legacy seed source and want to regenerate the SQL seed file:

```sh
npm run db:seed:generate
```

- If you re-run `npm run db:seed:local`, matching seeded rows are updated by slug or key instead of being duplicated.

## Cover image workflow

Version 1 keeps cover management intentionally simple.

The site supports two practical cover paths:

- Paste a remote image URL into the admin dashboard.
- Use a local file in `public/covers/` and either save that path explicitly or leave the field blank to fall back to the default slug-based path.

### Recommended local-path convention

If you want the simplest local workflow:

1. Add the image file to `public/covers/`.
2. Name it to match the book slug, for example `public/covers/galen.jpg`.
3. In the admin dashboard, either:
   - leave the cover image field blank so the site tries `/covers/galen.jpg`, or
   - paste `/covers/galen.jpg` explicitly if you want the stored path to be obvious in D1.

### Cover fields

- `cover_image_url`: accepts a full `https://...` URL or a site-relative path like `/covers/galen.jpg`
- `cover_alt`: optional custom alt text

If `cover_alt` is blank, the public site falls back to a sensible default like `Cover of Galen by Jaclyn Osborn`.

### Notes

- No file-upload system is included in this version.
- Real cover images keep the existing card layout and fixed aspect ratio, and missing or broken images fall back to the existing styled placeholder treatment.
- The admin dashboard shows a live preview and the resolved preview source so it is clear which image path the site will use.

## Create the D1 database

You can create the database in the Cloudflare dashboard or with Wrangler.

### Recommended CLI path

```sh
npx wrangler d1 create jaclyn-osborn-catalog
```

Wrangler will return a `database_id`. Copy that value into `wrangler.jsonc`.

Then apply the schema and seed separately:

```sh
npm run db:migrate
npm run db:seed
```

## Worker deployment setup

This repo is configured for direct Worker deployment with static assets and D1 bindings.

### Important Wrangler settings

- `main` points to `@astrojs/cloudflare/entrypoints/server`
- `assets.directory` points to `./dist`
- `assets.binding` is `ASSETS`
- `DB` is bound as a D1 database

### Why the live site was rendering unstyled

The built HTML references CSS under `/_astro/...`, and Astro's Cloudflare Worker runtime expects an `ASSETS` binding so those built files can be served in production.

If the Worker is deployed with a Pages-style Wrangler config and no Worker `assets` binding, requests such as `/_astro/BaseLayout....css` fail in production. The HTML still renders, but the stylesheet request breaks, so the site looks mostly raw and unstyled.

## Environment variables and build settings

### `SITE_URL`

Set `SITE_URL` before building so canonical URLs use your intended production hostname.

Examples:

- temporary: `https://jaclyn-osborn-site.karnestaylor.workers.dev`
- preferred: `https://www.your-domain.com`

### Node version

This repo includes `.node-version` pinned to `22.12.0`.

## Rebuild and redeploy

Run these commands from the repo root:

```sh
npm install
npm run build
npx wrangler deploy
```

If you also need to update the database first:

```sh
npm run db:migrate
npm run db:seed
npm run build
npx wrangler deploy
```

### Recommended production rebuild command

If you want the build to use the production hostname:

```sh
SITE_URL=https://jaclyn-osborn-site.karnestaylor.workers.dev npm run build
npx wrangler deploy
```

On Windows PowerShell:

```powershell
$env:SITE_URL='https://jaclyn-osborn-site.karnestaylor.workers.dev'
npm run build
npx wrangler deploy
```

## Access protection for admin routes

Version 1 assumes Cloudflare Access is the authentication layer.

Protect these paths:

- `/admin`
- `/admin/*`
- `/api/admin/*`

### Recommended setup

Use a custom domain attached to the Worker if you want the public site open while only admin routes require login.

### Why the custom domain matters

Cloudflare supports path-based Access policies through self-hosted application paths on a domain in an active Cloudflare zone. Cloudflare also supports one-click Access on `workers.dev`, but that protects the `workers.dev` endpoint itself.

Inference:

- If you want the whole site protected temporarily, `workers.dev` Access is usable.
- If you want the public site to stay open while only `/admin` and `/api/admin/*` require login, use a custom domain and path-based Access policies.

### Access setup steps

1. Add a custom domain to the Worker.
2. In Cloudflare Zero Trust, go to `Access controls` -> `Applications`.
3. Select `Add an application`.
4. Choose `Self-hosted`.
5. Create one application for your admin UI path.
6. Add a public hostname and path for `your-domain.com/admin*`.
7. Create another application or additional path coverage for `your-domain.com/api/admin/*`.
8. Add an allow policy for the specific email addresses, group, or IdP users who should manage the catalog.
9. Save the application configuration.

## Deployment workflow

### One-time bootstrap

1. Create the D1 database.
2. Paste the real `database_id` into `wrangler.jsonc`.
3. Set `SITE_URL`.
4. Run remote migrations.
5. Run the remote seed.
6. Build the site.
7. Deploy the Worker with Wrangler.
8. Add a custom domain if desired.
9. Enable Cloudflare Access for admin paths.

### Day-to-day content updates

1. Open `/admin`.
2. Edit books in the dashboard.
3. Save changes.
4. Data is written directly to D1.

No code edit or redeploy is required for normal catalog updates.

## Admin features in this version

- List all books
- Search by title or series
- Create a book
- Edit a book
- Delete a book
- Hide or show a book
- Reorder books with up/down actions
- Edit Stripe Payment Links and display prices
- Hide empty purchase options from the public site

## Public site behavior

- Public routes still use the existing UI components where practical.
- Static informational pages remain prerendered.
- Catalog-heavy routes now render dynamically from D1.
- Cover images still support existing local `/covers/...` assets.
- If a buy link is blank, the related public purchase action stays hidden.

## Production and maintenance notes

- No Stripe secret keys are used by the live site.
- Payment Links are still created and managed in Stripe manually.
- Admin operations validate input server-side with Zod.
- `site_settings` is present for future lightweight settings, but not wired into the dashboard yet.

## Manual Cloudflare dashboard checklist

You still need to configure these items manually:

- Create the real D1 database if you have not already
- Confirm the `database_id` in `wrangler.jsonc`
- Set `SITE_URL` in your local shell or CI/CD build environment
- Deploy the Worker with `wrangler deploy`
- Add a custom domain if you want path-based Access
- Configure Cloudflare Access for `/admin` and `/api/admin/*`

## Verification commands

```sh
npm run build
npm run db:migrate:local
npm run db:seed:local
npx wrangler dev
```

## Future full-domain Cloudflare rollout

When Jaclyn purchases her domain, the site moves from the `workers.dev` URL to that domain as the primary production address. The codebase is already structured for this. No application code changes are required — only `SITE_URL` needs to be updated, and one redeploy run.

### Step 1 — Add the domain to Cloudflare as an active zone

1. Log in to the Cloudflare dashboard.
2. Select **Add a site** and enter the purchased domain name.
3. Choose the free plan or higher.
4. Cloudflare will scan and import existing DNS records from the current registrar. Review them for accuracy.
5. Cloudflare will display two nameserver addresses (e.g. `ann.ns.cloudflare.com` and `brad.ns.cloudflare.com`). Note these down.

### Step 2 — Update nameservers at the registrar

1. Log in to the registrar where the domain was purchased.
2. Find the domain's nameserver settings (sometimes called "DNS" or "Name Servers").
3. Replace the existing nameservers with the two Cloudflare nameservers from step 1.
4. Save the change. Propagation typically takes a few minutes to a few hours. Cloudflare sends an email when the zone becomes active.

### Step 3 — Attach the domain to the Worker as a custom domain

1. In the Cloudflare dashboard, go to **Workers & Pages** → select `jaclyn-osborn-site`.
2. Go to **Settings** → **Domains & Routes**.
3. Click **Add** → **Custom Domain**.
4. Enter the domain (e.g. `jaclynosbornbooks.com`).
5. Cloudflare automatically creates the DNS record and issues a TLS certificate for the domain.
6. Wait for the certificate status to show as active (usually a few minutes).

If you want both the apex (`jaclynosbornbooks.com`) and `www.jaclynosbornbooks.com` to route to the Worker, add both as custom domains in this step, or add a CNAME for `www` pointing to the apex in Cloudflare DNS.

There is no Firebase or external origin involved. The Worker is the direct origin for this domain.

### Step 4 — Update SITE_URL and redeploy

Set `SITE_URL` to the new production domain and rebuild:

```sh
SITE_URL=https://jaclynosbornbooks.com npm run build
npx wrangler deploy
```

On Windows PowerShell:

```powershell
$env:SITE_URL='https://jaclynosbornbooks.com'
npm run build
npx wrangler deploy
```

This bakes the correct canonical URLs, Open Graph tags, sitemap, and robots.txt Sitemap reference into the deployed build. No other code changes are needed.

### Step 5 — Verify after domain switch

- Visit the new domain in a browser and confirm the site loads correctly.
- Check `https://your-domain.com/robots.txt` — the `Sitemap:` line should reference the new domain.
- Check `https://your-domain.com/sitemap.xml` — all `<loc>` entries should reference the new domain.
- View page source and confirm `<link rel="canonical">` and `<meta property="og:url">` show the new domain.
- Confirm `/admin` loads and the admin dashboard is functional.
- Confirm SSL shows a valid certificate for the domain.

### Step 6 — Disable the workers.dev endpoint (optional, after domain is stable)

To prevent duplicate indexing by search engines, disable the `workers.dev` endpoint once the custom domain is confirmed working:

1. In the Cloudflare dashboard, go to **Workers & Pages** → `jaclyn-osborn-site`.
2. Go to **Settings** → **Domains & Routes**.
3. Toggle off the `workers.dev` route.

After this, the site is only accessible from the custom domain.

---

## Future Cloudflare Access setup for admin routes

The admin dashboard at `/admin` and the admin API at `/api/admin/*` are intended to be protected by Cloudflare Access. Access is an external authentication layer — no username or password login UI exists in the app itself.

**Path-based Access protection requires a custom domain in an active Cloudflare zone.** The `workers.dev` endpoint supports Access, but only as an all-or-nothing lockout of the entire site. For a setup where the public site stays open and only `/admin` requires login, a custom domain is required first.

### Admin route structure (ready now)

The following routes are already structured for future Access protection:

- `/admin` — admin dashboard
- `/admin/*` — any admin sub-pages
- `/api/admin/*` — all admin API endpoints

These are also included in `run_worker_first` in `wrangler.jsonc`, so they always go through the Worker and are never served as static files.

### Setup steps (perform after the custom domain is live)

1. In the Cloudflare dashboard, go to **Zero Trust** → **Access** → **Applications**.
2. Click **Add an application** → **Self-hosted**.
3. Configure the admin UI application:
   - Application name: `Jaclyn Admin`
   - Session duration: 24 hours or as preferred
   - Public hostname: `your-domain.com`
   - Path: `admin*`
4. Add an allow policy:
   - Policy name: `Admin users`
   - Action: Allow
   - Rule: Emails — enter the specific email address(es) that should have access
5. Save the application.
6. Add a second application (or additional path) for the API if needed:
   - Public hostname: `your-domain.com`
   - Path: `api/admin/*`
   - Use the same allow policy
7. Test: visit `https://your-domain.com/admin` in a fresh browser session — you should see the Cloudflare Access login prompt.
8. After authenticating with an allowed email, you should land on the admin dashboard.

### Notes

- The app has no in-app session or login UI. Cloudflare Access provides authentication entirely.
- If Jaclyn is the only admin, an email allow list is the simplest and most reliable Access policy.
- The `SESSION` KV binding in `wrangler.jsonc` is present for potential future use and does not affect current Access-based auth.

---

## Reference docs used for the Worker deployment notes

- Astro Cloudflare adapter: `https://docs.astro.build/en/guides/integrations-guide/cloudflare/`
- Wrangler configuration and static assets: `https://developers.cloudflare.com/workers/wrangler/configuration/`
- Cloudflare D1 getting started: `https://developers.cloudflare.com/d1/get-started/`
- Cloudflare D1 local development: `https://developers.cloudflare.com/d1/build-with-d1/local-development/`
- Cloudflare Access application paths: `https://developers.cloudflare.com/cloudflare-one/access-controls/policies/app-paths/`
- Cloudflare Access self-hosted applications: `https://developers.cloudflare.com/cloudflare-one/applications/configure-apps/self-hosted-apps/`
- Cloudflare Workers `workers.dev` access control: `https://developers.cloudflare.com/workers/configuration/routing/workers-dev/`
- Cloudflare custom domains for Workers: `https://developers.cloudflare.com/workers/configuration/routing/custom-domains/`
- Cloudflare SSL/TLS certificates: `https://developers.cloudflare.com/ssl/`
