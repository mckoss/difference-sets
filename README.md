# Singer Difference Sets

An educational static site that explains and visualizes Singer difference sets.
Live at [mckoss.com/difference-sets](https://mckoss.com/difference-sets/). See
[PLAN.md](PLAN.md) for the outline and roadmap and
[CHECKLIST.md](CHECKLIST.md) for progress.

The site is built with [Astro](https://astro.build/). Lessons are Markdown
files in `src/content/lessons/` with TeX math typeset by KaTeX at build time;
interactive widgets live in `src/widgets/` and are embedded with
`<div data-widget="…">`.

## Develop

Requires Node.js 24 or newer.

```sh
npm ci
npm run dev
```

The dev server runs at `http://localhost:4321/difference-sets/`.

## Check and build

```sh
npm run typecheck
npm test
npm run test:e2e
npm run build
```

`npm test` runs the Vitest unit tests, including a check that the chord
diagrams match the SVGs rendered by the original Python notebook
(`tests/fixtures/notebook-svgs.json`). `npm run test:e2e` builds the site and
drives it in Chromium with Playwright, served by `tests/e2e/serve.mjs`; run `npx playwright install chromium`
once first. `npm run build` writes the site to `dist/`.

## Symbol images

The match-one deck's 155 sticker pictures in `public/symbols/` were generated
locally with the Z-Image Turbo model (via ComfyUI), one image per name with
seed 1000 + its number, then shrunk to 256 px WebP. The prompt template is

> a single cute cartoon NAME, flat vector sticker icon, bold black outline,
> bright saturated colors, centered, isolated on a plain pure white
> background, no text, no shadow

A few images were regenerated with a more specific prompt or another seed; the
exact slug, name, seed, and prompt for every image are in
[`docs/symbols-manifest.tsv`](docs/symbols-manifest.tsv), with more notes in
[`docs/symbols.md`](docs/symbols.md). To add images, run
`scripts/generate-symbols.sh <first number> "name" …`, review them, and list
them in `public/symbols/manifest.json` with a theme (`vehicle` or `other`).

## Deployment

GitHub Actions typechecks, tests, and builds every push and pull request. Pushes to `main` deploy
`dist/` to GitHub Pages.
