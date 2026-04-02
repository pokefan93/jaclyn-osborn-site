/// <reference types="node" />
// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import cloudflare from '@astrojs/cloudflare';

const repositoryOwner = process.env.GITHUB_REPOSITORY_OWNER;
const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1];
const isUserSiteRepo =
  Boolean(repositoryOwner) && repositoryName === `${repositoryOwner}.github.io`;
const site =
  process.env.SITE ??
  (repositoryOwner
    ? `https://${repositoryOwner}.github.io`
    : 'https://example.github.io');
const base =
  process.env.BASE ??
  (repositoryName && !isUserSiteRepo ? `/${repositoryName}` : '/');

// https://astro.build/config
export default defineConfig({
  output: 'static',
  site,
  base,
  trailingSlash: 'always',

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: cloudflare(),
});