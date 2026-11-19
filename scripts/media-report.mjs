#!/usr/bin/env node
// Lists which projects still show placeholder video or diagram.
import { readFileSync, readdirSync } from 'node:fs';
import { parse } from 'yaml';

const dir = new URL('../src/content/projects/', import.meta.url).pathname;
const rows = readdirSync(dir)
  .filter((f) => f.endsWith('.md'))
  .map((f) => {
    const fm = parse(readFileSync(dir + f, 'utf8').split('---')[1]);
    return { project: f.replace(/\.md$/, ''), video: fm.video.status, diagram: fm.diagram.status };
  });
console.table(rows);
const pending = rows.filter((r) => r.video === 'pending' || r.diagram === 'pending').length;
console.log(`${pending} of ${rows.length} projects still have placeholder media.`);
