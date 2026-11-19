const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

/** "2024-08" -> "Aug 2024" */
export function formatMonth(ym: string): string {
  const match = /^(\d{4})-(\d{2})$/.exec(ym);
  if (!match) throw new Error(`Invalid month: ${ym}`);
  const [, year, mm] = match;
  const label = MONTHS[Number(mm) - 1];
  if (!label) throw new Error(`Invalid month: ${ym}`);
  return `${label} ${year}`;
}

/** Period label. Same-year ranges collapse to a single year on tiles. */
export function formatPeriod(start: string, end: string | null): string {
  if (end === null) return `${formatMonth(start)} – Present`;
  if (start === end) return formatMonth(start);
  return `${formatMonth(start)} – ${formatMonth(end)}`;
}

export function formatYear(start: string, end: string | null): string {
  const s = start.slice(0, 4);
  if (end === null) return `${s} – now`;
  const e = end.slice(0, 4);
  return s === e ? s : `${s} – ${e}`;
}

/** Prefix an internal path with the configured base. */
export function withBase(path: string, base: string = import.meta.env.BASE_URL): string {
  const b = base.endsWith('/') ? base : `${base}/`;
  const p = path.startsWith('/') ? path.slice(1) : path;
  return `${b}${p}`;
}
