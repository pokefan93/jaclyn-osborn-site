# Jaclyn Osborn Site on Cloudflare Pages + D1

This repo now runs as a Cloudflare-first Astro site.

The public site keeps the existing design system and page structure where practical, but the live catalog is no longer loaded from a local TypeScript file at runtime. Public pages and the new `/admin` dashboard now read and write catalog data through Cloudflare D1.

## Version 1 goals

- Keep the existing author-site look and public pages.
- Move catalog storage from local files to D1.
- Add a simple non-technical admin UI at `/admin`.
- Use Pages Functions for server-side catalog reads and admin APIs.
- Keep Stripe manual for now.
- Rely on Cloudflare Access to protect `/admin` and `/api/admin/*`.

## Architecture

- Framework: Astro + Tailwind + TypeScript
- Hosting: Cloudflare Pages
- Server runtime: Astro server output on Pages Functions
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

- `src/data/catalog-data.ts` is now treated as legacy seed input only.
- `migrations/0002_seed_catalog.sql` is a bootstrap seed. Re-running it will replace the current catalog rows.
- After the initial seed, day-to-day catalog changes should happen in `/admin`, not in source files.
- Existing workbook, Google Sheets, and Stripe sync scripts remain in the repo, but they are no longer the live site's runtime data path.

## Key file tree

```text
.
├── .node-version
├── astro.config.mjs
├── package.json
├── public/
│   └── _routes.json
├── migrations/
│   ├── 0001_init.sql
│   └── 0002_seed_catalog.sql
├── scripts/
│   ├── generate_d1_seed.mjs
│   └── patch_pages_build.mjs
├── src/
│   ├── components/
│   ├── data/
│   │   ├── catalog-data.ts
│   │   ├── catalog.ts
│   │   └── site.ts
│   ├── layouts/
│   ├── lib/
│   │   ├── api.ts
│   │   └── catalog/
│   │       ├── repository.ts
│   │       ├── shared.ts
│   │       └── validation.ts
│   ├── pages/
│   │   ├── admin/
│   │   │   └── index.astro
│   │   ├── api/
│   │   │   └── admin/
│   │   │       ├── books/
│   │   │       │   ├── [id].ts
│   │   │       │   └── reorder.ts
│   │   │       ├── books.ts
│   │   │       └── catalog.ts
│   │   ├── about.astro
│   │   ├── books.astro
│   │   ├── contact.astro
│   │   ├── faq.astro
│   │   ├── index.astro
│   │   ├── newsletter.astro
│   │   ├── series.astro
│   │   └── thank-you.astro
│   └── types/
│       └── catalog.ts
├── worker-configuration.d.ts
└── wrangler.jsonc
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

- If you re-run `npm run db:seed:local`, it will replace the local catalog rows with the seed data again.

## Create the D1 database

You can create the database in the Cloudflare dashboard or with Wrangler.

### Recommended CLI path

```sh
npx wrangler d1 create jaclyn-catalog
```

Wrangler will return a `database_id`. Copy that value into `wrangler.jsonc`:

```json
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "jaclyn-catalog",
      "database_id": "paste-the-real-id-here"
    }
  ]
}
```

Then apply the schema and bootstrap seed to the remote database:

```sh
npm run db:migrate
npm run db:seed
```

## Cloudflare Pages project setup

### Dashboard steps

1. In Cloudflare, go to `Workers & Pages`.
2. Select `Create application`.
3. Select the `Pages` tab.
4. Choose `Import an existing Git repository`.
5. Connect this repository.
6. In the build setup step, use:

```text
Framework preset: Astro
Production branch: main
Build command: npm run build
Build output directory: dist
Root directory: (leave blank unless you move this repo into a monorepo)
```

7. Save and deploy.

### After project creation

- This repo includes `wrangler.jsonc` with `pages_build_output_dir`.
- Once deployed, that Wrangler file becomes the project configuration source of truth for supported settings such as bindings.
- Update `wrangler.jsonc` before relying on production deploys.

## Environment variables and build settings

### `SITE_URL`

Set `SITE_URL` in the Pages project so canonical URLs use your intended production hostname.

Examples:

- temporary: `https://jaclyn-osborn-site.karnestaylor.workers.dev`
- preferred: `https://www.your-domain.com`

### Node version

This repo includes `.node-version` pinned to `22.12.0`.

If your Pages project is older, make sure its build environment is not stuck on an older build image. Cloudflare's current Pages docs say newer builds default to Node 22, but pinning the version is still safer.

## Access protection for admin routes

Version 1 assumes Cloudflare Access is the authentication layer.

Protect these paths:

- `/admin`
- `/admin/*`
- `/api/admin/*`

### Recommended setup

Use a custom domain attached to the Pages project, then create Access policies for the admin paths.

### Why the custom domain matters

Cloudflare's current docs support path-based Access policies through self-hosted application paths on a domain in an active Cloudflare zone. Cloudflare also supports one-click Access on `workers.dev`, but that protects the `workers.dev` endpoint itself.

Inference:

- If you want the whole site protected temporarily, `workers.dev` Access is usable.
- If you want the public site to stay open while only `/admin` and `/api/admin/*` require login, use a custom domain and path-based Access policies.

### Access setup steps

1. Add a custom domain to the Pages project.
2. In Cloudflare Zero Trust, go to `Access controls` -> `Applications`.
3. Select `Add an application`.
4. Choose `Self-hosted`.
5. Create one application for your admin UI path.
6. Add a public hostname and path for `your-domain.com/admin*`.
7. Create another application or additional path coverage for `your-domain.com/api/admin/*`.
8. Add an allow policy for the specific email addresses, group, or IdP users who should manage the catalog.
9. Save the application configuration.

### Temporary option on `workers.dev`

If you are only testing internally and do not mind protecting the whole deployed preview URL, you can enable one-click Cloudflare Access on the `workers.dev` deployment from the worker's `Settings` -> `Domains & Routes`.

## Deployment workflow

### One-time bootstrap

1. Create the D1 database.
2. Paste the real `database_id` into `wrangler.jsonc`.
3. Create the Pages project.
4. Set `SITE_URL`.
5. Run remote migrations.
6. Run the remote seed.
7. Add a custom domain.
8. Enable Cloudflare Access for admin paths.

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
- The current `wrangler.jsonc` uses one D1 binding for both preview and production. If you want separate preview and production databases later, add environment-specific bindings as a follow-up.
- `site_settings` is present for future lightweight settings, but not wired into the dashboard yet.

## Manual Cloudflare dashboard checklist

You still need to configure these items manually:

- Create the real D1 database
- Replace the placeholder `database_id` in `wrangler.jsonc`
- Create or reconnect the Cloudflare Pages project
- Set `SITE_URL`
- Attach a custom domain to the Pages project
- Configure Cloudflare Access for `/admin` and `/api/admin/*`
- Confirm the Pages project is using a modern Node 22 build environment if it is an older Pages project

## Verification commands

```sh
npm run check
npm run build
npm run db:migrate:local
```

## Reference docs used for the Cloudflare setup notes

- Cloudflare Pages Astro guide: `https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/`
- Cloudflare Pages Wrangler configuration: `https://developers.cloudflare.com/pages/functions/wrangler-configuration/`
- Cloudflare Pages bindings: `https://developers.cloudflare.com/pages/functions/bindings/`
- Cloudflare D1 getting started: `https://developers.cloudflare.com/d1/get-started/`
- Cloudflare D1 local development: `https://developers.cloudflare.com/d1/build-with-d1/local-development/`
- Cloudflare Access application paths: `https://developers.cloudflare.com/cloudflare-one/access-controls/policies/app-paths/`
- Cloudflare Access self-hosted applications: `https://developers.cloudflare.com/cloudflare-one/applications/configure-apps/self-hosted-apps/`
- Cloudflare Workers `workers.dev` access control: `https://developers.cloudflare.com/workers/configuration/routing/workers-dev/`
