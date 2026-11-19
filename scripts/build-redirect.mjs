#!/usr/bin/env node
// Builds a tiny site for the old GitHub Pages address that forwards every
// path to the same path on the new host, e.g.
//   /jenniferye-portfolio-website/work/x/  ->  https://jenye.pages.dev/work/x/
import { mkdirSync, writeFileSync } from 'node:fs';

const target = (process.env.REDIRECT_TO ?? 'https://jenye.pages.dev').replace(/\/$/, '');
const oldBase = process.env.OLD_BASE ?? '/jenniferye-portfolio-website';
const out = new URL('../dist-redirect/', import.meta.url).pathname;

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Moved to ${target.replace(/^https:\/\//, '')}</title>
<meta name="robots" content="noindex">
<link rel="canonical" href="${target}/">
<meta http-equiv="refresh" content="0; url=${target}/">
<script>
  var p = location.pathname.replace(${JSON.stringify(oldBase)}, '') || '/';
  location.replace(${JSON.stringify(target)} + p + location.search + location.hash);
</script>
</head>
<body>
<p>This site has moved to <a href="${target}/">${target.replace(/^https:\/\//, '')}</a>.</p>
</body>
</html>
`;

mkdirSync(out, { recursive: true });
writeFileSync(out + 'index.html', page);
writeFileSync(out + '404.html', page);
console.log(`build-redirect: ${oldBase}/* -> ${target}/*`);
