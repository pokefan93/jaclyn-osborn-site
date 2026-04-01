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
│   │   ├── SectionHeading.astro
│   │   ├── SeriesCard.astro
│   │   ├── SiteFooter.astro
│   │   ├── SiteHeader.astro
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
│   │   └── series.astro
│   ├── styles/
│   │   └── global.css
│   ├── types/
│   │   └── catalog.ts
│   └── utils/
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
- example newsletter and buy links
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
- Buy buttons are mock external links designed to be replaced with real storefront URLs.
- All internal navigation is base-aware for GitHub Pages compatibility.

## Design direction

The visual system aims for romantic and slightly moody rather than gothic:

- warm parchment backgrounds instead of flat white
- dark fig and teal contrast panels for atmosphere
- Fraunces for expressive display type and Manrope for clean scanning
- storefront-style product cards with series discovery built into the IA
- enough motion and glow to feel intentional without overwhelming the content
