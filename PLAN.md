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

## Site outline

1. **Differences on a circle.** v points on a clock face; the reader picks a
   subset and sees every chord labeled with its difference. A tally shows
   whether each nonzero difference appears equally often.
2. **Perfect examples.** {0, 1, 3} mod 7 and friends. Translates D + j as
   rotations of the chord diagram; any two translates share exactly λ points.
3. **The Fano plane.** Draw the 7-point plane and show that its lines are the
   7 rotations of {0, 1, 3}. Introduce points, lines, and incidence.
4. **Finite fields.** GF(p), then GF(p^k) as polynomials mod an irreducible.
   Interactive addition and multiplication tables; powers of a primitive
   element cycling through every nonzero element.
5. **Singer's construction, step by step.** Choose q and a primitive cubic;
   list the powers α^i as coordinate vectors in GF(q)³; group them into
   projective points; highlight the trace-zero line; read off D.
6. **The projective plane as a circulant.** The v × v incidence matrix whose
   rows are the shifts of D's indicator vector. Visual check: every two rows
   overlap in exactly one column.
7. **Multipliers and equivalence.** Multiplying D by p (or any power of p)
   gives a translate of D (Hall's multiplier theorem). Show the orbit
   structure and how many inequivalent Singer sets exist for a given q.
8. **Higher dimensions.** PG(m, q) for m ≥ 3 and the general parameters.
9. **Why it matters.** Modular Golomb rulers and sparse rulers, optical
   orthogonal codes, sequences with two-valued autocorrelation, sensor array
   placement, and the open prime power conjecture for planar difference sets.
10. **Explorer.** Generate Singer sets for any prime power q in a reasonable
    range (target q ≤ 1000 in a worker), with chord diagram, difference
    histogram, and a downloadable list.

## Architecture

- **Vite + TypeScript**, no UI framework. Each section is a module that mounts
  its widget into a placeholder in the page.
- **Math core (`src/math/`)**, pure and fully unit-tested:
  - `difference.ts` — difference multiset, `isDifferenceSet`, translates,
    multipliers.
  - `field.ts` — GF(p) and GF(p^k) arithmetic with polynomial
    representation, irreducibility and primitivity tests.
  - `singer.ts` — Singer set for (q, m), with the intermediate steps exposed
    for the step-by-step visualization.
- **Visualization (`src/viz/`)** — hand-written SVG for chord diagrams, the
  Fano plane, and incidence matrices; canvas for large v.
- **Typesetting** — KaTeX for formulas (rendered at build time where
  practical so the page reads without JavaScript).
- **Version** read from `package.json` and shown in the header.
- Light and dark themes via CSS custom properties.

## Testing

- Vitest unit tests for the math core: known small sets, the difference-set
  property for every Singer set with q up to a modest bound, multiplier
  theorem checks, field axioms on small fields.
- Playwright smoke test of the built site once interactive sections land.
- CI runs typecheck, unit tests, and the build on every push and PR; pushes to
  `main` deploy to Pages.

## Milestones

1. **Scaffold** — repo, Vite build, Pages deploy, `isDifferenceSet` with
   tests. *(v0.1.0)*
2. **Notebook port** — the "Non-isomorphic Singer Sets" Colab notebook in
   TypeScript: GF(p) polynomials, the trace construction, classes up to
   multiplier/translation/negation, and the chord-diagram gallery. *(v0.2.0)*
3. **Math core** — full GF(p^k) arithmetic and step-by-step construction data.
4. **Sections 1–3** — difference sets, translates, Fano plane.
5. **Sections 4–6** — finite fields, the construction, circulant view.
6. **Sections 7–9** — multipliers, higher dimensions, applications.
7. **Explorer** and polish: accessibility, mobile layout, performance for
   large q.

## Open questions

- One long scrolling page or a page per section?
- Should the explorer go beyond m = 2 by default?
- Include non-Singer difference sets (Paley, Hadamard) for contrast, or stay
  focused?
