import { readdirSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { trackErrors } from './helpers';

const questIds = readdirSync('src/content/sidequests')
  .filter((f) => f.endsWith('.md'))
  .map((f) => f.replace(/\.md$/, ''));

test('About has a highlighted sidequests link that opens the page', async ({ page }) => {
  const errors = trackErrors(page);
  await page.goto('./');
  const link = page.locator('#about').getByRole('link', { name: 'sidequests' });
  await expect(link).toBeVisible();
  // Guards against JSX whitespace swallowing the space before the link.
  await expect(link.locator('xpath=..')).toHaveText(
    'Sometimes I venture into different sidequests too.',
  );
  await expect(link).toHaveAttribute('href', /\/sidequests\/$/);
  const bg = await link.evaluate((el) => getComputedStyle(el).backgroundImage);
  expect(bg).toContain('gradient');
  await link.click();
  await expect(page).toHaveURL(/\/sidequests\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Sidequests');
  expect(errors).toEqual([]);
});

test('renders one row per sidequest, each with a carousel', async ({ page }) => {
  await page.goto('./sidequests/');
  await expect(page.locator('[data-quest]')).toHaveCount(questIds.length);
  for (const id of questIds) {
    const row = page.locator(`#${id}`);
    await expect(row.getByRole('heading', { level: 2 })).not.toBeEmpty();
    await expect(row.locator('[aria-roledescription="carousel"]')).toHaveCount(1);
    const slides = row.locator('[aria-roledescription="slide"]');
    expect(await slides.count()).toBeGreaterThan(0);
    await expect(slides.first()).toHaveAttribute('aria-label', /^1 of \d+$/);
  }
});

test('carousel buttons move between photos and disable at the ends', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./sidequests/');
  const carousel = page.locator('[data-carousel]').first();
  const track = carousel.locator('[data-track]');
  const prev = carousel.getByRole('button', { name: 'Previous photo' });
  const next = carousel.getByRole('button', { name: 'Next photo' });
  const total = await carousel.locator('[data-slide]').count();
  expect(total).toBeGreaterThan(1);

  await expect(prev).toBeDisabled();
  await expect(next).toBeEnabled();
  for (let i = 1; i < total; i++) await next.click();
  await expect.poll(() => track.evaluate((el) => el.scrollLeft)).toBeGreaterThan(0);
  await expect(next).toBeDisabled();
  await expect(prev).toBeEnabled();
  await prev.click();
  await expect(next).toBeEnabled();
});

test('the background starts on the first palette and follows scroll', async ({ page }) => {
  await page.goto('./sidequests/');
  const sky = page.locator('[data-sky]');
  await expect(sky).toHaveAttribute('data-position', '0.00');
  await expect(sky).toHaveCSS('position', 'fixed');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  // With one sidequest the colors stay put; with more they must move.
  if (questIds.length > 1) {
    await expect
      .poll(async () => Number(await sky.getAttribute('data-position')))
      .toBeGreaterThan(0);
  } else {
    await expect(sky).toHaveAttribute('data-position', '0.00');
  }
});

test('rows reveal on scroll, and are simply shown with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./sidequests/');
  for (const row of await page.locator('[data-quest]').all()) {
    await expect(row).toHaveCSS('opacity', '1');
  }

  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('./sidequests/');
  const last = page.locator('[data-quest]').last();
  await last.scrollIntoViewIfNeeded();
  await expect(last).toHaveAttribute('data-shown', '');
  await expect(last).toHaveCSS('opacity', '1');
});
