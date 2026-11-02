# Checklist

Working list for the lesson build-out. See PLAN.md for the content of each
lesson. Each checkpoint lands on `main` as its own PR and deploy.

## Checkpoint 1: Astro skeleton (v0.3.0)

- [x] Astro with Markdown lessons and build-time KaTeX
- [x] Numbered sidebar outline, previous/next chain, mobile Contents toggle
- [x] Home page with the hook and the lesson path
- [x] Singer classes gallery as a playground with `?q=` URL state
- [x] Outline gaps filled: Lesson 9 (fields inside fields), Lesson 10 (vectors over a finite field)
- [x] OEIS A058241 link and the φ(v)/6e class count, tested
- [x] Lesson 16 outline: completeness conjecture and hints at proof
- [x] Unit tests for the outline; Playwright tests for navigation, KaTeX, playground, mobile

## Checkpoint 2: Part I–II (Lessons 1–4)

- [x] Difference-set workbench widget and playground (`?v=&set=` URL state, translates follow it)
- [x] Translates widget (rotate D, show overlaps, table of all pairs)
- [x] Fano plane widget (click points and lines, step the rotation)
- [x] Clock widgets (wrap n onto ℤ/vℤ; a − b as steps around the clock) and brute-force count/search
- [x] Lessons 1–4 written
- [x] Writing conventions added to PLAN.md

## Checkpoint 3: Part III (Lessons 5–9)

- [x] `field.ts`: ℤ/vℤ and GF(p^e) arithmetic, irreducibility, primitivity, isomorphisms
- [x] Widgets: ℤ/vℤ tables, multiplication clock, Euclid stepper, scrambled prime field, polynomial long division, GF(p^e) tables, powers and log table, Frobenius, isomorphism finder
- [x] Finite field calculator playground (`?v=6`, `?p=2&e=3&poly=1,1,0,1&g=…&poly2=…`)
- [x] Lessons 5–9 written

## Checkpoint 4: Part IV (Lessons 10–13)

- [x] `projective.ts`: GF(q)³, PG(2, q) points, lines, incidence, Singer numbering, tested
- [x] three.js GF(q)³ grid with lines and planes through the origin (`vector-grid`, three.js lazy-loaded)
- [x] PG(2, q) explorer playground (`?q=&points=` / `?lines=`); field-points table; Singer cycle animation
- [x] Lessons 10–13 written

## Checkpoint 5: Part V (Lessons 14–15)

- [x] `construction.ts`: trace by conjugates, trace line, multiples, translate offsets, reduced sets, multiplier classes, tested against `nonIsomorphicSingerSets`, φ(v)/3e, and φ(v)/6e
- [x] Singer construction stepper widget and playground (`?q=&i=`)
- [x] Multiplier explorer widget (t·D, translate or mirror, classes grouped by t)
- [x] Lessons 14–15 written

## Checkpoint 6: Part VI (Lessons 16–17)

- [x] Citations verified against sources
- [x] Search versus construction playground (worker)
- [x] Large-q explorer (Canvas)
- [x] Lesson 16 written (higher-dimensional Singer sets, m-sequences, GMW contrast)
- [x] Lesson 17 written (completeness conjecture, plane-order table, Bruck–Ryser checker, polynomial identity)
- [x] `planarSearch.ts`, `singerFast.ts`, `planeOrders.ts`, `groupRing.ts`, tested (search counts match A058241 and A335866)

## Checkpoint 6b: Part VII Applications (Lessons 18–23)

- [x] Outline: Part VI renumbered (16 Beyond the plane, 17 completeness), Part VII added
- [x] `singerPG.ts` (PG(m, q) Singer sets, m-sequences, shift registers) and `sequences.ts` (correlation), tested
- [x] Lesson 18 and the match-one deck maker playground (150 symbol images, play, verify, print)
- [x] Lesson 19 coded-aperture widget; Lesson 20 echo finder (`aperture.ts`)
- [x] Lesson 21 majority-logic decoder (`codes.ts`, parameters computed in tests)
- [x] Lesson 22 wake-up schedules (`schedule.ts`); Lesson 23 Golomb ruler (`ruler.ts`)
- [x] Lesson 4 forward reference to Lesson 18
- [x] Lesson 24 race charts (`race.ts`, `raceSearch.ts`, and the generated `raceTable.ts`: the fairest rotation for 2–8 lanes and up to 60 cars, checked against brute force and against Pope and Young's Partial Perfect-N gaps)
- [x] Lesson 25 declustered RAID rebuild (`raid.ts`, `raid-rebuild` widget)
- [x] Lesson 26 difference sets in cryptography (`bent.ts`, `bent-function` widget)

## Checkpoint 7: Polish

- [x] Prerequisite audit (2026-11-02): seven reviewers checked that every lesson uses only concepts explained before it, one per Part; 0 blocking, 31 rough, 48 nit findings, 4 factual slips (Lesson 3 Fano answer, Lesson 4 "order 1000", Lessons 16–17 "(63, 31, 15) is the smallest", Lesson 25 "same amount of data"); fixes applied per lesson. Summary in `docs/lesson-audit.md`.
- [x] Glossary and topic search (2026-11-02, v0.15.0): `src/glossary.ts` holds ~100 terms and ~30 symbols, each tied to the lesson that defines it; `/glossary/` lists them alphabetically; the `rehypeGlossary` plugin links the first use of each term on a lesson page (dotted underline, definition on hover or tap) and anchors its defining use in its own lesson. Sidebar search box searches every lesson section, glossary term, and playground (`search-index.json`) and links to section anchors. Wrap an everyday use of a term in `<span class="no-gloss">` to keep it unlinked.
- [x] Printable PDF (2026-11-02, v0.16.0): `/print/` holds the whole text; `npm run pdf` (CI, after e2e) paginates it with Paged.js into `dist/singer-difference-sets.pdf`: cover with version, build date, and the site URL; running heads with the lesson title and the interactive URL; contents and cross-references with page numbers; glossary, symbols, and an index whose page numbers come from the glossary anchors. Widgets print in their opening state (coded aperture, echo finder, and planar search are run first; RAID fails disk 0). `PDF_ONLY=n`, `PDF_SHOTS=dir`, `PDF_DEBUG=1` help debug layout.
- [ ] Accessibility pass, mobile pass, performance for large q
