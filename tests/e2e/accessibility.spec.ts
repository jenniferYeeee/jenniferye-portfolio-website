import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { projectSlugs } from './helpers';

const pages = ['./', ...projectSlugs.map((s) => `./work/${s}/`), './missing-page/'];

for (const path of pages) {
  test(`no WCAG 2.2 AA violations on ${path}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    const summary = results.violations.map(
      (v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(' ')).join(', ')})`,
    );
    expect(summary).toEqual([]);
  });
}
