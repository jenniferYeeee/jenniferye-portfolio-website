import { expect, test } from '@playwright/test';
import { trackErrors } from './helpers';

test('home renders the hero, work, about and contact', async ({ page }) => {
  const errors = trackErrors(page);
  const res = await page.goto('./');
  expect(res?.status()).toBe(200);

  await expect(page).toHaveTitle(/Jennifer Ye/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Jennifer Ye');
  for (const id of ['work', 'about', 'contact']) {
    await expect(page.locator(`section#${id}`)).toBeVisible();
  }
  await expect(page.getByRole('link', { name: 'jenye0313@gmail.com' })).toHaveAttribute(
    'href',
    'mailto:jenye0313@gmail.com',
  );
  expect(errors).toEqual([]);
});

test('primary nav scrolls to each section', async ({ page }) => {
  await page.goto('./');
  const nav = page.getByRole('navigation', { name: 'Primary' });
  for (const [label, id] of [
    ['Work', 'work'],
    ['About', 'about'],
    ['Contact', 'contact'],
  ] as const) {
    await nav.getByRole('link', { name: label }).click();
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    await expect(page.locator(`#${id}`)).toBeInViewport();
  }
});

test('skip link moves focus to main content', async ({ page, browserName }) => {
  test.info().annotations.push({ type: 'browser', description: browserName });
  await page.goto('./');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
});

test('unknown routes serve the 404 page', async ({ page }) => {
  const res = await page.goto('./this-page-does-not-exist/');
  expect(res?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText("This page doesn't exist.");
});
