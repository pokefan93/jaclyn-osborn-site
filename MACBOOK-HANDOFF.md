# Jaclyn Osborn MacBook handoff

Continue the existing redesign and deployment from the MacBook. The code is saved in four GitHub draft pull requests. The new Firebase portal is staged but unreleased. The Cloudflare backend, custom domain, and mobile app release are still pending. This is a deployment handoff, not a request to rebuild the site.

## User requirements and authorization

- Professional, distinctive author website; fast loading and strong technical SEO.
- Jaclyn edits books, descriptions, displayed prices, checkout links, page text, biography, FAQs, series, and covers through Taylor's Tech Solutions website and app.
- Keep services free wherever possible. Do not enable billing or paid plans without explicit approval. Firebase already had billing enabled; do not disable existing services as an incidental cost change.
- The user explicitly authorized backend deployment and asked to continue all remaining steps on the MacBook.
- Domain: authorjaclynosborn.com, purchased by Jaclyn through GoDaddy.
- Content updates appear on the next page request. This is a content editor, not a visual page-layout builder. Displayed prices do not change payment-provider checkout amounts.

## Get the saved work

All repositories belong to pokefan93. Use branch `codex/jaclyn-shared-editor-2026-10-22` in all four. Check for newer commits and read each repository's AGENTS.md before changing it.

| Repository | Pull request | Application commit at handoff |
| --- | --- | --- |
| jaclyn-osborn-site | https://github.com/pokefan93/jaclyn-osborn-site/pull/2 | 887d7fdcb56e0ead9b50cc8e237ba2dc70995c90 |
| tts-control | https://github.com/pokefan93/tts-control/pull/1 | 8df7663e51d73e1eabb98e44421084fea15fe375 |
| taylorstechsolutions | https://github.com/pokefan93/taylorstechsolutions/pull/1 | 662ce44657610ca623e0b14bb8e451003f2e4575 |
| tts-app | https://github.com/pokefan93/tts-app/pull/1 | badc08577960b85672f8db2b59e344a33d47045e |

All four PRs were open and unmerged when checked on October 25, 2026. This handoff adds documentation after the website application commit above.

For fresh Mac checkouts, use a new parent folder and clone each repository with the saved branch. Example:

```sh
git clone --branch codex/jaclyn-shared-editor-2026-10-22 https://github.com/pokefan93/jaclyn-osborn-site.git
```

Repeat for tts-control, taylorstechsolutions, and tts-app. Preserve any existing local changes if the Mac already has these repositories; do not reset them.

The website PR targets main. The TTS website PR targets `codex/business-site-refresh-2026-10-04`, which contains the live marketing site; its main branch was stale. The control PR targets `codex/mac-cleanup-2026-09-25`. The app PR targets main.

## What is implemented and tested

- Astro 7 website with restrained cream/olive editorial styling, responsive covers, self-hosted fonts, mobile layouts, and individual server-rendered book pages.
- Canonical and social metadata, Book structured data, visible-book sitemap, proper missing/hidden-book 404s, and editor noindex.
- Responsive WebP cover variants; the 480px set is approximately 87 percent smaller than original covers.
- Shared `/api/portal/*` content API, Firebase token authentication through tts-control, strict site membership and role enforcement, validated links and image uploads.
- TTS web and native app content, FAQ, series, and book editors.
- Site build/Astro checks and dependency audit passed. GitHub validation run 39884787372 succeeded.
- Five local site integration tests, five local portal integration tests, control authorization tests, and mobile TypeScript checks passed.
- Browser verified a price save, reopening persistence, and restoration using a LOCAL authentication fixture. Real Firebase account flows and native device/store builds still require validation.
- Visual evidence: `reports/homepage-preview.jpg` and `reports/portal-price-editor.jpg`.

## Access and deployment state

Cloudflare Wrangler was unauthenticated on the Windows machine when checked October 25. Both browser sessions also required sign-in. Previous device codes are temporary and must not be reused. On the Mac, authenticate there with `npx wrangler login`; use `--device --browser=false` only if signing in from another device. Verify the account with `npx wrangler whoami`.

No production Cloudflare deployment, remote D1 migration/import, account provisioning, or app-store release has been performed by this work. Do not treat a GitHub PR or successful build as a deployed release.

Firebase CLI on Windows could access project `taylorstechsite-5982d`. Credentials are not transferred with this handoff. Use the Mac's existing authorized login or sign in there.

## Firebase staged portal

Project and Hosting site: `taylorstechsite-5982d`.

- Staged FINALIZED version: `d3a8aa9802994559`.
- Last observed live version: `9ac63ed4d7285b41`.
- Staged source: TTS website commit `662ce44657610ca623e0b14bb8e451003f2e4575`.
- Staged manifest contains 70 files. Only `/portal.html` changed; the other 69 hashes and live Hosting configuration were preserved.
- New compressed upload: 19,897 bytes.
- Verification recorded October 23, 2026 at 02:34 UTC. Recheck live state before release.
- Staged portal gzip SHA256: `c746c305777f76b8baeea4fca722ae01c12a525a60268c914b34e26636dd0d1b`.
- No release was created. Do not publish until the shared backend works.
- Existing retained version sizes summed to about 3.03 GB, below Hosting's 10 GB free storage allowance. Monthly bandwidth and total project charges were not audited.
- Existing Hosting rewrites point to subscribe, submitquote, and submitcontact services. Preserve them.

Use the Hosting REST API to inspect the live channel, staged version, and complete file manifest. If live has changed, rebuild a version from the NEW live manifest/configuration and replace only the reviewed portal file. Do not run a broad Firebase deploy from an incomplete checkout or deploy Functions incidentally. See the web portal PR body for staging details.

## Safe release order

1. Authenticate Cloudflare on the Mac and inspect current account plan, Worker settings, bindings, and deployment versions. Preserve existing runtime variables and secrets. Do not deploy the local test fixture.
2. Export/back up production Jaclyn catalog, legacy jaclyn-portal content, and control role data to private local files outside Git. Download or preserve current Worker versions for rollback.
3. Reconcile the legacy `jaclyn-portal` service with the production public catalog. It is a separate old backend and may contain newer author edits. Never reseed production from historical SQL or workbook data. An unauthenticated request to the legacy portal previously hit a Cloudflare 1010 block, so its content has NOT been reconciled.
4. Deploy tts-control's read-only `/api/control/authorize?siteId=jaclyn` endpoint. Verify existing account/membership behavior before the website API depends on it.
5. Inspect applied D1 migrations and schema. Apply pending additive migrations 0003 (media table) and 0004 (book portal_details column), handling actual existing state rather than blindly rerunning ALTER TABLE.
6. Build and deploy jaclyn-osborn-site with the CONTROL service binding to tts-control. Node 24 is recommended. The build generates the deployment config under `dist/_worker.js/wrangler.json`; inspect it before deploying. Production admin requires Cloudflare Access configuration; the TTS portal uses Firebase/control roles instead.
7. Validate with real assigned owner/editor/viewer and unrelated accounts. Test save/read persistence, checkout-link validation, image upload, hidden-book sitemap behavior, sign-out, and denied writes. Do not invent owner memberships or impersonate Jaclyn.
8. Release the verified Firebase portal version only after backend checks pass. Verify the actual live portal and preserve the rest of the TTS site.
9. Complete custom-domain configuration and rebuild canonical URLs as below.
10. Release the mobile changes via the repository's Expo/store process. Older installed apps use the legacy portal, so retain that backend until the transition and data reconciliation are complete.

## Cloudflare resources

- Public Worker: `jaclyn-osborn-site`; current hostname `https://jaclyn-osborn-site.karnestaylor.workers.dev`.
- Public catalog D1: `jaclyn-osborn-catalog`, ID `dafbc876-1d3b-4e0e-a826-31ee01ddc0c6`.
- Session KV: `d666c7acd8bc4f4f97ebcb1b94c42b6a`.
- Control Worker: `tts-control`; D1 ID `aa25a88d-06a6-49ba-95eb-926b087be0c3`.
- Existing control service bindings: HIXON to hixon-bakery; JACLYN to jaclyn-portal. Preserve these.
- Firebase project for sign-in: `taylorstechsite-5982d`.
- Exact allowed portal origins: TTS root/www and the project's web.app/firebaseapp.com hostnames.
- Test fixture `tests/fixtures/wrangler.jsonc` is LOCAL ONLY and must never be deployed.

## Domain setup

Domain: `authorjaclynosborn.com`, registrar GoDaddy. DNS checked October 25 via 1.1.1.1:

- Nameservers: ns49.domaincontrol.com and ns50.domaincontrol.com.
- Apex A records: 15.197.148.33 and 3.33.130.190.
- www CNAME points to the apex.
- No published MX or TXT answers were returned. Confirm with Jaclyn whether any email service is being set up before changing nameservers.

Add the domain to the appropriate Cloudflare account on the Free plan, preserve required records, and give Jaclyn the EXACT assigned Cloudflare nameservers. Do not invent nameserver values or transfer domain registration. She updates them in GoDaddy's domain Nameservers settings. Check DNSSEC status before a nameserver migration.

After the zone is active, bind the public Worker to the custom domain, handle www, verify HTTPS, and configure a canonical redirect. Set build-time `SITE_URL=https://authorjaclynosborn.com` before the final build. Review API clients before redirecting the workers.dev hostname; preserve the API origin they depend on. Check canonical tags, sitemap URLs, robots, and checkout links, then submit the sitemap through an authorized Search Console account.

## Final checks and known limits

Confirm Jaclyn's real contact email, newsletter-provider signup URL, featured title, and live checkout destinations. Historical contact data and seed test payment links are not launch confirmation. Production hides Stripe test links. Page edits are immediate on refresh, not pushed into already-open pages.

The Windows source directories and local databases are not needed to recover the implemented code; all source/assets/tests are in the four GitHub branches. Do not copy Windows node_modules, local test databases, or login tokens to the Mac.

The Mac was not available as a connected host, so no automatic task/workspace transfer was performed. This handoff and the shared transcript are the continuation package.
