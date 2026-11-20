# Working in this repo

Jennifer Ye's portfolio. Astro + TypeScript, static output, hosted on Cloudflare Pages
(free plan) at the root of its `*.pages.dev` domain.

## How deploys work

CI runs `npm run verify` on every push. Only when it passes on `main` does CI move the
`production` branch to that commit; Cloudflare Pages builds and serves `production`.
Never push to `production` by hand. The old GitHub Pages address
(`jenniferyeeee.github.io/jenniferye-portfolio-website/`) serves a redirect built by
`scripts/build-redirect.mjs`.

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

Keep videos H.264 MP4 under ~15 MB; `check:dist` fails any file over Cloudflare's 25 MiB limit (`ffmpeg -i in.mov -vcodec libx264 -crf 26 -preset veryfast -an out.mp4`).
`npm run media:report` lists what's still a placeholder.

**Add a sidequest.** Create `src/content/sidequests/<kebab-slug>.md` (fields in
`sidequestSchema`). Put photos in `public/media/sidequests/<slug>/` and list them:

```yaml
photos:
  - src: media/sidequests/<slug>/01.jpg # no leading slash
    alt: What the photo shows, in a sentence.
```

With no photos, the carousel shows three "Photo coming soon" frames. Keep each photo
under ~1 MB (export at ~2000px wide, JPEG/WebP). The page background drifts between the
light palettes in `src/lib/sky.ts` as you scroll from one sidequest to the next.

**Change copy.** The hero lines and particle sentence are `hero` in `src/data/site.ts`
(unit tests cap each typed line at 64 characters; e2e checks each fits on one line from
768px up). Bio and contact live in `src/pages/index.astro` and `src/data/site.ts`.

## Design rules

- Palette and type scale are CSS variables in `src/styles/global.css`. Don't add colors.
  `--butter` is reserved for the marker-swash sidequests link in About; the sidequests page
  background palettes live in `src/lib/sky.ts`.
- One typeface (Inter). Sentence case. No all-caps labels. Warm, low-contrast neutrals.
- The hero is the one motion moment: the intro sentence's letters laid out in reading
  order, bobbing and drifting in and out of focus (sharp near the cursor), with the intro
  typed one line at a time in the middle (static paragraphs on phones). Timing lives in
  `src/lib/typewriter.ts`, layout in `src/lib/particles.ts`. Plus view transitions between
  tile and project page. Everything respects `prefers-reduced-motion`.
- Tests that need a mouse or a wide viewport are tagged `@desktop` in the title; the
  mobile project skips them via `grepInvert`.
- Internal URLs go through `withBase()`; `check:dist` fails otherwise.

## Local setup

```sh
npm ci
npx playwright install chromium   # or set PLAYWRIGHT_CHROMIUM_EXECUTABLE=/path/to/chrome
npm run dev
```
