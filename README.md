# Singer Difference Sets

An educational static site that explains and visualizes Singer difference sets.
Live at [mckoss.com/difference-sets](https://mckoss.com/difference-sets/). See
[PLAN.md](PLAN.md) for the outline and roadmap.

## Develop

Requires Node.js 24 or newer.

```sh
npm ci
npm run dev
```

The dev server runs at `http://localhost:5173/difference-sets/`.

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
drives it in Chromium with Playwright; run `npx playwright install chromium`
once first. `npm run build` writes the site to `dist/`.

## Deployment

GitHub Actions typechecks, tests, and builds every push and pull request. Pushes to `main` deploy
`dist/` to GitHub Pages.
