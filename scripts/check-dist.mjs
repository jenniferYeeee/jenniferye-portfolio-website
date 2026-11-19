#!/usr/bin/env node
// Post-build invariants on the static output in dist/.
// Fails if any internal link, asset, or same-page anchor would 404,
// or if a template leaked "undefined" / "[object Object]" into HTML.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
const BASE = (process.env.SITE_BASE ?? '/jenniferye-portfolio-website').replace(/\/$/, '');

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

if (!existsSync(DIST)) {
  console.error('dist/ not found. Run `npm run build` first.');
  process.exit(1);
}

const htmlFiles = walk(DIST).filter((f) => f.endsWith('.html'));
const errors = [];

function resolveTarget(urlPath) {
  if (!urlPath.startsWith(BASE + '/') && urlPath !== BASE) return null;
  let rel = urlPath.slice(BASE.length) || '/';
  rel = decodeURIComponent(rel);
  const candidates = rel.endsWith('/')
    ? [join(DIST, rel, 'index.html')]
    : [join(DIST, rel), join(DIST, rel, 'index.html'), join(DIST, rel + '.html')];
  return candidates.find((c) => existsSync(c) && statSync(c).isFile()) ?? false;
}

const idsByFile = new Map();
function idsIn(file) {
  if (!idsByFile.has(file)) {
    const html = readFileSync(file, 'utf8');
    idsByFile.set(file, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
  }
  return idsByFile.get(file);
}

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  const where = relative(DIST, file);

  // Only check visible text, not inline scripts.
  const text = html.replace(/<script[\s\S]*?<\/script>/g, '');
  for (const bad of ['>undefined<', '"undefined"', '[object Object]', 'NaN']) {
    if (text.includes(bad)) errors.push(`${where}: contains ${bad}`);
  }

  if (!/<html[^>]+lang="/.test(html)) errors.push(`${where}: <html> is missing lang`);
  if (!/<title>[^<]+<\/title>/.test(html)) errors.push(`${where}: missing <title>`);
  if (!/<meta name="description" content="[^"]+"/.test(html))
    errors.push(`${where}: missing meta description`);
  const h1s = html.match(/<h1[\s>]/g) ?? [];
  if (h1s.length !== 1) errors.push(`${where}: expected exactly one <h1>, found ${h1s.length}`);

  for (const m of html.matchAll(/\s(?:href|src|poster)="([^"]+)"/g)) {
    const raw = m[1];
    if (/^(https?:|mailto:|tel:|data:)/.test(raw)) continue;
    if (raw.startsWith('#')) {
      if (raw.length > 1 && !idsIn(file).has(raw.slice(1)))
        errors.push(`${where}: anchor ${raw} has no matching id`);
      continue;
    }
    if (!raw.startsWith('/')) {
      errors.push(`${where}: relative URL ${raw} (use withBase())`);
      continue;
    }
    const [path, hash] = raw.split('#');
    const target = resolveTarget(path);
    if (target === null) {
      errors.push(`${where}: ${raw} is outside base ${BASE}/ (use withBase())`);
    } else if (target === false) {
      errors.push(`${where}: broken link ${raw}`);
    } else if (hash && target.endsWith('.html') && !idsIn(target).has(hash)) {
      errors.push(
        `${where}: ${raw} points to missing anchor #${hash} in ${relative(DIST, target)}`,
      );
    }
  }
}

if (errors.length) {
  console.error(
    `check-dist: ${errors.length} problem(s)\n` + errors.map((e) => `  - ${e}`).join('\n'),
  );
  process.exit(1);
}
console.log(
  `check-dist: ${htmlFiles.length} pages OK (${dirname(relative(process.cwd(), DIST + 'x'))})`,
);
