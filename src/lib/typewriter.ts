/** Timing measured from tongli.work: ~60 ms per typed char, ~30 ms per deleted char. */
export const TYPE_S = 0.06;
export const DELETE_S = 0.03;
export const HOLD_S = 1.1;
export const GAP_S = 0.9;

function cycleLength(line: string): number {
  return line.length * TYPE_S + HOLD_S + line.length * DELETE_S + GAP_S;
}

/** What the typewriter shows `t` seconds after it starts. Pure, so it is unit-tested. */
export function typedAt(lines: readonly string[], t: number): string {
  if (lines.length === 0) return '';
  const total = lines.reduce((sum, l) => sum + cycleLength(l), 0);
  let x = ((t % total) + total) % total;
  for (const line of lines) {
    const span = cycleLength(line);
    if (x < span) {
      const typeEnd = line.length * TYPE_S;
      const holdEnd = typeEnd + HOLD_S;
      const deleteEnd = holdEnd + line.length * DELETE_S;
      if (x < typeEnd) return line.slice(0, Math.floor(x / TYPE_S) + 1);
      if (x < holdEnd) return line;
      if (x < deleteEnd)
        return line.slice(0, line.length - Math.floor((x - holdEnd) / DELETE_S) - 1);
      return '';
    }
    x -= span;
  }
  return '';
}
