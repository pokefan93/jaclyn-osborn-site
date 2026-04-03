/// <reference types="node" />
// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  // SITE_URL must be set at build time so canonical URLs, Open Graph tags,
  // sitemap.xml, and robots.txt all reference the correct production hostname.
  // The fallback keeps local dev and CI builds pointed at the current workers.dev URL.
  // When Jaclyn's custom domain is live, set SITE_URL to that domain and rebuild.
  site: process.env.SITE_URL ?? 'https://jaclyn-osborn-site.karnestaylor.workers.dev',
  trailingSlash: 'always',
  adapter: cloudflare({
    imageService: 'passthrough',
    prerenderEnvironment: 'node',
  }),
  build: {
    client: './',
    server: './_worker.js',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
