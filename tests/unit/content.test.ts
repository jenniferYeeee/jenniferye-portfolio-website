import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';
import { projectSchema } from '../../src/content/schema';
import { experience } from '../../src/data/site';

const DIR = join(process.cwd(), 'src/content/projects');
const files = readdirSync(DIR).filter((f) => f.endsWith('.md'));

function load(file: string) {
  const raw = readFileSync(join(DIR, file), 'utf8');
  const match = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(raw);
  if (!match) throw new Error(`${file}: missing frontmatter`);
  return { id: file.replace(/\.md$/, ''), data: parse(match[1] ?? ''), body: match[2] ?? '' };
}

const projects = files.map(load);

describe('project content', () => {
  it('has at least three featured projects', () => {
    expect(projects.filter((p) => p.data.featured).length).toBeGreaterThanOrEqual(3);
  });

  it.each(projects.map((p) => [p.id, p] as const))('%s matches the schema', (_id, p) => {
    const result = projectSchema.safeParse(p.data);
    expect(result.success, JSON.stringify(result.error?.issues, null, 2)).toBe(true);
  });

  it.each(projects.map((p) => [p.id, p] as const))('%s has a kebab-case slug', (id) => {
    expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it.each(projects.map((p) => [p.id, p] as const))('%s has a written overview', (_id, p) => {
    expect(p.body.trim().length).toBeGreaterThan(80);
  });

  it('uses unique order values', () => {
    const orders = projects.map((p) => p.data.order);
    expect(new Set(orders).size).toBe(orders.length);
  });

  it('points every ready media file at a file that exists in public/', () => {
    for (const p of projects) {
      for (const key of ['video', 'diagram'] as const) {
        const m = p.data[key];
        if (m.status !== 'ready') continue;
        expect(existsSync(join('public', m.src)), `${p.id}.${key}: public/${m.src}`).toBe(true);
        if (m.poster)
          expect(existsSync(join('public', m.poster)), `${p.id}.${key}.poster`).toBe(true);
      }
      for (const x of (p.data.extras ?? []) as { src: string; poster?: string }[]) {
        expect(existsSync(join('public', x.src)), `${p.id}.extras: public/${x.src}`).toBe(true);
        if (x.poster)
          expect(existsSync(join('public', x.poster)), `${p.id}.extras.poster`).toBe(true);
      }
      const report = p.data.report as { src: string } | undefined;
      if (report)
        expect(existsSync(join('public', report.src)), `${p.id}.report: public/${report.src}`).toBe(
          true,
        );
    }
  });
});

describe('media schema', () => {
  const base = projects[0]?.data;
  it('rejects a ready video with no src', () => {
    const bad = { ...base, video: { status: 'ready', alt: 'A demo of the system working' } };
    expect(projectSchema.safeParse(bad).success).toBe(false);
  });
  it('rejects a src with a leading slash', () => {
    const bad = {
      ...base,
      video: { status: 'ready', src: '/media/x.mp4', alt: 'A demo of the system working' },
    };
    expect(projectSchema.safeParse(bad).success).toBe(false);
  });
  it('rejects an end date before the start', () => {
    expect(projectSchema.safeParse({ ...base, start: '2025-05', end: '2024-01' }).success).toBe(
      false,
    );
  });
});

describe('experience', () => {
  it('is ordered most recent first', () => {
    const starts = experience.map((r) => r.start);
    expect([...starts].sort().reverse()).toEqual(starts);
  });
  it('has at most one ongoing role', () => {
    expect(experience.filter((r) => r.end === null).length).toBeLessThanOrEqual(1);
  });
});
