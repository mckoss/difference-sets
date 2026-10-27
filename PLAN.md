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

## Writing conventions

Rules every lesson follows, so the path reads as one voice.

- **Assume only arithmetic and high-school algebra.** No familiarity with
  Greek letters or math symbols is assumed. At its first use, spell out and
  explain every symbol: "λ (the Greek letter lambda)", ∈ ("is an element
  of"), ⊆ ("is a subset of"), ∩ ("intersection": the points in both), ≡
  ("is congruent to"), ↦ ("goes to"), ∑, and the binomial coefficient
  C(v, k), read "v choose k". Prefer words when a symbol isn't needed.
- **Fixed letters.** The parameters are always (v, k, λ): v is the number of
  points on the clock (the modulus), k is the number of elements of the set
  D, and λ is how many times each nonzero difference occurs. For planes, n
  is the order, with v = n² + n + 1 and k = n + 1. Don't reuse these letters
  for anything else.
- **Clock notation.** Lesson 1 introduces ℤ (the integers
  …, −2, −1, 0, 1, 2, …), vℤ (the multiples of v), and ℤ/vℤ (the integers
  mod v: numbers that differ by a multiple of v count as the same, so there
  are exactly v residues 0, 1, …, v − 1, the points on the clock face), with
  the notation a ≡ b (mod v). Later lessons use these freely and may point
  back to Lesson 1.
- **Notation boxes.** When a lesson introduces notation, put it in a
  `<aside class="notation">` box (with a `<span class="notation-title">`
  heading) so readers can find it again.
- **Interactive pictures first.** Whenever a widget can show a concept
  (wrapping a number onto the clock, a difference as steps around the clock,
  a translate, a line of the Fano plane), put it next to the prose and let the
  reader drive it before the formula appears.
- **Each lesson** has a "you'll learn" lede, a "Try it" exercise whose answer
  hides in a `<details>` block, and a link to the playground that goes
  deeper. It rests only on earlier lessons and defines every term before use.

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

The construction rests entirely on finite fields, so this part goes slowly:
first the fields of prime order, then the fact that they are all just the
integers mod p, and only then the prime-power fields built on top of them.

5. **What a field is, and which clocks are fields.** The field axioms in
   plain terms: add, subtract, multiply, and divide by anything nonzero.
   Try ℤ/nℤ for several n with live addition and multiplication tables. For
   n = 6, 2 · 3 = 0 and 2 has no inverse; for prime p every nonzero row of
   the multiplication table is a permutation, and the extended Euclidean
   algorithm finds each inverse. Conclusion: ℤ/nℤ is a field exactly when n
   is prime. Name it GF(p).
6. **Every field with p elements is ℤ/pℤ.** Start from any field F. Add 1 to
   itself: 1, 1 + 1, 1 + 1 + 1, … In a finite field this eventually returns
   to 0, and the first time it does is a prime p (a composite would give zero
   divisors), the *characteristic*. The multiples of 1 form a copy of
   ℤ/pℤ inside F, the *prime subfield*. If F has exactly p elements, that
   copy is all of F, so k ↦ k · 1 is an isomorphism and there is only one
   field of order p up to relabeling. Widget: a field of order p shown with
   scrambled symbols; the reader recovers the isomorphism by counting
   1, 1 + 1, …, and the tables snap back into clock arithmetic. Corollary:
   any finite field is a vector space over its prime subfield, so its size
   is p^k. That is why the next lesson only looks at prime powers.
7. **Fields with p^k elements, built from polynomials.** Polynomials with
   coefficients in GF(p), reduced modulo a fixed polynomial f of degree k.
   Elements are the remainders a₀ + a₁x + … + a_(k−1)x^(k−1), that is,
   k-tuples over GF(p), matching the vector space picture from Lesson 6.
   The parallel with Lesson 5 is exact: irreducible polynomials play the
   role of primes. Modulo a reducible f, zero divisors appear just as in
   ℤ/6ℤ; modulo an irreducible f, every nonzero element has an inverse
   (the extended Euclidean algorithm again, now for polynomials). Build
   GF(4), GF(8), and GF(9) by hand in widgets, and note that GF(4) is not
   ℤ/4ℤ. Different irreducible moduli give the same field up to relabeling;
   the widget finds the explicit isomorphism between two versions of GF(8).
8. **One element to generate them all.** Primitive elements: the powers of α
   visit every nonzero element, so multiplication becomes adding exponents
   (log tables). Primitive polynomials, and how to test one without trying
   every power: check α^((p^k − 1)/r) ≠ 1 for each prime r dividing p^k − 1.

9. **Fields inside fields.** The freshman's dream (x + y)^p = x^p + y^p in
   characteristic p, the Frobenius map x ↦ x^q, and GF(q) as the elements
   of GF(q³) it fixes, which is {0} ∪ ⟨α^(q² + q + 1)⟩. For q = p^e, GF(q³) is
   built directly as polynomials of degree below 3e over GF(p), as the code
   does. This supplies everything the trace needs in Part V.

**Part IV — Planes from fields**

10. **Vectors over a finite field.** GF(q)³ as a finite grid of q³ vectors,
    shown in 3D with three.js. Spans and subspaces; every line through the
    origin holds q − 1 nonzero vectors, so there are (q³ − 1)/(q − 1) =
    q² + q + 1 lines through the origin, and as many planes.
11. **Coordinates for a projective plane.** PG(2, q): points are the
   1-dimensional subspaces of GF(q)³ (homogeneous coordinates [x : y : z]),
   lines are the 2-dimensional subspaces. Count them and check the axioms.
   Draw PG(2, 2) as the Fano plane and PG(2, 3) with 13 points.
12. **The field hiding inside the plane.** GF(q³) *is* GF(q)³ as a vector
   space, so its nonzero elements up to GF(q)* scalars are the points of
   PG(2, q). Since GF(q)* = ⟨α^v⟩, each point is α^i for exactly one
   i mod v, which gives every point a number.
13. **The Singer cycle.** Multiplying by α is GF(q)-linear, so it sends lines
    to lines, and it moves point i to point i + 1, cycling through all v
    points. So PG(2, q) is cyclic, and by Lesson 4 any one of its lines is a
    difference set. Animate the rotation carrying one line onto the next.

**Part V — Singer's algorithm**

14. **Writing down a difference set.** Choose one line: the trace-zero plane
    {x : x + x^q + x^(q²) = 0}. Then D = {i mod v : Tr(α^i) = 0}. Step
    through it for q = 2, 3, 4: compute α^i, take the trace, keep or reject.
    This takes v field multiplications, with no search, set against the
    brute-force count from Lesson 1.
15. **Many sets, few shapes.** Multipliers: t·D for t coprime to v is another
    difference set. Equivalence under translation, negation, and
    multipliers; Hall's multiplier theorem (multiplying by p gives a
    translate). Gallery of the distinct classes per q (the notebook port),
    their count φ(q² + q + 1)/6e, and OEIS A058241.

**Part VI — The frontier**

16. **Is every planar difference set a Singer set?** The *completeness
    conjecture*: Singer's construction finds every planar difference set, so
    every cyclic projective plane is Desarguesian.
    - Consequence: the *prime power conjecture*, that a planar difference set
      of order n exists only for prime powers n, verified by computer to very
      large orders.
    - Evidence: exhaustive searches over all planar difference sets match the
      Singer class counts, which are OEIS
      [A058241](https://oeis.org/A058241) and equal φ(q² + q + 1)/6e for
      q = p^e. Non-Desarguesian planes exist (order 9), but none known is
      cyclic.
    - Hints at a proof: multiplier theorems, group rings and characters
      (cyclotomic integers), Bruck–Ryser–Chowla-style non-existence tests,
      and theorems showing that enough symmetry forces a plane to be
      Desarguesian. The open question is whether a single cycle is enough.
    - Contrast: the higher-dimensional analogue is false (Gordon–Mills–Welch
      sets).

    Playground tie-in: exhaustive search for small v finds only sets
    equivalent to Singer sets.
17. **Where difference sets show up.** Modular Golomb rulers, optical
    orthogonal codes, sequences with two-valued autocorrelation, sensor array
    placement, and higher-dimensional Singer sets PG(m, q).

Citations are checked against primary sources before Lesson 17 ships; the
verified notes so far are in [docs/citations.md](docs/citations.md).

### Playgrounds

- **Difference set workbench.** Chord diagram for any v and subset, a
  difference histogram, translates, and an "is it a difference set?" verdict.
- **Finite field calculator.** ℤ/nℤ for any n (showing where it stops
  being a field), and GF(p^k) with a chosen modulus: addition and
  multiplication tables, inverses, powers and log tables, an
  irreducible/primitive check, and an isomorphism finder between two
  moduli of the same degree.
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

- **Astro** (static output, built on Vite) with TypeScript and no UI
  framework.
- **Lessons are Markdown** in `src/content/lessons/NN-slug.md`, with
  frontmatter `title`, `order`, `part`, `summary`, and `status`. Math is TeX
  (`$…$`, and `$$` on lines of its own for display), typeset by remark-math
  and rehype-katex **at build time**, so pages ship no math JavaScript.
- **Navigation**: a left sidebar shows the numbered outline of all lessons
  grouped by part, plus the playgrounds, with the current page highlighted;
  on narrow screens it folds behind a Contents button. Previous/next links
  chain the lessons. Both come from `src/site.ts` (parts, playgrounds, and
  pure outline helpers) and the lesson frontmatter.
- **Widgets** (`src/widgets/`): a Markdown lesson embeds one with
  `<div data-widget="name" data-…>`; `hydrate.ts` loads only the widget
  modules a page uses. Playground pages (`src/pages/playgrounds/`) use the
  same widgets full-size with URL state.
- **Math core (`src/math/`)**, pure and fully unit-tested: `numbers.ts`,
  `poly.ts`, `difference.ts`, `singer.ts`, and later `field.ts`,
  `projective.ts`, and `search.ts`.
- **Visualization (`src/viz/`)**: SVG for chord diagrams, planes, and
  tables; Canvas for large v; **three.js** for 3D views (GF(q)³ as a grid
  with its lines and planes through the origin, and PG(3, q) and higher),
  loaded only by the widgets that need it.
- The **version** is read from `package.json` and shown in the header.
  Light and dark themes via CSS custom properties.
- Type checking: `tsc` checks all `.ts` code. `@astrojs/check` does not yet
  support TypeScript 7, so `.astro` files stay thin templates with their
  logic in `.ts` modules.

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
3. **Multi-page skeleton** on Astro: Markdown lessons with KaTeX, numbered
   sidebar outline, home page, and the classes gallery playground. *(v0.3.0)*
4. **Part I–II**: Lessons 1–4 and the difference-set workbench.
5. **Part III**: Lessons 5–9 and the finite field calculator.
6. **Part IV**: Lessons 10–13 and the projective plane explorer.
7. **Part V**: Lessons 14–15 and the Singer stepper.
8. **Part VI**: Lessons 16–17, search versus construction, large-q explorer.
9. **Polish**: accessibility, mobile layout, performance for large q.

## Open questions

- Should the large-q explorer go beyond m = 2 by default?
- How much of the multiplier theorem to prove versus demonstrate?
