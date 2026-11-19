# jenniferye-portfolio-website

Personal portfolio of Jennifer Ye, robotics software engineer.

Live: https://jenniferyeeee.github.io/jenniferye-portfolio-website/

Built with [Astro](https://astro.build) and TypeScript. Every push runs a fixed verification
suite (format, lint, typecheck, unit, build, link check, Playwright e2e and accessibility);
the site only deploys when it passes. See [AGENTS.md](AGENTS.md) for how it fits together.

```sh
npm ci
npm run dev       # http://localhost:4321/jenniferye-portfolio-website/
npm run verify    # full suite
```
