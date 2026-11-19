# Working in this repo

Jennifer Ye's portfolio. Astro + TypeScript, static output, deployed to GitHub Pages.

## The one rule

Run `npm run verify` before you say a change is done. It must pass. Hooks run it on
`git push` and CI runs it on every PR; deploy only happens after it passes on `main`.

Verification is layered, cheapest first. Push a correctness rule as far up this list as it
can go:

1. **Codebase.** Types and the Zod schema in `src/content/schema.ts` make bad content
   impossible to build. Media is `pending` or `ready`, never half-filled.
2. **Static analysis.** `format:check`, `lint` (ESLint strict), `typecheck` (`astro check`).
3. **Verification.** `test:unit` (Vitest), `check:dist` (every internal link, asset and
   anchor in the built site resolves; one `<h1>` per page), `test:e2e` (Playwright against
   the production build: navigation, every project page, axe WCAG 2.2 AA, no overflow from
   320 to 1440px, reduced motion, view-transition names).
4. **Prose.** This file.
5. **Human review.** PRs.

`tests/unit/harness.test.ts` guards the pipeline itself. If it fails, you removed a stage,
a required spec, or added `.skip`/`.only`. Don't edit it to make it pass unless the human
asked for that change.

## Common tasks

**Add a project.** Create `src/content/projects/<kebab-slug>.md` with the frontmatter
in `schema.ts`. Tests pick it up automatically.

**Add a demo video or diagram.** Put the file under `public/media/<slug>/`, then:

```yaml
video:
  status: ready
  src: media/<slug>/demo.mp4 # no leading slash
  poster: media/<slug>/poster.jpg # optional, shown on the home tile
  alt: What the video shows, in a sentence.
```

Keep videos H.264 MP4 under ~15 MB (`ffmpeg -i in.mov -vcodec libx264 -crf 26 -preset veryfast -an out.mp4`).
`npm run media:report` lists what's still a placeholder.

**Change copy.** Bio and contact live in `src/pages/index.astro` and `src/data/site.ts`.

## Design rules

- Palette and type scale are CSS variables in `src/styles/global.css`. Don't add colors.
- One typeface (Geist). Sentence case. No all-caps labels.
- One orchestrated motion moment (hero) plus view transitions between tile and project
  page. Everything respects `prefers-reduced-motion`.
- Internal URLs go through `withBase()`; `check:dist` fails otherwise.

## Local setup

```sh
npm ci
npx playwright install chromium   # or set PLAYWRIGHT_CHROMIUM_EXECUTABLE=/path/to/chrome
npm run dev
```
