import { readdirSync } from 'node:fs';
import type { Page } from '@playwright/test';

/** Project slugs, read from content so new projects are tested automatically. */
export const projectSlugs = readdirSync('src/content/projects')
  .filter((f) => f.endsWith('.md'))
  .map((f) => f.replace(/\.md$/, ''));

/** Collects console errors and uncaught exceptions for the life of the page. */
export function trackErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push(err.message));
  return errors;
}
