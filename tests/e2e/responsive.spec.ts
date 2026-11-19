import { expect, test } from '@playwright/test';
import { projectSlugs } from './helpers';

const widths = [320, 375, 768, 1024, 1440];
const pages = ['./', ...projectSlugs.map((s) => `./work/${s}/`)];

// Runs on the desktop project only (see playwright.config.ts); the sweep covers phone widths.
test.describe('layout', () => {
  for (const width of widths) {
    test(`no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const path of pages) {
        await page.goto(path);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow, `${path} overflows by ${overflow}px`).toBeLessThanOrEqual(0);
      }
    });
  }
});

test('header stays visible after scrolling', async ({ page }) => {
  await page.goto('./');
  await page.mouse.wheel(0, 2000);
  await expect(page.getByRole('navigation', { name: 'Primary' })).toBeInViewport();
});

test('body text is at least 16px', async ({ page }) => {
  await page.goto('./');
  const size = await page.evaluate(() => parseFloat(getComputedStyle(document.body).fontSize));
  expect(size).toBeGreaterThanOrEqual(16);
});
