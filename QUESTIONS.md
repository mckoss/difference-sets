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
