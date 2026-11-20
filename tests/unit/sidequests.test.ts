import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';
import { sidequestSchema } from '../../src/content/schema';
import { SKY_PALETTES, skyAt, hexToRgb } from '../../src/lib/sky';

const DIR = join(process.cwd(), 'src/content/sidequests');
const quests = readdirSync(DIR)
  .filter((f) => f.endsWith('.md'))
  .map((f) => {
    const m = /^---\n([\s\S]*?)\n---/.exec(readFileSync(join(DIR, f), 'utf8'));
    if (!m) throw new Error(`${f}: missing frontmatter`);
    return { id: f.replace(/\.md$/, ''), data: parse(m[1] ?? '') };
  });

describe('sidequest content', () => {
  it('has at least one sidequest', () => {
    expect(quests.length).toBeGreaterThan(0);
  });

  it.each(quests.map((q) => [q.id, q] as const))('%s matches the schema', (_id, q) => {
    const r = sidequestSchema.safeParse(q.data);
    expect(r.success, JSON.stringify(r.error?.issues, null, 2)).toBe(true);
  });

  it('uses unique order values', () => {
    const orders = quests.map((q) => q.data.order);
    expect(new Set(orders).size).toBe(orders.length);
  });

  it('points every photo at a file in public/', () => {
    for (const q of quests) {
      for (const p of q.data.photos as { src: string }[]) {
        expect(existsSync(join('public', p.src)), `${q.id}: public/${p.src}`).toBe(true);
      }
    }
  });

  it('rejects a photo without alt text', () => {
    const bad = { ...quests[0]?.data, photos: [{ src: 'media/sidequests/a.jpg' }] };
    expect(sidequestSchema.safeParse(bad).success).toBe(false);
  });
});

describe('sky', () => {
  it('uses valid hex colors', () => {
    for (const p of SKY_PALETTES) for (const c of p) expect(() => hexToRgb(c)).not.toThrow();
  });

  it('keeps every palette light (base luminance high, text stays readable)', () => {
    for (const p of SKY_PALETTES) {
      const [r, g, b] = hexToRgb(p[2]);
      expect((r + g + b) / 3, p[2]).toBeGreaterThan(235);
    }
  });

  it('starts on the first palette and blends toward the next', () => {
    const [r, g, b] = hexToRgb(SKY_PALETTES[0][2]);
    expect(skyAt(0)[2]).toBe(`rgb(${r}, ${g}, ${b})`);
    expect(skyAt(0.5)[2]).not.toBe(skyAt(0)[2]);
    expect(skyAt(0.5)[2]).not.toBe(skyAt(1)[2]);
  });

  it('repeats palettes when there are more sidequests than colors', () => {
    expect(skyAt(SKY_PALETTES.length)).toEqual(skyAt(0));
  });
});
