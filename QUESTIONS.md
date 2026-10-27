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
   `singerSet` normalize to the familiar representative?
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

