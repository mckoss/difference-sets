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
npm test
npm run build
```

`npm run build` typechecks and writes the site to `dist/`.

## Deployment

GitHub Actions builds every push and pull request. Pushes to `main` deploy
`dist/` to GitHub Pages.
