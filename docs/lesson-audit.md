<!-- Prerequisite audit of Lessons 1–26, run 2026-11-02. -->

# Lesson audit: does each lesson rest only on what came before it?

Goal: a reader with high-school math, with some study and effort, can follow
every step to the Singer construction (Lessons 1–15), then the frontier
(16–17). The applications (18–26) motivate difference sets and should stand on
Lessons 1–4 plus what they explain in-lesson.

Method: seven reviewers, one per Part, each read every lesson up to the end of
its Part and listed (a) the terms, notation and facts the Part establishes and
(b) findings: terms used before they are defined, claims stated where a reader
needs a reason, forward references that leave the reader stuck, skipped steps,
and errors. Every worked example in every lesson was re-checked by hand or by
script. Fixes were then applied lesson by lesson, with every piece of added
arithmetic re-verified.

## Results

| Part | Lessons | Blocking | Rough | Nit | Errors found |
|---|---|---|---|---|---|
| I The puzzle | 1–2 | 0 | 2 | 5 | none |
| II Projective planes | 3–4 | 0 | 6 | 4 | Lesson 3 Try-it answer did not describe {0, 2, 6} in the picture; "order 1000" is not a prime power |
| III Finite fields | 5–9 | 0 | 5 | 8 | none |
| IV Planes from fields | 10–13 | 0 | 5 | 5 | none |
| V Singer's algorithm | 14–15 | 0 | 3 | 7 | none |
| VI The frontier | 16–17 | 0 | 6 | 7 | "(63, 31, 15) is the smallest non-Singer set with Singer parameters" (the squares mod 31 give a (31, 15, 7) one); Lesson 16's trace for PG(m, 2) needs m + 1 terms, not 3; the plane of "Lessons 3 and 4" is not PG(2, q) |
| VII Applications | 18–26 | 0 | 4 | 12 | Lesson 25 "same amount of data" (7 stripes vs 6) |

All 79 findings were applied (a few with a different fix than proposed, where
the proposed one was wrong or heavier than needed). Lessons 22 and 23 were
clean.

## What changed, by theme

- **Definitions pinned down.** Difference set: two *different* members, ordered
  pairs. Modulus, combination (of vectors), dimension, class and shape (of a
  difference set), translation class, group (in Lesson 26), biplane / block,
  correlation, autocorrelation and sidelobes, set-builder notation, factorial,
  "abelian".
- **Proofs completed where the reader was asked to fill a gap.** Lesson 2's
  pair-to-point matching both ways; Lesson 4's dual of axiom 3, the existence
  of a point off two lines and the one-for-one pairing, every point on n + 1
  lines (direct, no appeal to duality), axiom 3 for cyclic planes, and the
  cycle-length argument of step 2; Lesson 5's Euclid's algorithm (why the last
  nonzero remainder is the gcd) and Euclid's lemma; Lesson 7's worked long
  division, why Euclid ends at a constant for an irreducible modulus, the
  factor theorem, and that x becomes a root of f in the remainder field;
  Lesson 10's "different equations give different planes"; Lesson 11's "two
  lines meet in one point" spelled out; Lesson 12's constants = Frobenius fixed
  points; Lesson 13's subspace with q² vectors is a plane; Lesson 14's
  three-step recap of why D is a difference set; Lesson 15's distinctness of
  the 3e powers of p mod v, p coprime to v, and the explicit dependence on
  Gordon–Mills–Welch; Lesson 16's complement parameters and the register rule
  from α⁴ = α + 1; Lesson 17's arrow facts; Lesson 26's Parseval identity.
- **Facts taken on trust are now labeled.** Primitive polynomials of every
  degree over every GF(q) (Lesson 8); the m-dimensional Singer theorem's
  carried-over steps (Lesson 16); the two-squares theorem (Lesson 17).
- **Applications made self-contained.** Lesson 20 names correlation; Lesson 26
  restates the disagreement count instead of relying on Lesson 20; Lessons 19,
  20, 24 and 25 gloss shift registers, primitive polynomials, Bruck–Ryser–Chowla,
  multipliers and complements at the point of use.

## Not changed

- Where the site says a result is stated without proof (uniqueness of GF(q),
  the multiplier theorem, GMW, the two-squares theorem, the completeness
  conjecture's computer bounds), it still does; the audit only made sure the
  reader is told.
- Longer justifications sit in `<details>` blocks so the main thread stays
  readable. KaTeX does not render inside `<summary>`, so summaries are plain
  text.
