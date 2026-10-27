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

- [ ] `field.ts`: ℤ/nℤ and GF(p^k) arithmetic, irreducibility, primitivity, isomorphisms
- [ ] Widgets: ℤ/nℤ tables, scrambled prime field, GF(p^k) tables, log table, Frobenius
- [ ] Finite field calculator playground
- [ ] Lessons 5–9 written

## Checkpoint 4: Part IV (Lessons 10–13)

- [ ] `projective.ts`: PG(2, q) points, lines, Singer numbering
- [ ] three.js GF(q)³ grid with lines and planes through the origin
- [ ] Projective plane explorer playground; Singer cycle animation
- [ ] Lessons 10–13 written

## Checkpoint 5: Part V (Lessons 14–15)

- [ ] Singer construction stepper widget and playground
- [ ] Multiplier and class widgets
- [ ] Lessons 14–15 written

## Checkpoint 6: Part VI (Lessons 16–17)

- [ ] Citations verified against sources
- [ ] Search versus construction playground (worker)
- [ ] Large-q explorer (Canvas)
- [x] Lesson 16 written (higher-dimensional Singer sets, m-sequences, GMW contrast)
- [ ] Lesson 17 written

## Checkpoint 6b: Part VII Applications (Lessons 18–23)

- [x] Outline: Part VI renumbered (16 Beyond the plane, 17 completeness), Part VII added
- [x] `singerPG.ts` (PG(m, q) Singer sets, m-sequences, shift registers) and `sequences.ts` (correlation), tested
- [x] Lesson 18 and the match-one deck maker playground (150 symbol images, play, verify, print)
- [x] Lesson 19 coded-aperture widget; Lesson 20 echo finder (`aperture.ts`)
- [x] Lesson 21 majority-logic decoder (`codes.ts`, parameters computed in tests)
- [x] Lesson 22 wake-up schedules (`schedule.ts`); Lesson 23 Golomb ruler (`ruler.ts`)
- [x] Lesson 4 forward reference to Lesson 18
- [ ] Optional Lesson 24: declustered RAID rebuild

## Checkpoint 7: Polish

- [ ] Accessibility pass, mobile pass, performance for large q
