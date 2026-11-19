// @ts-check
import { defineConfig } from 'astro/config';

// GitHub Pages project site lives under /<repo>/. If you move to a custom
// domain, set SITE_URL=https://yourdomain.com and SITE_BASE=/ in CI.
const site = process.env.SITE_URL ?? 'https://jenniferyeeee.github.io';
const base = process.env.SITE_BASE ?? '/jenniferye-portfolio-website';

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  build: { format: 'directory' },
});
