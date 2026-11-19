import { expect, test } from '@playwright/test';

test('hero animates by default', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('./');
  const duration = await page
    .locator('.hero-name span')
    .evaluate((el) => parseFloat(getComputedStyle(el).animationDuration));
  expect(duration).toBeGreaterThan(0.1);
});

test('reduced motion disables the hero animation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  const duration = await page
    .locator('.hero-name span')
    .evaluate((el) => parseFloat(getComputedStyle(el).animationDuration));
  expect(duration).toBeLessThan(0.01);
});

test('project tile and page share a view-transition name', async ({ page }) => {
  await page.goto('./');
  const tile = page.locator('#work article').first();
  const slug = await tile.getAttribute('data-project');
  const tileName = await tile
    .locator('[data-media="video"]')
    .evaluate((el) => getComputedStyle(el).viewTransitionName);
  expect(tileName).toContain(slug ?? '__missing__');

  await page.goto(`./work/${slug}/`);
  const pageName = await page
    .locator('[data-media="video"]')
    .evaluate((el) => getComputedStyle(el).viewTransitionName);
  expect(pageName).toBe(tileName);
});
