# The reader model

Who the lessons are written for, and what that reader knows at each point.
Check any edit against this before it ships: a lesson may use only what is
listed above it, and should not re-teach it.

Two files hold the model. `src/glossary.ts` records every **term and symbol**
with the lesson that introduces it. This file records what the glossary
cannot: what the reader brings, the **facts** each lesson establishes, what is
taken on trust, the words and letters that mean two things, and the places a
reader is likely to stall.

## What the reader brings

A motivated high-school student, willing to work.

**Assumed.** Whole-number arithmetic, division with remainder, primes and
prime factorization. Algebra: expanding and factoring, exponent laws,
polynomials and their roots, solving linear equations, the symbols =, ≠, <, ≤,
≥. Functions and coordinate geometry (a line as an equation). Counting
choices by multiplying. Arguing by contradiction, in plain words.

**Not assumed, so introduced where first needed.** Modular arithmetic. Set
notation (braces, ∩, ∪, ∈, set-builder). Greek letters. Binomial
coefficients and factorials (Lessons 1 and 9; the binomial theorem itself is
quoted in Lesson 9 with its formula shown). Vectors, dot and cross products
(Lessons 10 and 11). Complex numbers (Lesson 17 names them and leans on a
picture). Groups (never needed on the main path; defined in one sentence in
Lesson 26). Summation notation (Lesson 20).

**Never used.** Matrices, determinants, bases, and the dimension of a subspace
(the lessons count vectors instead), induction by name, limits, calculus.

## Ledger

"Has" is what the lesson adds to the model. "On trust" is stated without
proof and labeled as such in the text. "Leans on" is the earlier material a
reader must still hold.

| # | Has, after this lesson | On trust | Leans on |
| --- | --- | --- | --- |
| 1 | ℤ/vℤ, residues, a − b mod v. Definition of a (v, k, λ) difference set. k(k − 1) = λ(v − 1). Planar means λ = 1; order n = k − 1, v = n² + n + 1. C(v, k) and why search fails. | Singer's result, as a promise | school arithmetic |
| 2 | Translate D + j. D and D + j share as many points as there are ways to write j as a difference. Two points lie in exactly λ translates. For λ = 1: points and lines. The v translates are distinct. | | 1 |
| 3 | A geometry is points plus lines (sets of points). The Fano plane; its lines are the translates of {0, 1, 3}. Symmetry (collineation). i ↦ i + 1 is one. | No drawing has seven straight lines | 2 |
| 4 | The three axioms. Duality. Every line has n + 1 points, every point is on n + 1 lines, there are n² + n + 1 of each. Cyclic plane. **Theorem: cyclic plane of order n = planar difference set**, both directions. | Planes exist for prime powers (proved in 11); none of order 6 or 10 | 1–3 |
| 5 | Multiplication in ℤ/vℤ. Field axioms by name (commutative, associative, distributive, identities, inverses). Zero divisors. Coprime, greatest common divisor, extended Euclid. Euclid's lemma. **ℤ/vℤ is a field exactly when v is prime**; GF(p). | Moore: finite fields have prime power size and are unique (6 proves the size, 7 quotes uniqueness) | 1 |
| 6 | Characteristic is a prime p. Prime subfield. Subfield, isomorphism, map. A field with p elements is ℤ/pℤ. **Every finite field has pᵉ elements.** q = pᵉ. | | 5 |
| 7 | Polynomials over GF(p), long division, degree, monic, irreducible. Remainders mod f form a number system with pᵉ elements, which is a field exactly when f is irreducible. x becomes a root of f. Root test for degree 2 and 3. GF(4), GF(8), GF(9). | An irreducible polynomial of every degree exists. Fields of equal size are isomorphic. | 5, 6 |
| 8 | F*, order of an element, ⟨g⟩, primitive element α, logs. g^(q−1) = 1; orders divide q − 1. Fast primitivity test. Primitive polynomial. φ (Euler's totient), in a folded proof. | Every GF(q) has a primitive polynomial of every degree. Σφ(d) = n (in the sketch). | 5–7 |
| 9 | (a + b)ᵖ = aᵖ + bᵖ. Frobenius map x ↦ x^q is an automorphism. Fixed points form a subfield with at most q elements. q³ − 1 = (q − 1)v. **GF(q) = {0} ∪ ⟨αᵛ⟩ inside GF(q³).** GF(q³) as polynomials of degree < 3e over GF(p). Tr(x) lands in GF(q) and respects addition. | The binomial theorem. GF(pᵃ) ⊂ GF(pᵇ) exactly when a divides b. | 5–8 |
| 10 | GF(q)³, scalars, the origin. Lines through 0 hold q − 1 nonzero vectors; there are q² + q + 1 of them. Planes through 0 (one equation) hold q² vectors and q + 1 lines; there are q² + q + 1. Subspace. | | 5, 7 (for GF(4)) |
| 11 | PG(2, q): points are lines through 0, lines are planes through 0. Homogeneous coordinates, normalizing, dot product for incidence, cross product. **PG(2, q) is a projective plane of order q.** Line at infinity. PG(2, 2) is the Fano plane. | | 4, 10 |
| 12 | GF(q³) is GF(q)³ (coefficients as coordinates). The constants are the fixed points. **Point i is the point of αⁱ, i mod v.** | Polynomials over GF(q) behave like those over GF(p) | 7–11 |
| 13 | x ↦ αx is linear and one-to-one, so it carries lines to lines; it moves point i to point i + 1. **Singer's theorem**: any line of PG(2, q), read as numbers, is a (q² + q + 1, q + 1, 1) difference set. | | 4, 11, 12 |
| 14 | Conjugates. Tr is linear, so trace 0 is one line. **D = {i : Tr(αⁱ) = 0}.** The algorithm, its cost (about 3v multiplications), and the whole argument in eight steps. Trace-zero line versus z = 0. | | 9, 12, 13 |
| 15 | t · D for t coprime to v. Multiplier. p · D = D for a Singer set; 3e multipliers. Translation class, shape. φ(v)/3e Singer sets up to translation. Other primitive elements give the other multiples. | Hall's multiplier theorem. Gordon–Mills–Welch: no other multipliers; −1 is never one. | 2, 5, 8, 9, 14 |
| 16 | PG(m, q), hyperplanes, (v, k, λ) in every dimension. m-sequences from a shift register. Autocorrelation v − 4(k − λ), which is −1 for q = 2. Complement of a difference set. Biplanes. Inequivalent sets with Singer parameters exist for m > 2. | The steps of 10–13 carry over to m + 1 coordinates | 10–15 |
| 17 | Equivalent, Singer type. The completeness conjecture and the prime power conjecture. Bruck–Ryser. What searches have checked. D(x)D(x⁻¹) ≡ n + (1 + x + … + x^(v−1)). | Every theorem named here | 4, 14, 15 |
| 18–26 | One application each. They assume Lessons 1–4 plus what each names: 19, 20, and 26 need 16; 26 also needs 20 and 22. Each defines bit and XOR for itself. | Deployment facts, sourced | 1–4 |

## One word, two meanings

- **order**: of a plane or difference set (n; Lessons 1 and 4), and of a
  field element (Lesson 8). Lesson 8 says so.
- **line**: a line of a projective plane, and a line through the origin of
  GF(q)³. In PG(2, q) a point *is* a line through the origin and a line *is*
  a plane through the origin. Lesson 11's first section turns on this; later
  lessons say "line through the origin" in full.
- **point**: an hour of the clock (Lesson 1) and a point of a geometry (from
  Lesson 2). They are the same things by Lesson 4.
- **x**: the indeterminate of a polynomial (Lesson 7) and the first coordinate
  of a vector (Lesson 10). From Lesson 12 the remainder x is called α, and
  coordinates are (c₀, c₁, c₂) when both are in play.
- **v**: any modulus in Lessons 1 and 5; from Lesson 9 it is q² + q + 1.
- **q**: the size of the small field, and the order of the plane. In Lesson 9
  the widget also lets q be any power of p, to show subfields.

## Reserved letters

v, k, λ (a difference set); n (order of a plane); p (a prime); q = pᵉ (size of
a field); α (primitive element of the big field); ω (primitive element of a
small field that is not prime); D (the set); i, j (point numbers and
translations); t (a multiplier, or a shift in Part VII); m (dimension of
PG(m, q)); N (cars, Lesson 24). Don't reuse them for anything else. Coding
theory's k and n are avoided for this reason (Lessons 21 and 26).

## Where a reader is likely to stall

Each row is a point where the argument asks the most, and what the text does
there. If you edit near one, keep the support.

| Lesson | The hard step | Support in the text |
| --- | --- | --- |
| 2 | Counting translates through two points (the second matching argument) | Worked in full; the widget shows the first |
| 4 | Step 2 of the theorem: the translates are all different | Main text gives the idea (cycle length divides v and n + 1); folded proof has the rest |
| 5 | Why Euclid's chain ends at the greatest common divisor | One paragraph, both directions; stepper widget |
| 6 | Why c₁b₁ + c₂b₂ are p² different elements | Two picks done explicitly, then "same argument" |
| 7 | x starts as a symbol and becomes an element that is a root of f | Called out after the GF(4) table |
| 8 | The fast primitivity test | Both directions stated |
| 9 | Three ideas in one lesson; why αᵛ has order exactly q − 1 | "Why we need this" opening; the order is computed |
| 11 | A point is a line and a line is a plane | Opening section; perspective-drawing picture |
| 12 | Many powers of α name one point | Widget steps through i, i + v, i + 2v |
| 14 | Trace linear ⇒ one line, before the worked example | The algorithm box comes first; q = 2 table follows |
| 15 | The count φ(v)/3e, resting on a quoted theorem | The dependence is stated at the point of use |
| 16 | Two hyperplanes share q^(m−1) vectors | Elimination argument in one paragraph |
| 17 | Complex numbers as arrows | Named as complex numbers and roots of unity; widget draws them |

## Using this

- Before using a term, symbol, or fact in Lesson N, find it in a row above N
  (or in `src/glossary.ts` with a lesson number below N). If it is not there,
  introduce it, or point forward and say it is a preview.
- Before explaining something, check it is not already in a row above. If it
  is, name the lesson instead of explaining again.
- When a lesson gains a fact that later lessons use, add it to its row.
- When a step is asserted, ask whether this reader could supply the reason in
  a line. If not, give the line, or fold a proof below it.
