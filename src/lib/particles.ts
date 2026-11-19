export interface Particle {
  char: string;
  /** Percent of the field's width and height. */
  x: number;
  y: number;
  phase: number;
  speed: number;
  /** 0 = always sharp, 1 = drifts fully out of focus. */
  depth: number;
}

export const COLUMNS = 12;

/** Deterministic PRNG so server output is stable across builds. */
function rng(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

/**
 * Lays a sentence out in reading order, COLUMNS letters per row, with a little
 * jitter so it reads as scattered type rather than a grid. Spaces keep their
 * cell (so words stay together) but produce no particle.
 */
export function layoutParticles(sentence: string, seed = 17): Particle[] {
  const r = rng(seed);
  const chars = [...sentence];
  const rows = Math.max(1, Math.ceil(chars.length / COLUMNS));
  const out: Particle[] = [];
  chars.forEach((char, i) => {
    const col = i % COLUMNS;
    const row = Math.floor(i / COLUMNS);
    const jx = (r() - 0.5) * 4.5;
    const jy = (r() - 0.5) * (60 / rows);
    const phase = r() * Math.PI * 2;
    const speed = 0.9 + r() * 0.9;
    const depth = 0.4 + r() * 0.6;
    if (char.trim() === '') return;
    out.push({
      char,
      x: round(6 + ((col + 0.5) / COLUMNS) * 88 + jx),
      y: round(rows === 1 ? 50 : (row / (rows - 1)) * 100 + jy),
      phase: round(phase),
      speed: round(speed),
      depth: round(depth),
    });
  });
  return out;
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
