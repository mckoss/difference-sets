# Difference Sets — Plan

An educational static site that explains and visualizes **Singer difference
sets**: what a difference set is, how James Singer's 1938 construction builds
one from a finite projective geometry, and why the result matters. Every idea
should come with something the reader can poke at.

Published with GitHub Pages at
[mckoss.com/difference-sets](https://mckoss.com/difference-sets/).

## Audience and tone

- A curious reader comfortable with high-school algebra and modular
  arithmetic. Finite fields and projective planes are introduced from scratch.
- Lead with pictures and small examples; bring in notation only once the
  reader has seen the pattern.
- Each section ends with an interactive widget that lets the reader verify the
  claim for themselves.

## The mathematics in brief

A **(v, k, λ) difference set** is a k-element subset D of the cyclic group
ℤ/vℤ such that every nonzero residue occurs exactly λ times as a difference
d₁ − d₂ of elements of D. Example: D = {0, 1, 3} mod 7 gives each of 1…6
exactly once.

**Singer's theorem.** For every prime power q there is a
(q² + q + 1, q + 1, 1) difference set. More generally, for every m ≥ 2 there
is a difference set with parameters

    v = (q^(m+1) − 1)/(q − 1),  k = (q^m − 1)/(q − 1),  λ = (q^(m−1) − 1)/(q − 1).

**Construction (m = 2).**

1. Build GF(q³) from a primitive cubic over GF(q); let α be a primitive
   element, so α has order q³ − 1.
2. The nonzero elements of GF(q³), taken up to GF(q)* scalars, are the
   v = q² + q + 1 points of the projective plane PG(2, q). Since
   GF(q)* = ⟨α^v⟩, point i is the class of α^i for i ∈ ℤ/vℤ.
3. Multiplying by α permutes the points in a single v-cycle (the
   **Singer cycle**) and maps lines to lines.
4. Pick any line, e.g. the trace-zero plane
   {x : Tr(x) = x + x^q + x^(q²) = 0}. Its point indices
   D = {i mod v : Tr(α^i) = 0} form the difference set. The other lines are
   the translates D + j.

Small cases to feature: q = 2 → {0, 1, 3} mod 7 (the Fano plane);
q = 3 → {0, 1, 3, 9} mod 13; q = 4 → {0, 1, 4, 14, 16} mod 21.

## Site structure

The site is a **succession of short lessons**, each its own page, plus a set
of standalone **playgrounds** for exploring sets freely. Nothing is one long
scrolling page.

- **Home** (`/`): a one-screen hook ({0, 1, 3} mod 7), then the lesson path
  and the playground list.
- **Lessons** (`/lessons/<nn>-<slug>/`): one idea per page, readable in a few
  minutes. Each has a "you'll learn" line, prose with small inline widgets, a
  short "try it" exercise, and previous/next links. Each links to the
  playground that goes deeper.
- **Playgrounds** (`/playgrounds/<slug>/`): full-page tools with no required
  reading. Their state lives in the URL (`?q=7&poly=1,1,0,1`) so lessons can
  link straight to a configured view and readers can share one.

### The story arc

The lessons build one question toward its answer: *difference sets look like
they need a brute-force search — how does Singer write one down directly?*
The answer is that a difference set is a projective plane in disguise, and
projective planes come from finite fields. So the middle of the path gives
fields and planes real care, and Singer's algorithm then arrives as a
consequence rather than a trick.

### Lessons

**Part I — The puzzle**

1. **Differences on a circle.** What a (v, k, λ) difference set is. Pick
   points on a clock face and watch the difference tally. Brute force finds
   {0, 1, 3} mod 7 instantly, but the search space C(v, k) explodes; a live
   counter shows how quickly hand search becomes hopeless.
2. **Rotations that never overlap too much.** Translates D + j. For a
   difference set, any two translates share exactly λ points; for λ = 1 the
   translates behave like *lines*: two of them meet in exactly one point.
   This is the clue that leads to geometry.

**Part II — Projective planes**

3. **A geometry with seven points.** The Fano plane: every two points lie on
   one line, every two lines meet in one point. Lines of the Fano plane are
   the 7 rotations of {0, 1, 3}. Interactive: click two points to see their
   line, click two lines to see their intersection.
4. **Projective planes in general.** The axioms, order n, the counts
   n² + n + 1 points and n + 1 points per line, duality. A plane is *cyclic*
   when one symmetry carries every point around a single cycle, and a cyclic
   plane is exactly a planar difference set. So: *where do planes with that
   symmetry come from?*

**Part III — Finite fields**

5. **Clock arithmetic that divides.** GF(p): addition and multiplication
   tables, why every nonzero element needs an inverse, and why ℤ/6ℤ fails.
6. **Fields with p^k elements.** Polynomials over GF(p) reduced modulo an
   irreducible polynomial. Build GF(4), GF(8), and GF(9) by hand in widgets.
   Irreducible versus reducible moduli, shown by watching inverses fail.
7. **One element to generate them all.** Primitive elements: the powers of α
   visit every nonzero element, so multiplication becomes adding exponents
   (log tables). Primitive polynomials, and how to test one without trying
   every power: check α^((p^k − 1)/r) ≠ 1 for each prime r dividing p^k − 1.

**Part IV — Planes from fields**

8. **Coordinates for a projective plane.** PG(2, q): points are the
   1-dimensional subspaces of GF(q)³ (homogeneous coordinates [x : y : z]),
   lines are the 2-dimensional subspaces. Count them and check the axioms.
   Draw PG(2, 2) as the Fano plane and PG(2, 3) with 13 points.
9. **The field hiding inside the plane.** GF(q³) *is* GF(q)³ as a vector
   space, so its nonzero elements up to GF(q)* scalars are the points of
   PG(2, q). Since GF(q)* = ⟨α^v⟩, each point is α^i for exactly one
   i mod v, which gives every point a number.
10. **The Singer cycle.** Multiplying by α is GF(q)-linear, so it sends lines
    to lines, and it moves point i to point i + 1, cycling through all v
    points. So PG(2, q) is cyclic, and by Lesson 4 any one of its lines is a
    difference set. Animate the rotation carrying one line onto the next.

**Part V — Singer's algorithm**

11. **Writing down a difference set.** Choose one line: the trace-zero plane
    {x : x + x^q + x^(q²) = 0}. Then D = {i mod v : Tr(α^i) = 0}. Step
    through it for q = 2, 3, 4: compute α^i, take the trace, keep or reject.
    This takes v field multiplications, with no search, set against the
    brute-force count from Lesson 1.
12. **Many sets, few shapes.** Multipliers: t·D for t coprime to v is another
    difference set. Equivalence under translation, negation, and
    multipliers; Hall's multiplier theorem (multiplying by p gives a
    translate). Gallery of the distinct classes per q (the notebook port).

**Part VI — The frontier**

13. **Is every planar difference set a Singer set?** No one has found a
    planar difference set that isn't one. Present the conjectures with care:
    - *Prime power conjecture*: a planar difference set of order n exists
      only when n is a prime power. Proven for many cases and verified by
      computer for all n below 2·10⁹ (Baumert and Gordon, 2004).
    - *Stronger conjecture*: every cyclic projective plane is Desarguesian,
      i.e. every planar difference set is equivalent to a Singer set.
    - Context: Bruck–Ryser rules out orders such as 6 and 14; order 10 was
      ruled out by a large computer search (Lam, 1989); non-Desarguesian
      planes exist (order 9), but none known is cyclic.
    - Contrast: for higher-dimensional Singer parameters the analogue is
      *false*; Gordon–Mills–Welch sets share Singer parameters without being
      equivalent to them.

    Playground tie-in: exhaustive search for small v finds only sets
    equivalent to Singer sets.
14. **Where difference sets show up.** Modular Golomb rulers, optical
    orthogonal codes, sequences with two-valued autocorrelation, sensor array
    placement, and higher-dimensional Singer sets PG(m, q).

Citations are checked against primary sources before Lesson 13 ships.

### Playgrounds

- **Difference set workbench.** Chord diagram for any v and subset, a
  difference histogram, translates, and an "is it a difference set?" verdict.
- **Finite field calculator.** GF(p^k) with a chosen modulus: addition and
  multiplication tables, inverses, powers and log tables, an
  irreducible/primitive check.
- **Projective plane explorer.** PG(2, q) for small q: points, lines,
  incidence, both the coordinate numbering and the Singer numbering.
- **Singer construction stepper.** Choose q and a primitive polynomial, then
  step through α^i, the trace, and the resulting D, with every intermediate
  value shown.
- **Singer classes gallery.** The current home page: distinct classes for
  each q, as chord diagrams.
- **Search versus construction.** Backtracking search for planar sets at
  small v, in a worker, with each result classified against the Singer
  classes; set its running time beside Singer's.
- **Large-q explorer.** Singer sets for q up to about 1000, with Canvas
  rendering, a histogram, and a download.

## Architecture

- **Vite + TypeScript**, no UI framework, built as a Vite multi-page app.
  `src/site.ts` holds one manifest of lessons and playgrounds (slug, title,
  part, order); the shared header, navigation, and previous/next links come
  from it, and the build input list is generated from it.
- **Math core (`src/math/`)**, pure and fully unit-tested:
  - `difference.ts`: differences, translates, multipliers.
  - `poly.ts`, `field.ts`: GF(p) polynomials and a GF(p^k) element type with
    irreducibility and primitivity tests.
  - `projective.ts`: PG(2, q) points and lines in coordinates.
  - `singer.ts`: Singer sets with the intermediate steps exposed for the
    stepper; classes up to equivalence.
  - `search.ts`: backtracking search for planar difference sets.
- **Widgets (`src/widgets/`)**: reusable interactive components, so a lesson
  can embed a small version of a playground.
- **Visualization (`src/viz/`)**: SVG for chord diagrams, planes, tables, and
  incidence matrices; Canvas only for large v.
- **Typesetting**: KaTeX for formulas, rendered at build time where practical.
- The **version** is read from `package.json` and shown in the header.
  Light and dark themes via CSS custom properties.

## Testing

- Vitest unit tests for the math core: known small sets, the difference-set
  property for every Singer set with q up to a modest bound, multiplier
  theorem checks, field axioms on small fields.
- Playwright e2e tests in Chromium: every manifest page loads without
  console errors, previous/next links form one chain, playground URL state
  round-trips, and each widget responds to input.
- CI runs typecheck, unit tests, and the build on every push and PR; pushes to
  `main` deploy to Pages.

## Milestones

1. **Scaffold**: repo, Vite build, Pages deploy. *(v0.1.0)*
2. **Notebook port**: Singer construction, classes, chord-diagram gallery.
   *(v0.2.0)*
3. **Multi-page skeleton**: manifest, shared layout and navigation, home page
   with the lesson path, and the classes gallery moved to its playground.
4. **Part I–II**: Lessons 1–4 and the difference-set workbench.
5. **Part III**: Lessons 5–7 and the finite field calculator.
6. **Part IV**: Lessons 8–10 and the projective plane explorer.
7. **Part V**: Lessons 11–12 and the Singer stepper.
8. **Part VI**: Lessons 13–14, search versus construction, large-q explorer.
9. **Polish**: accessibility, mobile layout, performance for large q.

## Open questions

- Should the large-q explorer go beyond m = 2 by default?
- How much of the multiplier theorem to prove versus demonstrate?
