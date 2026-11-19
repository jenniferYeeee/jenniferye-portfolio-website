/**
 * Guards the guardrails. These tests fail if anyone (human or agent) weakens
 * the verification pipeline: removes a stage, deletes a required spec,
 * skips tests, or lets deploy run without verification.
 *
 * Changing this file should be a deliberate, reviewed decision.
 */
import { describe, expect, it } from 'vitest';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const read = (p: string) => readFileSync(join(process.cwd(), p), 'utf8');
const pkg = JSON.parse(read('package.json')) as { scripts: Record<string, string> };

const REQUIRED_FAST = ['format:check', 'lint', 'typecheck', 'test:unit'];
const REQUIRED_FULL = ['verify:fast', 'build', 'check:dist', 'test:e2e'];
const REQUIRED_E2E_SPECS = [
  'smoke.spec.ts',
  'projects.spec.ts',
  'accessibility.spec.ts',
  'responsive.spec.ts',
  'motion.spec.ts',
];

function stages(script: string | undefined): string[] {
  return (script ?? '').split('&&').map((s) => s.trim().replace(/^npm run /, ''));
}

describe('verification pipeline', () => {
  it('verify:fast runs every static stage in order', () => {
    expect(stages(pkg.scripts['verify:fast'])).toEqual(REQUIRED_FAST);
  });

  it('verify runs fast checks, build, dist check, and e2e in order', () => {
    expect(stages(pkg.scripts['verify'])).toEqual(REQUIRED_FULL);
  });

  it('typecheck uses astro check (covers .astro and .ts)', () => {
    expect(pkg.scripts['typecheck']).toBe('astro check');
  });

  it.each(REQUIRED_E2E_SPECS)('e2e spec %s exists', (spec) => {
    expect(existsSync(join('tests/e2e', spec))).toBe(true);
  });

  it('no test is skipped, focused, or marked fixme', () => {
    const dirs = ['tests/e2e', 'tests/unit'];
    for (const d of dirs) {
      for (const f of readdirSync(d).filter((n) => n.endsWith('.ts'))) {
        if (f === 'harness.test.ts') continue;
        const src = read(join(d, f));
        expect(src, `${d}/${f}`).not.toMatch(/\b(it|test|describe)\.(skip|only|fixme|todo)\b/);
      }
    }
  });

  it('pre-commit runs verify:fast and pre-push runs verify', () => {
    expect(read('.husky/pre-commit')).toMatch(/npm run verify:fast/);
    expect(read('.husky/pre-push')).toMatch(/npm run verify\b(?!:)/);
  });

  it('CI runs verify and deploy depends on it', () => {
    const ci = read('.github/workflows/ci.yml');
    expect(ci).toMatch(/run: npm run verify\s*$/m);
    expect(ci).toMatch(/needs: verify/);
    expect(ci).toMatch(/forbidOnly|CI: true/);
  });

  it('playwright forbids .only in CI and fails on retries hiding flakes', () => {
    const cfg = read('playwright.config.ts');
    expect(cfg).toMatch(/forbidOnly:\s*!!process\.env\.CI/);
    expect(cfg).toMatch(/retries:\s*0/);
  });
});
