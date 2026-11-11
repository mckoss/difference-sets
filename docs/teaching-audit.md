<!-- Teaching audit of the home page and Lessons 1–26, run 2026-11-11 (v0.17.0). -->

# Teaching audit: does each lesson move the reader forward, and make them want the next one?

> **Lesson numbers.** This file was written before v0.18.0, when Lessons 4,
> 17, and 24 were each split in two. Its numbers are the old ones: old 4 is
> now 4 and 5; old 5 to 16 are now 6 to 17; old 17 is now 18 and 19; old 18
> to 23 are now 20 to 25; old 24 is now 26 and 27; old 25 and 26 are now 28
> and 29.

The earlier audit ([lesson-audit.md](lesson-audit.md)) asked whether every lesson
rests only on what came before it. This one asks a different question of the
same text. The goal is a set of lessons from which a motivated high-school
student can understand Singer's algorithm and the outline of the proof that it
works. So for each lesson:

1. **Progress.** What can the reader do or explain afterwards that they could
   not before, and is that a step toward the algorithm or its proof?
2. **Motivation.** Is each new concept introduced because the story needs it,
   and is the reader told why, before the work starts?
3. **Pull.** Does the lesson end by pointing at the next question?
4. **Level.** Where would a strong high-school reader stall?

Method: one reader went through the home page and all 26 lessons in order
(about 51,000 words), noting for each the opening, the argument, the widget,
the exercise, and the closing paragraph, then applied the fixes below. Worked
examples were not re-derived; the earlier audit did that.

## Verdict

The mathematics is sound and the path is complete: Lessons 1 to 14 do prove
Singer's theorem, with three clearly labeled facts taken on trust. The best
lessons (1, 2, 6, 12, 13, 18, 21, 22) open with something to play with, make
one point, and end on a question. The application lessons are honest about what
is deployed and what is only research, which makes them more convincing, not
less.

The weaknesses were all about the thread, not the content:

| | Finding | Fixed in this pass |
| --- | --- | --- |
| A | **The reasons to care came last.** The applications are Lessons 18 to 26, after the frontier. The home page and Lesson 1 never said the sets are used for anything, and only Lesson 4 pointed ahead (to the card game). | Yes |
| B | **No map through the long middle.** Lesson 4 asks "where do these planes come from?" and Lesson 13 answers it nine lessons later. In between, only Lessons 9 and 10 said why their material was needed. Lesson 5 said the construction "needs division" without saying why. | Yes |
| C | **The algorithm and the proof were never gathered in one place.** Lesson 13 states the theorem and Lesson 14 has a three-line reason, but there was no numbered recipe and no list of which lesson proves which step, or of what was taken on trust. | Yes |
| D | **Several lessons ended on a notation box or a technical remark** (7, 9, 11, 12, 15, 17), and the site had no ending at all: Lesson 26 ran straight into its sources. | Yes |
| E | **Nothing told the reader how to read it**: that the folded proofs can be skipped at first, that the glossary pops up on hover, or which lessons are the main path. | Yes |
| F | Exercises are almost all compute-and-check; few ask the reader to explain or predict. | No (see below) |
| G | Three lessons are much longer than the rest (17, 24, and to a lesser degree 4). | No (see below) |
| H | Lesson 14 proves the trace is linear before it shows the trace doing anything. | Partly (the recipe now comes first) |

## What changed

**Home page.** A second paragraph says what the lessons do and links five
applications. A new "How to read this" list names the main path (1 to 15), says
to play with each figure first, to skip the folded "Why…" proofs on a first
reading, that dotted-underlined words are in the glossary, and that Part VII
can be read after Lesson 4.

**Lesson 1.** New section "Who needs a set like this?" between the definition
and the search: five uses in one paragraph, ending on "so how do you get one?",
which is the question the search section then takes up.

**Lesson 2.** One paragraph after the overlap theorem: this is the fact every
application uses.

**Lesson 4.** A boxed "road ahead" after the closing question: the three steps
of the answer (build the fields, use a field as coordinates, turn it into a
recipe), with the lessons that take each one. Then a side-trip note: Lessons
18, 21, 22, 23, 24, and 25 rest on Lessons 1 to 4 and can be read now.

**Lesson 5.** New section "Why a plane needs division": with coordinates on a
6-hour clock, the lines y = 0 and y = 2x cross twice, at (0, 0) and (3, 0),
because 2 · 3 ≡ 0; on a 7-hour clock they cross once. That is the reason the
coordinates must come from a field.

**Lesson 6.** The opening now says why the sizes of fields matter (they are why
the construction works for prime powers only), and the closing connects the
list of field sizes to Lesson 4's list of known plane orders.

**Lesson 7.** Opens with the target: the construction needs fields with 8, 27,
and 64 elements, none of them clocks. Closes by pointing at primitive elements.

**Lesson 8.** New opening section "A cycle inside every field", tying the
primitive element to the single cycle Lesson 4 asked for.

**Lesson 9.** The third "you'll learn" bullet, which was a formula, is now two
plain sentences. A closing paragraph says the toolkit is complete and hands
over to Part IV.

**Lesson 11.** New closing section "What is still missing": we have planes, but
not yet the turning symmetry.

**Lesson 12.** One paragraph on the payoff of seeing vectors as field elements:
they can be multiplied, and that is where the symmetry will come from.

**Lesson 13.** After the theorem, a paragraph naming what each earlier lesson
contributed.

**Lesson 14.** Two new sections. "The recipe, start to finish" states Singer's
algorithm as four numbered steps before any theory. "The whole argument on one
page" is an eight-row table (step, lesson that proves it) followed by the three
facts stated without proof: irreducible polynomials of every degree exist,
every finite field has a primitive polynomial of every degree, and fields of
the same size are isomorphic.

**Lesson 15.** Opens with the loose end from Lesson 14 (two different sets for
q = 4) as the question the lesson answers. Closes with a bridge to Part VI.

**Lesson 16.** The densest paragraph on the site ("A warning from higher
dimensions", about 230 words) is split in three.

**Lesson 17.** New section "Where to go from here": three experiments (program
the recipe for q = 7, predict the gallery's count, check the empty searches
against the theorems), three books (Moore and Pollatsek; Lidl and Niederreiter;
Beutelspacher and Rosenbaum, each checked against a publisher or library
record), and a bridge to Part VII.

**Lesson 26.** New closing section "The end of the path", looking back over
what the one fact from Lesson 2 did.

**Style and tests.** A `.roadmap` box (the notation box with the accent color)
for Lesson 4. Two new end-to-end tests cover the home page guide, the road map,
the recipe, and the eight-row argument table.

## Second pass: the reader model, and not talking down (v0.17.1)

Mike's follow-up set two standing rules, now in PLAN.md's writing
conventions: keep a model of what the reader has been taught, and don't talk
down. The second pass went through every lesson with `src/glossary.ts` as the
ledger (it records the lesson that introduces each term and symbol).

**Explained again long after it was taught (removed).** λ was re-glossed as
"the Greek letter lambda" in Lessons 16, 17, 18, 19, 20, 22, 24, and 25, and α
in 16 and 17. Lesson 16 explained what an exponent is ("so 2⁴ = 16") eight
lessons after GF(q³). Lesson 17 re-defined "prime power", ≡, q = pᵉ, and φ in
a notation box, and re-taught translation and multiplication from Lesson 15.
Lessons 16, 22, and 23 glossed ≠, ≥, and ≤, which Lessons 2 and 4 had used
without comment. Lesson 5 re-read ℤ/vℤ aloud; Lesson 11 re-glossed ω one
lesson after Lesson 10; Lesson 12 re-glossed the star of F*; Lesson 23
re-glossed ↦.

**Informal stand-ins for terms the reader has (replaced).**

| Was | Now | Taught in |
| --- | --- | --- |
| "a turn of D", "a slide of D", "sliding" | translate, translation | Lesson 2 |
| "shuffles" | permutes | Lesson 5 |
| "the same field with different labels", "renaming" (as the claim) | isomorphic | Lesson 5 |
| "a single element whose powers run through every nonzero element", "generator" | primitive element | Lesson 8 |
| "a direction", "a flat sheet", "flat pieces" | line through the origin, plane through the origin, hyperplane defined by an equation | Lessons 10, 11 |
| "recipe" (for Singer's method) | algorithm, construction | Lesson 14 |
| "school geometry" | Euclidean geometry, coordinate geometry | |
| "linear rule", "straight-line guess" | linear function, linear approximation (with "rule" kept as the lesson's shorthand) | Lesson 26 |

**Terms that were avoided and never introduced (added).**

- Lesson 5 listed the field axioms as "order doesn't matter", "grouping
  doesn't matter", "multiplying spreads over adding". They are now
  commutative, associative, and distributive, with identities and inverses.
- "Shares no factor with" stood in for **coprime** fifteen times, and was
  never quite right (1 is always a common factor). Lesson 5 now defines
  coprime where the jumps and the greatest common divisor appear, and adds the
  one-line reason that only coprime residues have inverses.
- Lesson 17 replaced complex numbers by "arrows of length 1". It now says
  complex number, absolute value, root of unity, and complex conjugate, and
  keeps the arrows as the picture the widget draws.
- Lesson 3 names *collineation* as the formal word for a symmetry; Lesson 7
  names *indeterminate*; Lesson 9 names *automorphism*; Lesson 8 names
  Euler's totient function where φ first appears.

**Likely confusions (addressed).**

- "Order" means two unrelated things (of a plane, Lessons 1 and 4; of a field
  element, Lesson 8). Lesson 8 now says so.
- Letters reserved by the conventions were reused: q as a quotient in Lesson
  4, n as a multiplier in Lesson 5's footnote, j as the exponent of p in
  Lesson 9, and n as a number of bits in Lesson 26. All changed.
- φ was listed in the glossary as introduced in Lesson 17; it first appears in
  Lesson 8.

**Tone.** Removed "the division you learned in school", "by fiddling",
"beginning algebra students sometimes write", "just a symbol", "this little
geometry", and the minimizing "just" before steps a reader may find hard. In
the first pass's own additions: "Remember this fact", "If you can explain each
row to a friend", "Play with each figure", "Skip the folded boxes".

**Guard.** Two unit tests in `tests/unit/glossary.test.ts`: each Greek letter
is spelled out in one lesson only, and the retired stand-in phrases do not
come back. The glossary gains *coprime*, *commutative*, *associative*, and
*distributive*.

**Left alone.** The clock, with its "hours", is the site's chosen picture for
ℤ/vℤ and stays. Sliding a mask or a template (Lessons 19 and 20) is physical
sliding, not a translate. The Singer stepper's caption ("rotating D back 14
notches") was worded in recent commits and is unchanged. Part VII's lessons
each define bit and XOR for themselves, because they are meant to be read in
any order.

## Third pass: what the reader might not follow (v0.17.2)

The second pass mostly removed things. This one looked for the opposite
failure: a step the reader cannot supply, or a word used before it means
anything to them. The model is now written down in
[reader-model.md](reader-model.md).

**Steps asserted without a reason (reason added).**

- Lesson 9: that β = αᵛ has order exactly q − 1; that x ↦ x^q is one-to-one
  (the step from a^q = b^q to (a − b)^q = 0 was skipped); that a one-to-one
  map of a finite set to itself is a permutation.
- Lesson 16: that two hyperplanes share q^(m−1) vectors.
- Lesson 19: that folding 255 hours into a 15 × 17 grid fills every cell.
- Lesson 8: the converse half of the fast primitivity test.
- Lesson 6: the count of p² combinations, now argued for two picks in full
  instead of in one compressed parenthesis.
- Lesson 4: why the line size is called n + 1, and the one-line reason that a
  common divisor of v and n + 1 divides 1.
- Lesson 7: "multiples of f absorb sums and products" leaned on a word from a
  footnote; it now says what happens.

**Words used before they were defined (defined, or replaced).** map (Lesson
6), closed under (Lesson 9), residue class (Lesson 12), image and induces
(Lesson 13), nontrivial difference set (Lesson 15), "one dimension fewer"
for a subspace (Lesson 16), Desarguesian's namesake (Lesson 17).

## Lesson by lesson

"Step" is what the lesson adds toward the algorithm or its proof. "Stall" is
where a high-school reader is most likely to slow down.

| # | Step | Opens with | Stall | Change |
| --- | --- | --- | --- | --- |
| 1 | The definition, k(k − 1) = λ(v − 1), and why search fails | A clock to click | None | Uses section |
| 2 | Translates overlap in λ points; λ = 1 means "lines" | A widget | The second counting argument (points in translates) | Pointer to applications |
| 3 | The Fano plane is the translates of {0, 1, 3} | A picture | None; the shortest lesson | None |
| 4 | Plane axioms and counts; cyclic plane = planar difference set | Axioms | Step 2 of the theorem (cycle lengths). Densest lesson before Part V | Road map, side trip |
| 5 | Field axioms; ℤ/vℤ is a field exactly for prime v | Recap of clocks | The footnote on ideals (safe to skip) | Why a plane needs division |
| 6 | Characteristic, prime subfield, sizes pᵉ | A puzzle widget | The "pick elements one at a time" count | Why sizes matter; link to plane orders |
| 7 | GF(pᵉ) from an irreducible polynomial | Table: numbers vs polynomials | "x becomes a number" | Target sizes; next-step hook |
| 8 | Primitive elements, logs, the fast test | Powers of x | The fast test's prime-factor argument | Cycle framing |
| 9 | Frobenius; GF(q) inside GF(q³); trace preview | "Why we need this" | Three ideas in one lesson; the longest chain of exponents so far | Plainer lede; hand-off to Part IV |
| 10 | GF(q)³; counting lines and planes through 0 | "Why we need this" | "Different equations, different planes" | None |
| 11 | PG(2, q) is a projective plane of order q | Renaming | Cross-product uniqueness argument | What is still missing |
| 12 | Points numbered by powers of α mod v | Two views of one object | Why GF(q)* = ⟨αᵛ⟩ gives one number per point | The payoff: multiplication |
| 13 | Multiplying by α is the turning symmetry: Singer's theorem | The question from Lesson 4 | None; the pieces are all in place | Credits to earlier lessons |
| 14 | The trace-zero line; the algorithm; its cost | Which line? | Linearity of the trace before the worked example | Recipe box; argument on one page |
| 15 | Multipliers; φ(v)/3e sets up to translation | A second move | The hardest main-path lesson; rests on a quoted theorem | Opening question; bridge |
| 16 | PG(m, q), m-sequences, flat autocorrelation | Recap of Part IV | The warning paragraph | Paragraph split |
| 17 | The open question, the evidence, the tools | Search vs construct | Length (4,000 words); the proof-ideas section is a survey | Where to go from here |
| 18 | Cards are lines | The game | None | None |
| 19 | A mask that overlaps itself evenly decodes cleanly | A widget | The Chinese remainder fold | None |
| 20 | Flat correlation floor; why q = 2 | Radar | Σ notation (explained in place) | None |
| 21 | Lines as parity checks; majority vote | A widget | "Only 10 of 21 checks are independent" (asserted) | None |
| 22 | Translates as wake-up schedules, key rings, quorums | Sleeping radios | None | None |
| 23 | Planar set = tightest circular Golomb ruler | A ruler | None | None |
| 24 | Race charts from translates; which car counts work | A race | Length (3,800 words) | None |
| 25 | Stripes on lines spread the rebuild evenly | Parity | None | None |
| 26 | Bent functions are difference sets under XOR | Key rings | Parseval's identity; a new group | The end of the path |

## Not changed: for Mike to decide

These are judgment calls or larger rewrites, so they were left alone.

Three of these were done in v0.18.0 at Mike's direction: item 1 (Lesson 14,
now Lesson 15, runs q = 2 by hand and the stepper before the linearity
argument), item 3 (old Lessons 4, 17, and 24 are each two lessons now, with
forwarding pages at the old addresses), and item 4 ("translate" everywhere,
including Lesson 2's title, the stepper's captions, and "cyclic chart" for a
race chart made of translates).

1. **Lesson 14, example before theory.** The site's own convention is "small
   examples first", but this lesson proves the trace is linear and only then
   runs q = 2 by hand. Moving "By hand: q = 2" up to follow the recipe, and
   letting the linearity section explain what the reader just saw, would make
   the climax of the site easier. It means reordering most of the lesson.
2. **Exercises.** Every lesson has a "Try it" with a worked answer, which is
   good. Nearly all are compute-and-check. One "explain why" or "predict, then
   check" question per main-path lesson would test understanding instead of
   arithmetic. The existing models are Lesson 22 question 2 ("explain why no
   schedule with 2 awake slots can always meet") and Lesson 14 question 2 ("for
   which primes is point 0 in D?"). Lessons 1, 2, 4, 16, 17, 18, 19, and 23
   have a single question.
3. **Long lessons.** Lesson 24 (3,800 words) is twice the length of the other
   applications; the search, phantom cars, and full-lane sections could fold
   into `<details>` or become their own lesson. Lesson 17 (4,000 words) could
   split into "which orders are possible" and "how a proof might go". Lesson 4
   (2,400 words, four proofs) could split at "Cyclic planes are difference
   sets".
4. **One move, four names.** Done in the second pass: D + j is a *translate*
   throughout. "Turn" survives as the picture in Lesson 2, and "rotation" as
   the Pinewood Derby term in Lesson 24.
5. **Two lede formats.** Lessons 1 to 4 and 16 to 26 open with one bold
   "You'll learn:" sentence; Lessons 5 to 15 open with a heading and bullets.
6. **Lesson 6's place on the path.** That GF(p) is unique is not used by the
   construction; the lesson earns its place through the characteristic and the
   count pᵉ. It is now motivated that way. If the path ever needs shortening,
   its first half is the candidate for a "side trip" label.
7. **Lesson 5's footnote on ideals.** Maximal ideals are beyond the audience.
   It is a footnote and says nothing depends on it, so it does no harm.
8. **Lesson 21** asserts that 10 of the 21 parity checks are independent ("a
   computer does it in an instant"). A two-line reason for order 2 (7 checks, 4
   independent) would let the reader see one case.
9. **Difficulty labels.** A small marker on each lesson (core / optional /
   frontier) in the sidebar would tell a reader what they can skip. The home
   page now says this in words.
