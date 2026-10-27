# Questions

Decisions I made while Mike was away, collected here instead of blocking.

1. **Class wording.** The gallery's classes are distinct up to *translation
   and negation*; multiplying generates them, so up to multiplication there
   is one Singer class per q. I corrected the earlier text, which said "up to
   multiplication, translation, and negation." OK?
2. **Two new lessons** fill gaps: Lesson 9 (fields inside fields: Frobenius
   and subfields, needed for the trace) and Lesson 10 (vectors over a finite
   field, needed for PG(2, q) coordinates). The outline is now 17 lessons.
3. **Lesson 4 cites two non-existence results** by name and year only:
   order 6 via the Bruck–Ryser theorem (1949), order 10 via the computer
   search of Lam, Thiel, and Swiercz (1989). No links. Both match entries 7
   and 8 of `docs/citations.md`.
4. **Brute-force table times** assume a billion subset checks per second and
   an age of the universe of 13.8 billion years. The live search runs on the
   main thread in 12 ms slices for v ≤ 31; a worker can wait for the search
   playground.
5. **Lesson 1 notation box** (`<aside class="notation">`) is the reusable
   pattern for later lessons; Lesson 2 links back to it. The two clock
   widgets (`clock-mod`, `clock-difference`) are available to later lessons.

## Part VII Applications (2026-10-27)

6. **Outline.** Lesson 16 is now "Beyond the plane" (PG(m, q) Singer sets and
   m-sequences) and the completeness conjecture moved to Lesson 17. The old
   "Where difference sets show up" stub became Part VII, Lessons 18–23.
   Lesson 24 (declustered RAID) is not written.
7. **`singerSet(q)` differs from PLAN.md's featured sets** for q = 2 and 4
   ({1, 2, 4} mod 7 and {3, 6, 7, 12, 14} mod 21, not {0, 1, 3} and
   {0, 1, 4, 14, 16}). They are equivalent sets. The deck maker's verify panel
   shows `singerSet(q)` as asked; the lessons use PLAN.md's sets. Should
   `singerSet` normalize to the familiar representative? *(Lesson 14 now
   explains {1, 2, 4} = {0, 1, 3} + 1 as the trace-zero line x = 0 versus the
   line z = 0, and Lesson 15 explains q = 4's set as 5·D, the mirror image of
   the trace set; see item 29. I left `singerSet` unnormalized.)*
8. **Spot It facts.** Lesson 18 says the retail deck is "commonly reported"
   to have 55 cards and links Matt Parker's video for it, and has a one-line
   trademark disclaimer. The video is a click-to-load facade with a plain
   YouTube link fallback.
9. **Coding letters.** Lesson 21 says "message bits" rather than the
   coding-theory k (k is the set size site-wide), and uses n for the plane
   order. Code parameters ((7, 3), (21, 11), (73, 45), (273, 191)) are
   computed in unit tests, not hard-coded.
10. **Hedged deployment claims.** Lesson 19 calls the Spacelab 2 masks
    Singer sets as an inference from their dimensions; Lesson 22 says key
    rings and quorums from planes are research ideas (the wake-up patent is
    the real anchor); Lesson 23 says no operating radio telescope is known to
    use a Singer layout. Lesson 21 gives NHK teletext patent dates rather than
    the [S]-only 1985 service date.
11. **Simplifications.** The coded-aperture demo treats the detector as one
    wrapped-around period (the lesson notes that real instruments use a 2 × 2
    mosaic), and its random mask uses fixed seed 7. Lesson 23 states 11 as
    the shortest 5-mark Golomb ruler (standard, but not in the research
    notes). Some authors appear with initials only where sources gave no first
    name.
12. **Symbol images.** All 150 generated images are used; the deck maker's
    Vehicles theme has 27 images, so decks with q ≥ 5 fill in with others.
    Cards stay white in dark mode so the white-backed stickers blend.


## Part VI frontier (2026-10-27)

13. **Search range.** The search playground offers n ≤ 12. Measured in
    Chromium: n = 9 in 0.12 s (914,004 nodes), n = 10 in 1.1 s (7.9 million,
    nothing found), n = 11 in 11 s (68 million), n = 12 about 2 minutes
    (601 million, nothing found). It autoruns only for n ≤ 9; Cancel
    terminates the worker. The counts are reduced sets (containing 0 and 1),
    which match A335866 (φ(v)/3e); deduplicated up to negation they match
    A058241. Both are unit-tested for n ≤ 10.
14. **`singerSetFast(q)`** is new (GF(q) log tables plus a primitive cubic
    over GF(q)); `singerSet` and its tests are untouched. Its output is a
    different but equivalent Singer set (tested for q ≤ 32). It builds
    q = 1024 (v = 1,049,601) in about 25 ms, where `singerSet` takes about
    15 s. The explorer stops at q = 1024 so it includes Huang–Schmidt's
    largest verified order.
15. **Explorer drawing.** For k > 120 the worker rasterizes the chords into a
    512 × 512 crossing-count grid (about 110 ms at q = 1024), shaded
    1 − e^(−count/scale); at that size the picture is an even disc. Smaller
    sets draw real canvas lines.
16. **Lesson 17 wording.** "Desarguesian" is defined as "built from a field"
    without the history of the name. "9 is the smallest order with planes
    that don't come from a field" is stated, as allowed, though
    citations.md notes it is not separately sourced. Kantor 1987 is
    paraphrased as flag-transitive with one exception. General orders that
    are neither prime powers, Bruck–Ryser exclusions, nor 10 are labeled
    "Open: no plane known".
17. **Order table.** Each order gets the first reason that applies: prime
    power, Bruck–Ryser, a difference-set theorem (Wilbrink, then
    Jungnickel–Vedder, then Gordon 1994's divisor list), then computer
    search. In the cyclic view only 85, 91, and 95 fall through to
    "computer search" below 100. The claim that the site's search rules out
    cyclic order 10 in about a second is our own measurement, set against
    Lam–Thiel–Swiercz for general planes.
18. **Lesson 4** still says nothing about cyclic order 10; Lesson 17 links
    back to Lesson 16 for GMW. Lessons 14 and 15 are now written (Part V
    below).

## Part III (Lessons 5–9, finite field calculator)

19. **Degree letter e.** Fields are GF(p^e) with q = p^e throughout, and the
    modulus has degree e, so GF(q³) is built from a degree-3e polynomial.
    The calculator's URL uses `e=` (`?p=2&e=3&poly=1,1,0,1`); the older
    `k=` still works and is rewritten to `e=`. PLAN.md Part III now says so.
20. **Clock letter v.** Lesson 5 writes ℤ/vℤ for a general clock, following
    the conventions (n is a plane order). The calculator's clock mode is
    `?v=6` (`?n=` also accepted).
21. **Element labels.** Polynomials print highest power first
    (x² + 1), and as coefficient digits highest first (101), which is also
    the element's number in base p. URL polynomials stay lowest coefficient
    first, as in `poly=1,1,0,1` = x³ + x + 1, matching `singer.ts`.
22. **Stated without proof** (flagged in the text): existence of
    irreducible polynomials of every degree, uniqueness of GF(q) up to
    isomorphism (demonstrated by the isomorphism finder), "a degree-d
    polynomial has at most d roots" (one-line factor-theorem reason given),
    and the identity Σ φ(d) = n used in the primitive-element sketch.
    Lesson 9 states, without proof, that GF(p^a) ⊂ GF(p^b) exactly when a | b.
23. **Calculator limits.** Fields up to 256 elements for powers and logs,
    tables and the isomorphism finder up to 64, Frobenius for the preset
    sizes 4–64, clocks up to 24 hours. The Frobenius widget on its own uses
    the first primitive polynomial for each size.

## Part IV (Lessons 10–13, PG(2, q) explorer)

24. **GF(q³) over GF(q).** `projective.ts` builds GF(q³) as GF(q)[α] modulo a
    primitive cubic, so coordinates are (c₀, c₁, c₂) for c₀ + c₁α + c₂α². For
    prime q the cubic is the one `singerSet` uses (so the trace-zero line equals
    `singerSet(q)`, tested); for q = 4, 8, 9 it is `findPrimitiveCubic`. Lesson 12
    says Lesson 7's recipe works with coefficients in any field, and that
    Lesson 9's degree-6 GF(64) is the same field relabeled.
25. **Featured line.** Lessons 12–13 use the line z = 0 (no α² term). With these
    cubics it gives exactly PLAN.md's {0, 1, 3}, {0, 1, 3, 9}, {0, 1, 4, 14, 16}
    (tested), so the trace-zero line is left for Lesson 14.
26. **Labels.** Points normalize to first nonzero coordinate 1, ordered [1 : y : z],
    [0 : 1 : z], [0 : 0 : 1]. GF(q) elements for q = 4, 8, 9 print as 0, 1, ω, ω², …
    (ω a root of the first primitive polynomial over GF(p)), not as digit strings.
27. **three.js** 0.186.1 (exact pin, @types/three 0.186.0) loads by dynamic import
    only in the `vector-grid` widget (Lesson 10); about 740 kB uncompressed. The
    view slowly turns until dragged (not with reduced motion); zoom and pan are
    off so the page scrolls normally. The text description below it lists the
    same vectors.
28. **Proof level.** Lesson 11 proves the axioms with the cross product and a
    span-counting argument; Lesson 13 states that every subspace with q² vectors
    is a plane, with a one-line reason.

## Part V (Lessons 14–15, Singer stepper, multiplier explorer)

29. **Which field the lessons use.** The stepper and Lessons 14–15 compute the
    trace in GF(q)[α] modulo the primitive cubic of Lessons 12–13 (`projective.ts`),
    by adding the three conjugates read from the power table. So the trace set is
    a translate of the z = 0 line: +1, +0, +14, +22 for q = 2, 3, 4, 5 (tested);
    for q = 3 it *is* z = 0. For prime q it equals `singerSet(q)` exactly. For
    q = 4, 8, 9, `singerSet` builds GF(q³) from a degree-3e polynomial over GF(p),
    a different α, so its set is a multiple t·D, not a translate (q = 4: 5·D = −D,
    tested). Lesson 14 says so and Lesson 15 explains it.
30. **Why the trace line.** Lesson 14 motivates the trace as the line that needs
    no GF(q) coordinates (singer.ts has none for e > 1), not as faster to compute
    than z = 0. I changed Lesson 13's last sentence, which promised "the line
    that is quickest to compute", to match.
31. **Proof level.** Lesson 14 proves linearity of the trace and that its zeros
    are a line (degree-q² root bound). Lesson 15 proves t·D is a difference set,
    that p·D = D for the trace set (Frobenius through the trace), and that t·D,
    t′·D are translates iff t′/t is a multiplier. It states without proof that the
    3e powers of p are distinct mod v, that they are the only multipliers (GMW
    1962), that −1 is never a multiplier (GMW 1962; Johnsen 1964), Hall 1947, and
    that every multiple comes from some primitive element. Counts credit Singer
    (conjecture), Berman 1953, and Halberstam–Laxton 1964, as in citations.md.
32. **Widgets.** `singer-stepper` (Lesson 14 and a new playground,
    `/playgrounds/singer-stepper/?q=&i=`) offers q ∈ {2, …, 13}; Play paces itself
    to finish in about 9 s whatever q is. `chordDiagram` gained an optional modulus
    so the stepper can draw D while it grows. `multiplier-explorer` (Lesson 15)
    uses the trace set, so p·D = D exactly, and names classes n and n′ (mirror
    pairs), each shown by its reduced form (the translate containing 0 and 1).
33. **Brute-force numbers.** Lesson 14's cost table uses C(v, q + 1) and "about
    3v" multiplications (three running products per step, as in singer.ts);
    C(57, 8) ≈ 1.7 billion and C(183, 14) ≈ 3.3 × 10²⁰ are computed by the widget's
    `binomial`.
