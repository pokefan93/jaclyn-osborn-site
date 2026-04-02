/// <reference types="node" />
// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  site:
    process.env.SITE_URL ??
    process.env.CF_PAGES_URL ??
    'https://jaclyn-osborn-site.karnestaylor.workers.dev',
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
