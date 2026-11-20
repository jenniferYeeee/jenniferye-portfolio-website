/**
 * Page-wide background for /sidequests: soft radial washes whose colors drift
 * between light, warm palettes as you scroll from one sidequest to the next.
 * Each palette is [top-left wash, bottom-right wash, base].
 */
export const SKY_PALETTES = [
  ['#f1dcc4', '#ded2dc', '#f7f2eb'], // dusk
  ['#f5e6a8', '#f4ecd6', '#fbf8ef'], // butter
  ['#d5ddca', '#eceee3', '#f8f7f2'], // sage
  ['#dcd6e8', '#f0e8e3', '#f9f7f7'], // lavender
] as const;

export type Rgb = [number, number, number];

export function hexToRgb(hex: string): Rgb {
  const m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
  if (!m) throw new Error(`Bad hex: ${hex}`);
  return [parseInt(m[1] ?? '0', 16), parseInt(m[2] ?? '0', 16), parseInt(m[3] ?? '0', 16)];
}

function mix(a: string, b: string, t: number): string {
  const x = hexToRgb(a);
  const y = hexToRgb(b);
  return `rgb(${x.map((v, i) => Math.round(v + ((y[i] ?? v) - v) * t)).join(', ')})`;
}

/**
 * Colors at fractional position `f` (0 = first sidequest, 1 = second, ...).
 * Palettes repeat if there are more sidequests than palettes.
 */
export function skyAt(f: number): [string, string, string] {
  const n = SKY_PALETTES.length;
  const clamped = Math.max(0, f);
  const i = Math.floor(clamped);
  const t = clamped - i;
  const a = SKY_PALETTES[i % n] ?? SKY_PALETTES[0];
  const b = SKY_PALETTES[(i + 1) % n] ?? SKY_PALETTES[0];
  return [mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t)];
}
