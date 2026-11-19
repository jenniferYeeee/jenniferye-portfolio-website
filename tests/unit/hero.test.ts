import { describe, expect, it } from 'vitest';
import { typedAt, TYPE_S, DELETE_S, HOLD_S, GAP_S } from '../../src/lib/typewriter';
import { layoutParticles, COLUMNS } from '../../src/lib/particles';
import { hero } from '../../src/data/site';

const lines = ['Hello', 'World!'];
const cycle = (l: string) => l.length * TYPE_S + HOLD_S + l.length * DELETE_S + GAP_S;

describe('typedAt', () => {
  it('starts with the first character', () => {
    expect(typedAt(lines, 0)).toBe('H');
  });

  it('types one character per TYPE_S', () => {
    expect(typedAt(lines, TYPE_S * 2 + 0.001)).toBe('Hel');
  });

  it('holds the full line after typing', () => {
    expect(typedAt(lines, 5 * TYPE_S + HOLD_S / 2)).toBe('Hello');
  });

  it('deletes faster than it types', () => {
    expect(DELETE_S).toBeLessThan(TYPE_S);
    const t = 5 * TYPE_S + HOLD_S + DELETE_S * 2 + 0.001;
    expect(typedAt(lines, t)).toBe('He');
  });

  it('is empty during the gap between lines', () => {
    expect(typedAt(lines, cycle('Hello') - GAP_S / 2)).toBe('');
  });

  it('moves on to the next line, then loops', () => {
    expect(typedAt(lines, cycle('Hello') + 0.001)).toBe('W');
    expect(typedAt(lines, cycle('Hello') + cycle('World!') + 0.001)).toBe('H');
  });

  it('only ever shows a prefix of a real line', () => {
    for (let t = 0; t < 40; t += 0.037) {
      const shown = typedAt(hero.lines, t);
      expect(
        shown === '' || hero.lines.some((l) => l.startsWith(shown)),
        `t=${t}: "${shown}"`,
      ).toBe(true);
    }
  });
});

describe('layoutParticles', () => {
  const sentence = hero.particles;
  const parts = layoutParticles(sentence);

  it('makes one particle per non-space character', () => {
    expect(parts.length).toBe([...sentence].filter((c) => c.trim() !== '').length);
    expect(parts.map((p) => p.char).join('')).toBe(sentence.replace(/\s/g, ''));
  });

  it('keeps every particle inside the field', () => {
    for (const p of parts) {
      expect(p.x).toBeGreaterThanOrEqual(0);
      expect(p.x).toBeLessThanOrEqual(100);
      expect(p.y).toBeGreaterThanOrEqual(-10);
      expect(p.y).toBeLessThanOrEqual(110);
    }
  });

  it('lays rows out top to bottom in reading order', () => {
    const rows = Math.ceil([...sentence].length / COLUMNS);
    expect(rows).toBeGreaterThanOrEqual(6);
    expect(parts[0]?.y ?? 99).toBeLessThan(15);
    expect(parts.at(-1)?.y ?? 0).toBeGreaterThan(85);
  });

  it('is deterministic', () => {
    expect(layoutParticles(sentence)).toEqual(parts);
  });
});

describe('hero copy', () => {
  it('has 2–5 typed lines', () => {
    expect(hero.lines.length).toBeGreaterThanOrEqual(2);
    expect(hero.lines.length).toBeLessThanOrEqual(5);
  });

  it('keeps each typed line short enough for one line', () => {
    for (const l of hero.lines) expect(l.length, l).toBeLessThanOrEqual(64);
  });

  it('keeps the particle sentence a readable length', () => {
    expect(hero.particles.length).toBeGreaterThan(60);
    expect(hero.particles.length).toBeLessThanOrEqual(200);
  });
});
