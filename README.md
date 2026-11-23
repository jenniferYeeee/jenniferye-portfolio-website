# jenniferye-portfolio-website

Personal portfolio of Jennifer Ye, robotics software engineer.

Live: https://jenye.pages.dev

Built with [Astro](https://astro.build) and TypeScript. Every push runs a fixed verification
suite (format, lint, typecheck, unit, build, link check, Playwright e2e and accessibility);
the site only deploys (to Cloudflare Pages) when it passes. See [AGENTS.md](AGENTS.md) for how it fits together.

```sh
npm ci
npm run dev       # http://localhost:4321/
npm run verify    # full suite
```

Visitor analytics: Cloudflare Web Analytics, enabled on the `jenye` Pages project (Metrics tab). Cloudflare injects its beacon at deploy time, so there is no analytics code in this repo. No cookies, so no consent banner.
