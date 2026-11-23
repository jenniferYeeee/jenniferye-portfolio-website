import { expect, test } from '@playwright/test';
import { hero } from '../../src/data/site';

const nonSpace = [...hero.particles].filter((c) => c.trim() !== '').length;

test.describe('hero', () => {
  test('renders one particle per letter of the sentence', async ({ page }) => {
    await page.goto('./');
    await expect(page.locator('[data-hero] .particle')).toHaveCount(nonSpace);
    await expect(page.locator('[data-hero] .field')).toHaveAttribute('aria-hidden', 'true');
  });

  test('has an accessible h1 and the intro as readable text', async ({ page }) => {
    await page.goto('./');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Jennifer Ye');
    for (const line of hero.lines) {
      await expect(page.locator('[data-intro]')).toContainText(line);
    }
    await expect(page.locator('[data-typer]')).toHaveAttribute('aria-hidden', 'true');
  });

  test('particles move when motion is allowed', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('./');
    await expect(page.locator('[data-hero]')).toHaveAttribute('data-motion', 'on');
    const first = page.locator('[data-hero] .particle').first();
    const a = await first.evaluate((el) => el.style.transform);
    await page.waitForTimeout(400);
    const b = await first.evaluate((el) => el.style.transform);
    expect(a).not.toBe(b);
  });

  test('reduced motion keeps particles still and shows the first line', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('./');
    await expect(page.locator('[data-hero]')).toHaveAttribute('data-motion', 'reduced');
    const first = page.locator('[data-hero] .particle').first();
    const a = await first.evaluate((el) => el.style.transform);
    await page.waitForTimeout(500);
    expect(await first.evaluate((el) => el.style.transform)).toBe(a);
    await expect(page.locator('[data-typed]')).toHaveText(hero.lines[0] ?? '');
  });
});

test.describe('typewriter (768px and up) @desktop', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
  });

  test('shows the typer and hides the static intro visually', async ({ page }) => {
    await page.goto('./');
    await expect(page.locator('[data-typer]')).toBeVisible();
    const clip = await page.locator('[data-intro]').evaluate((el) => getComputedStyle(el).clipPath);
    expect(clip).toContain('inset(50%)');
  });

  test('types, holds, deletes and moves to the next line', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('./');
    const typed = page.locator('[data-typed]');
    const seen = new Set<string>();
    for (let i = 0; i < 40; i++) {
      seen.add((await typed.textContent()) ?? '');
      await page.waitForTimeout(150);
    }
    for (const s of seen) {
      expect(s === '' || hero.lines.some((l) => l.startsWith(s)), `"${s}"`).toBe(true);
    }
    // Saw partial text, a full line, and the next line starting.
    expect([...seen].some((s) => s.length > 0 && !hero.lines.includes(s as never))).toBe(true);
    expect(seen.has(hero.lines[0] ?? '')).toBe(true);
    expect([...seen].some((s) => s.length > 0 && (hero.lines[1] ?? '').startsWith(s))).toBe(true);
  });

  for (const width of [768, 1024, 1440]) {
    test(`every typed line fits on one line at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto('./');
      const typer = page.locator('[data-typer]');
      for (const line of hero.lines) {
        const fits = await typer.evaluate((el, text) => {
          const span = el.querySelector('[data-typed]');
          if (span) span.textContent = text;
          return el.scrollWidth <= el.clientWidth;
        }, line);
        expect(fits, line).toBe(true);
      }
    });
  }

  test('the cursor dot follows a fine pointer', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('./');
    await page.mouse.move(400, 300);
    await expect(page.locator('[data-hero]')).toHaveAttribute('data-pointer', 'in');
    await expect(page.locator('[data-dot]')).toHaveCSS('opacity', '0.9');
  });
});

test('phones show the intro as static paragraphs, not the typer', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('./');
  await expect(page.locator('[data-typer]')).toBeHidden();
  for (const line of hero.lines) {
    await expect(page.locator('[data-intro]').getByText(line)).toBeVisible();
  }
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

test('every tile preview plays only while hovered @desktop', async ({ page }) => {
  await page.goto('./');
  const tiles = page.locator('#work article', { has: page.locator('video[data-hover-play]') });
  await expect(tiles).toHaveCount(4);
  const tile = tiles.first();
  await expect(tile).toHaveAttribute('data-project', 'autonomous-battery-swap');
  await tile.scrollIntoViewIfNeeded();
  const video = tile.locator('video');
  await page.waitForTimeout(400);
  expect(await video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
  await tile.locator('figure').hover();
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => !v.paused)).toBe(true);
  await page.mouse.move(0, 0);
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
});

test('project pages loop the demo muted, but not with reduced motion', async ({ page }) => {
  await page.goto('./work/surgical-robot-ar/');
  const demo = page.locator('video[data-page-autoplay]');
  await expect
    .poll(() => demo.evaluate((v: HTMLVideoElement) => !v.paused && v.muted && v.loop))
    .toBe(true);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await page.waitForTimeout(500);
  expect(await demo.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
});

test('tile previews stay still on hover with reduced motion @desktop', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  const tile = page
    .locator('#work article', { has: page.locator('video[data-hover-play]') })
    .first();
  await tile.scrollIntoViewIfNeeded();
  await tile.locator('figure').hover();
  await page.waitForTimeout(500);
  expect(await tile.locator('video').evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
});
