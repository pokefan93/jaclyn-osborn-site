# Jaclyn Osborn Static Author Site

A polished static author-site concept for Jaclyn Osborn built with Astro, Tailwind, and TypeScript. The project is structured like a production-ready storefront plus series discovery hub, but the current catalog metadata is representative seed content.

## Stack

- Astro
- Tailwind CSS
- TypeScript
- Fully static output for GitHub Pages

## Local development

Install dependencies and start the dev server:

```sh
npm install
npm run dev
```

Open `http://localhost:4321`.

Useful commands:

```sh
npm run build
npm run preview
npm run check
```

## Project structure

```text
.
├── .github/
│   └── workflows/
│       └── deploy.yml
├── public/
│   ├── favicon.ico
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── BookCard.astro
│   │   ├── BookCover.astro
│   │   ├── FaqList.astro
│   │   ├── NewsletterPanel.astro
│   │   ├── PageHero.astro
│   │   ├── PurchaseActions.astro
│   │   ├── SectionHeading.astro
│   │   ├── SeriesCard.astro
│   │   ├── SiteFooter.astro
│   │   ├── SiteHeader.astro
│   │   ├── StripeBuyButton.astro
│   │   └── SocialShowcase.astro
│   ├── data/
│   │   ├── catalog.ts
│   │   └── site.ts
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── about.astro
│   │   ├── books.astro
│   │   ├── contact.astro
│   │   ├── faq.astro
│   │   ├── index.astro
│   │   ├── newsletter.astro
│   │   ├── series.astro
│   │   └── thank-you.astro
│   ├── styles/
│   │   └── global.css
│   ├── types/
│   │   └── catalog.ts
│   └── utils/
│       ├── purchase.ts
│       └── withBase.ts
├── astro.config.mjs
├── package-lock.json
├── package.json
└── tsconfig.json
```

## Seed content

Representative catalog content lives in:

- `src/data/catalog.ts`
- `src/data/site.ts`

Replace those files first when moving from mock content to real production data. Current placeholders include:

- sample book titles, hooks, tropes, and badges
- example newsletter, retailer, and Stripe Payment Link URLs
- placeholder contact email addresses
- sample social and newsletter campaign cards

## GitHub Pages deployment

This site is configured for static deployment with GitHub Actions.

1. Push the repo to GitHub.
2. In GitHub, open `Settings` → `Pages`.
3. Set the source to `GitHub Actions`.
4. The included workflow at `.github/workflows/deploy.yml` will build and deploy on pushes to `main`.

### Base URL behavior

`astro.config.mjs` derives `site` and `base` automatically in GitHub Actions:

- user site repo: `username.github.io` deploys at `/`
- project repo: deploys at `/<repo-name>/`

If you later use a custom domain:

1. Set `SITE=https://your-domain.com` in the workflow or build environment.
2. Set `BASE=/` if needed.
3. Add `public/CNAME`.

## Production-readiness notes

- No server-side code or secrets are used.
- Catalog filtering on the books page is client-side only.
- Newsletter signup is wired as a static external form action placeholder.
- Direct sales default to Stripe Payment Links, which are Stripe-hosted and GitHub-Pages-safe.
- Optional Stripe Buy Button support is isolated to a dedicated component and should only be enabled when you actually want an embedded button.
- All internal navigation is base-aware for GitHub Pages compatibility.

## Direct sales admin guide

### Architecture choice

This repo is intentionally set up for static hosting:

- default direct-sale method: Stripe Payment Links
- standard editions: external retailer links
- optional embedded mode: Stripe Buy Button
- not included: custom cart, server-created Checkout Sessions, secret-key flows, or real-time inventory

This keeps the site compatible with GitHub Pages because checkout stays hosted by Stripe or an external retailer.

### Stripe docs

- Payment Links: `https://docs.stripe.com/payment-links`
- Buy Button: `https://docs.stripe.com/payment-links/buy-button`
- Post-payment redirect: `https://docs.stripe.com/payment-links/post-payment`

### How to create a Stripe product and Payment Link

1. In Stripe Dashboard, create the product and price for the edition you want to sell.
2. Create a Payment Link for that product from the Dashboard.
3. In the Payment Link settings, configure the post-payment behavior to redirect to this site’s thank-you page:
   `https://your-domain-or-github-pages-site/thank-you/`
4. Copy the Payment Link URL.
5. Paste that URL into the relevant book entry in `src/data/catalog.ts` under `purchase.directSaleFormats[].purchaseUrl`.

### Where purchase data lives

The purchase model is stored per book in `src/data/catalog.ts`:

- `purchase.availabilityStatus`
- `purchase.availabilityLabel`
- `purchase.merchandisingFlags`
- `purchase.signedCopy`
- `purchase.directFromAuthor`
- `purchase.shippingNote`
- `purchase.fulfillmentNote`
- `purchase.whereToBuyNote`
- `purchase.retailerLinks`
- `purchase.directSaleFormats`

This shape is intentionally easy to migrate to a Google Sheet later because each field is explicit and editorially controlled.

### When to use Stripe Payment Links vs retailer links

Use Stripe Payment Links when:

- you are selling signed copies, special editions, or direct-from-author bundles
- you want Stripe to host checkout
- you do not want to build a server flow

Use external retailer links when:

- the format is already distributed elsewhere
- you want to send readers to Kindle, Kobo, Bookshop, Libro.fm, or similar retailers
- the edition is not being fulfilled manually by the author

### Optional Stripe Buy Button mode

Payment Links are the default and recommended mode.

If you want an embedded Stripe buy button:

1. Create the Payment Link first.
2. Generate a buy button from that Payment Link in Stripe Dashboard.
3. Add the returned `buy_button_id` to `purchase.directSaleFormats[].stripeBuyButtonId`.
4. Change that row’s `purchaseMode` to `stripe_buy_button`.
5. Add your Stripe publishable key to `siteMeta.directSales.stripeBuyButtonPublishableKey` in `src/data/site.ts`.

Do not place any Stripe secret key in this repo.

### How to paste links into the content layer

Example direct-sale row:

```ts
{
  id: 'fallen-heir-signed-paperback',
  label: 'Signed',
  format: 'paperback',
  purchaseMode: 'stripe_payment_link',
  purchaseUrl: 'https://buy.stripe.com/your-payment-link',
}
```

Example retailer row:

```ts
{
  id: 'fallen-heir-kindle',
  retailer: 'Amazon Kindle',
  label: 'Kindle',
  format: 'ebook',
  purchaseMode: 'external_retailer',
  purchaseUrl: 'https://your-retailer-link.example',
}
```

### Availability and sold-out guidance

Availability labels in this site are editorial only. They are not real-time inventory.

Use:

- `in_stock` when you are actively selling the direct edition
- `limited` when you want to communicate a small or manually controlled batch
- `preorder` when the title is not shipping yet
- `sold_out` when the direct edition should not be purchased from the site

Mark a title `sold_out` when:

- you have paused direct fulfillment
- the signed or special edition is no longer available
- the site should stop sending readers into direct checkout for that edition

For sold-out direct editions, keep retailer links live if standard editions are still available elsewhere.

## Design direction

The visual system aims for romantic and slightly moody rather than gothic:

- warm parchment backgrounds instead of flat white
- dark fig and teal contrast panels for atmosphere
- Fraunces for expressive display type and Manrope for clean scanning
- storefront-style product cards with series discovery built into the IA
- enough motion and glow to feel intentional without overwhelming the content
