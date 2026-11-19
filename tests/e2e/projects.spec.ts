import { expect, test } from '@playwright/test';
import { projectSlugs, trackErrors } from './helpers';

test('home links to every project exactly once', async ({ page }) => {
  await page.goto('./');
  for (const slug of projectSlugs) {
    await expect(page.locator(`#work a[href$="/work/${slug}/"]`)).toHaveCount(1);
  }
});

for (const slug of projectSlugs) {
  test(`project page "${slug}" has video, overview, outcomes, diagram and next link`, async ({
    page,
  }) => {
    const errors = trackErrors(page);
    const res = await page.goto(`./work/${slug}/`);
    expect(res?.status()).toBe(200);

    await expect(page.getByRole('heading', { level: 1 })).not.toBeEmpty();
    const video = page.locator('[data-media="video"]');
    const diagram = page.locator('[data-media="diagram"]');
    await expect(video).toBeVisible();
    await expect(diagram).toBeVisible();

    // Each media slot is either a real asset or the labelled placeholder, never empty.
    for (const slot of [video, diagram]) {
      const status = await slot.getAttribute('data-status');
      if (status === 'pending') {
        await expect(slot.getByRole('img')).toHaveAccessibleName(/coming soon/);
      } else {
        await expect(slot.locator('video, img')).toHaveCount(1);
      }
    }

    await expect(page.getByRole('heading', { name: 'Overview' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Outcomes' })).toBeVisible();
    expect(await page.locator('.highlights li').count()).toBeGreaterThan(0);
    await expect(page.locator('a[data-next]')).toHaveAttribute('href', /\/work\/[a-z0-9-]+\/$/);
    expect(errors).toEqual([]);
  });
}

test('clicking a tile navigates to the project and back link returns to work', async ({ page }) => {
  const errors = trackErrors(page);
  await page.goto('./');
  const first = page.locator('#work article a').first();
  const href = await first.getAttribute('href');
  expect(href).toBeTruthy();
  await first.click();
  await expect(page).toHaveURL(new RegExp(`${href}$`));
  await page.getByRole('link', { name: 'All work' }).click();
  await expect(page.locator('#work')).toBeInViewport();
  expect(errors).toEqual([]);
});

test('next links cycle through every project', async ({ page }) => {
  await page.goto(`./work/${projectSlugs[0]}/`);
  const seen = new Set<string>();
  for (let i = 0; i < projectSlugs.length; i++) {
    seen.add(new URL(page.url()).pathname);
    const next = page.locator('a[data-next]');
    const href = await next.getAttribute('href');
    await next.click();
    await expect(page).toHaveURL(new RegExp(`${href}$`));
  }
  expect(seen.size).toBe(projectSlugs.length);
});
