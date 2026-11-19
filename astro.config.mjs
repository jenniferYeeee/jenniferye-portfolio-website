// @ts-check
import { defineConfig } from 'astro/config';

// Hosted on Cloudflare Pages at the root of its own domain. To serve from a
// sub-path instead (e.g. a GitHub Pages project site), set SITE_BASE=/<repo>.
const site = process.env.SITE_URL ?? 'https://jenye.pages.dev';
const base = process.env.SITE_BASE ?? '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  build: { format: 'directory' },
});
