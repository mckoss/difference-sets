// The glossary: every term the lessons define, with the lesson that
// introduces it. The glossary page lists these alphabetically, and the
// rehypeGlossary plugin links the first use of a term on each lesson page to
// its entry, where a hover shows the definition.

export interface GlossaryTerm {
  term: string;
  /** Order of the lesson that introduces the term. */
  lesson: number;
  /** Plain text with Unicode math, so it reads the same in a hover popup. */
  def: string;
  /**
   * Phrases to link in lesson text, matched case-insensitively as whole words,
   * with an optional plural "s" or "es". Defaults to the term itself; an empty
   * list means never link (common words like "line" or "order").
   */
  forms?: string[];
  /** Related terms, by their `term`. */
  see?: string[];
}

export interface GlossarySymbol {
  symbol: string;
  /** How to read it aloud, if that isn't obvious. */
  read?: string;
  lesson: number;
  def: string;
}

export const GLOSSARY: GlossaryTerm[] = [
  // Part I: the puzzle
  {
    term: 'congruent',
    lesson: 1,
    def: 'a ≡ b (mod v), read "a is congruent to b mod v", means a and b differ by a multiple of v, so they land on the same point of a v-hour clock. For example, 10 ≡ 3 (mod 7).',
    see: ['residue', 'modulus'],
  },
  {
    term: 'difference',
    lesson: 1,
    def: 'For two marks a and b on a v-hour clock, a − b worked out mod v: the number of steps forward from b to a.',
    forms: [],
    see: ['difference set'],
  },
  {
    term: 'difference set',
    lesson: 1,
    def: 'A (v, k, λ) difference set is a set D of k points on a v-hour clock in which every nonzero residue 1, 2, …, v − 1 occurs exactly λ times as a difference a − b of two members of D. Example: {0, 1, 3} is a (7, 3, 1) difference set.',
    see: ['planar difference set', 'translate'],
  },
  {
    term: 'integers mod v',
    lesson: 1,
    def: 'ℤ/vℤ: the integers, with two numbers counted as the same whenever they differ by a multiple of v. There are exactly v of them, 0, 1, …, v − 1: the points of a v-hour clock.',
    forms: ['integers mod'],
    see: ['residue', 'quotient'],
  },
  {
    term: 'modulus',
    lesson: 1,
    def: 'The number v in "mod v": the number of hours on the clock.',
    see: ['integers mod v'],
  },
  {
    term: 'order (of a difference set or plane)',
    lesson: 1,
    def: 'For a planar difference set, n = k − 1, one less than the number of members, so v = n² + n + 1. For a projective plane, n is one less than the number of points on each line. The two meet: a planar difference set of order n gives a plane of order n.',
    forms: [],
    see: ['order (of a field element)'],
  },
  {
    term: 'planar difference set',
    lesson: 1,
    def: 'A difference set with λ = 1: every nonzero difference occurs exactly once. Its size and clock are k = n + 1 and v = n² + n + 1 for some order n. Its translates are the lines of a projective plane, hence the name.',
    forms: ['planar difference set', 'planar'],
    see: ['difference set', 'projective plane'],
  },
  {
    term: 'residue',
    lesson: 1,
    def: 'One of the v points 0, 1, …, v − 1 of a v-hour clock. The residue of x is x mod v, its remainder after dividing by v; for negative x the remainder is still taken between 0 and v − 1.',
    see: ['integers mod v'],
  },
  {
    term: 'intersection',
    lesson: 2,
    def: 'The members two sets have in common, written A ∩ B.',
  },
  {
    term: 'line (of a difference set)',
    lesson: 2,
    def: 'For a planar difference set D mod v, the lines are its translates D + j, and the points are the v hours of the clock. Any two points lie together on exactly one line, and any two lines share exactly one point.',
    forms: [],
    see: ['translate', 'projective plane'],
  },
  {
    term: 'translate',
    lesson: 2,
    def: 'D + j: the set made by adding j to every member of D, mod v. On the clock it is D turned j steps clockwise. A translate has the same differences as D.',
    forms: ['translate'],
    see: ['translation class'],
  },
  {
    term: 'Fano plane',
    lesson: 3,
    def: 'The smallest projective plane: 7 points and 7 lines, with 3 points on every line. Its lines are the translates of {0, 1, 3} mod 7.',
    see: ['projective plane'],
  },
  {
    term: 'geometry',
    lesson: 3,
    def: 'In these lessons, a set of points together with a collection of lines, where each line is simply a set of points. Only incidence matters: which points lie on which lines.',
    forms: [],
  },
  {
    term: 'incidence',
    lesson: 3,
    def: 'Which points lie on which lines. A point lies on a line when it is one of that line\'s points; nothing about distances or angles matters.',
  },
  {
    term: 'symmetry',
    lesson: 3,
    def: 'A rearrangement of the points of a geometry that carries every line onto a line. Turning the clock, i ↦ i + 1, is a symmetry of the plane of a difference set.',
    forms: ['symmetry', 'symmetries'],
    see: ['Singer cycle'],
  },
  {
    term: 'axiom',
    lesson: 4,
    def: 'A basic rule that is part of a definition. A projective plane has three: any two points lie on exactly one line; any two lines meet in exactly one point; there are four points with no three on a line.',
  },
  {
    term: 'cyclic projective plane',
    lesson: 4,
    def: 'A projective plane with a symmetry that moves some point through all v points before returning to it. A cyclic plane of order n is the same thing as an (n² + n + 1, n + 1, 1) difference set.',
    forms: ['cyclic projective plane', 'cyclic plane'],
    see: ['planar difference set', 'Singer cycle'],
  },
  {
    term: 'duality',
    lesson: 4,
    def: 'The axioms of a projective plane stay true when "point" and "line" are swapped. So whatever is true of points and lines in every projective plane is also true with the two words swapped.',
  },
  {
    term: 'projective plane',
    lesson: 4,
    def: 'A geometry in which any two points lie on exactly one line, any two lines meet in exactly one point, and four points can be found with no three on a line. One of order n has n + 1 points on every line and n² + n + 1 points and lines in all.',
    see: ['Fano plane', 'cyclic projective plane', 'projective space'],
  },
  // Part III: finite fields
  {
    term: 'additive inverse',
    lesson: 5,
    def: 'The negative −a of a number a: the number with a + (−a) = 0. On a v-hour clock, −a is v − a (and −0 is 0).',
  },
  {
    term: 'extended Euclidean algorithm',
    lesson: 5,
    def: 'A quick way to find an inverse mod v: divide, then divide the last divisor by the remainder, and so on, keeping track of how each remainder is built from v and a. It works backward to a · a⁻¹ ≡ 1.',
  },
  {
    term: 'field',
    lesson: 5,
    def: 'A collection of numbers with an addition and a multiplication that obey the familiar rules (order doesn\'t matter, brackets don\'t matter, multiplying spreads over adding) and in which every number has a negative and every nonzero number has an inverse, so subtraction and division by nonzero numbers always work.',
    forms: ['field'],
    see: ['finite field', 'zero divisor'],
  },
  {
    term: 'finite field',
    lesson: 5,
    def: 'A field with finitely many elements. One with q elements exists exactly when q is a prime power, and any two with the same size are isomorphic. It is written GF(q).',
    see: ['Galois field', 'prime power'],
  },
  {
    term: 'Galois field',
    lesson: 5,
    def: 'Another name for a finite field, after Évariste Galois. GF(q) is the field with q elements; GF(p) is the integers mod a prime p.',
    see: ['finite field'],
  },
  {
    term: 'greatest common divisor',
    lesson: 5,
    def: 'The largest whole number that divides both of two numbers. a has an inverse mod v exactly when the greatest common divisor of a and v is 1.',
  },
  {
    term: 'ideal',
    lesson: 5,
    def: 'A collection of numbers that absorbs, the way the multiples of v do: a sum of two members, or a member times anything, is again a member. Dividing a number system by an ideal makes a quotient, such as ℤ/vℤ.',
    forms: [],
    see: ['quotient', 'maximal ideal'],
  },
  {
    term: 'isomorphism',
    lesson: 5,
    def: 'A one-to-one matching of the elements of one field with the elements of another that turns its addition and multiplication tables into the other\'s. Isomorphic fields are the same field with different labels.',
    forms: ['isomorphism', 'isomorphic'],
  },
  {
    term: 'maximal ideal',
    lesson: 5,
    def: 'An ideal with no other ideal fitting strictly between it and the whole number system. pℤ is maximal exactly when p is prime, which is why ℤ/pℤ is a field.',
    see: ['ideal'],
  },
  {
    term: 'multiplicative inverse',
    lesson: 5,
    def: 'For a nonzero number a, the number a⁻¹ with a × a⁻¹ = 1. Dividing by a means multiplying by a⁻¹. In ℤ/vℤ, a has one exactly when a and v are coprime.',
    see: ['extended Euclidean algorithm'],
  },
  {
    term: 'permutation',
    lesson: 5,
    def: 'A rearrangement: a list that contains every item exactly once, in some shuffled order.',
  },
  {
    term: 'prime',
    lesson: 5,
    def: 'A whole number above 1 whose only factors are 1 and itself: 2, 3, 5, 7, 11, … The integers mod v form a field exactly when v is prime.',
    forms: ['prime'],
    see: ['prime power'],
  },
  {
    term: 'quotient',
    lesson: 5,
    def: 'The number system made by counting numbers as the same when they differ by a member of an ideal. ℤ/vℤ, the integers mod v, is the quotient of the integers by the multiples of v.',
    forms: [],
    see: ['ideal', 'integers mod v'],
  },
  {
    term: 'commutative',
    lesson: 5,
    def: 'An operation is commutative when the order of the two inputs does not matter: a + b = b + a and a × b = b × a.',
    see: ['field'],
  },
  {
    term: 'associative',
    lesson: 5,
    def: 'An operation is associative when the grouping does not matter: (a + b) + c = a + (b + c), and the same for ×.',
    see: ['field'],
  },
  {
    term: 'distributive',
    lesson: 5,
    def: 'Multiplication is distributive over addition: a × (b + c) = a × b + a × c.',
    forms: ['distributive', 'distributes'],
    see: ['field'],
  },
  {
    term: 'coprime',
    lesson: 5,
    def: 'Two whole numbers are coprime when their only common factor is 1, that is, when their greatest common divisor is 1. In ℤ/vℤ, a has a multiplicative inverse exactly when a and v are coprime.',
    see: ['greatest common divisor', 'multiplicative inverse'],
  },
  {
    term: 'zero divisor',
    lesson: 5,
    def: 'A nonzero number whose product with some other nonzero number is 0. On a 6-hour clock 2 × 3 = 0, so 2 and 3 are zero divisors. A field has none.',
  },
  {
    term: 'characteristic',
    lesson: 6,
    def: 'The smallest number of 1s that add up to 0 in a field. It is always a prime p, and a field of characteristic p has a power of p as its size.',
  },
  {
    term: 'prime power',
    lesson: 6,
    def: 'A prime multiplied by itself some number of times: q = pᵉ, such as 2, 3, 4, 5, 7, 8, 9, 11, 13, 16, … Finite fields, and so Singer\'s construction, exist exactly for these sizes.',
    see: ['prime', 'finite field'],
  },
  {
    term: 'prime subfield',
    lesson: 6,
    def: 'The sums 1, 1 + 1, 1 + 1 + 1, … inside a field. They form a copy of the integers mod p, where p is the characteristic.',
    see: ['subfield', 'characteristic'],
  },
  {
    term: 'subfield',
    lesson: 6,
    def: 'A subset of a field that is a field by itself, using the same addition and multiplication. GF(q) sits inside GF(q³) as a subfield.',
  },
  {
    term: 'degree',
    lesson: 7,
    def: 'The highest power of x in a polynomial: x³ + x + 1 has degree 3.',
    forms: ['degree'],
  },
  {
    term: 'irreducible polynomial',
    lesson: 7,
    def: 'A polynomial that cannot be written as a product of two polynomials of smaller degree, the polynomial version of a prime. Remainders mod an irreducible polynomial of degree e over GF(p) form the field GF(pᵉ).',
    forms: ['irreducible polynomial', 'irreducible'],
    see: ['polynomial', 'primitive polynomial'],
  },
  {
    term: 'polynomial',
    lesson: 7,
    def: 'An expression like x³ + 2x + 1. Over GF(p) its coefficients are numbers mod p; x is just a symbol, and adding and multiplying work as in school algebra, with every coefficient reduced mod p.',
    see: ['degree', 'irreducible polynomial'],
  },
  {
    term: 'log',
    lesson: 8,
    def: 'If α is a primitive element, the log of a nonzero element a is the exponent i, from 0 to q − 2, with αⁱ = a. Multiplying elements adds their logs, mod q − 1.',
    forms: [],
    see: ['primitive element'],
  },
  {
    term: 'order (of a field element)',
    lesson: 8,
    def: 'The smallest exponent d ≥ 1 with g^d = 1. In a field with q elements it always divides q − 1.',
    forms: [],
    see: ['primitive element', 'order (of a difference set or plane)'],
  },
  {
    term: 'primitive element',
    lesson: 8,
    def: 'An element of a finite field whose powers run through every nonzero element: its order is q − 1. These lessons call it α (and ω in the small field GF(q)). Every finite field has at least one, and usually several: GF(8) has six.',
    forms: ['primitive element', 'primitive'],
    see: ['primitive polynomial', 'log'],
  },
  {
    term: 'primitive polynomial',
    lesson: 8,
    def: 'An irreducible polynomial f (with leading coefficient 1) for which x itself is a primitive element mod f. Example: x³ + x + 1 over GF(2), which makes α = x a primitive element of GF(8).',
    see: ['primitive element', 'irreducible polynomial'],
  },
  {
    term: 'fixed point',
    lesson: 9,
    def: 'An element that a map sends to itself. The fixed points of x ↦ x^q in GF(q³) are exactly the elements of GF(q).',
  },
  {
    term: 'freshman\'s dream',
    lesson: 9,
    def: '(a + b)^p = a^p + b^p. False for ordinary numbers, but true in a field of characteristic p, because every middle term of the expansion is a multiple of p and so is 0.',
    forms: ['freshman\'s dream', 'freshman’s dream'],
    see: ['Frobenius map'],
  },
  {
    term: 'Frobenius map',
    lesson: 9,
    def: 'The map x ↦ x^p in a field of characteristic p, or more generally x ↦ x^q for q = pᵉ. By the freshman\'s dream it respects both adding and multiplying, so it is an isomorphism from the field to itself (an automorphism).',
    see: ['freshman\'s dream', 'fixed point', 'conjugates'],
  },
  {
    term: 'trace',
    lesson: 9,
    def: 'Tr(x) = x + x^q + x^(q²) for x in GF(q³): the sum of x and its conjugates. It always lands in the small field GF(q), and it respects adding and scaling. The elements with trace 0 give Singer\'s difference set.',
    see: ['conjugates', 'Singer difference set'],
  },
  // Part IV: planes from fields
  {
    term: 'line through the origin',
    lesson: 10,
    def: 'All the multiples s · u of a nonzero vector u, one for each scalar s: q vectors in all. In PG(2, q) each one is a point.',
    see: ['plane through the origin', 'homogeneous coordinates'],
  },
  {
    term: 'origin',
    lesson: 10,
    def: 'The zero vector (0, 0, 0).',
    forms: [],
  },
  {
    term: 'plane through the origin',
    lesson: 10,
    def: 'All solutions (x, y, z) of one equation ax + by + cz = 0 with (a, b, c) not all zero: q² vectors. In PG(2, q) each one is a line.',
    see: ['line through the origin', 'subspace'],
  },
  {
    term: 'scalar',
    lesson: 10,
    def: 'A field element used to scale a vector: s · (x, y, z) = (sx, sy, sz).',
  },
  {
    term: 'subspace',
    lesson: 10,
    def: 'A set of vectors that contains the origin and is closed under adding and scaling. Lines and planes through the origin are subspaces.',
  },
  {
    term: 'vector',
    lesson: 10,
    def: 'Here, a list of three field elements (x, y, z). Over GF(q) there are q³ of them. Vectors add coordinate by coordinate and can be scaled by a field element.',
    see: ['scalar'],
  },
  {
    term: 'combination',
    lesson: 11,
    def: 's · u + t · w for scalars s and t. When u and w are not multiples of each other, their q² combinations form the plane through the origin containing both.',
    forms: [],
  },
  {
    term: 'cross product',
    lesson: 11,
    def: 'u × w, a vector whose dot product with both u and w is 0. It names the line through two points, or the point where two lines meet.',
    see: ['dot product'],
  },
  {
    term: 'dot product',
    lesson: 11,
    def: 'u · w = u₁w₁ + u₂w₂ + u₃w₃: multiply matching coordinates and add. A point lies on a line exactly when the dot product of their coordinates is 0.',
    see: ['cross product', 'homogeneous coordinates'],
  },
  {
    term: 'homogeneous coordinates',
    lesson: 11,
    def: '[x : y : z], a name for a point of PG(2, q): the line through the origin and (x, y, z). Scaling all three by a nonzero s names the same point, so only the ratios matter.',
    see: ['line through the origin', 'dot product'],
  },
  {
    term: 'line at infinity',
    lesson: 11,
    def: 'The extra line of a projective plane where each family of parallel lines meets. In PG(2, q) with the usual picture it is the line of points with x = 0.',
  },
  {
    term: 'linear map',
    lesson: 13,
    def: 'A map that respects adding vectors and scaling by the small field: f(u + w) = f(u) + f(w) and f(s · u) = s · f(u). Multiplying by α and taking the trace are both linear.',
    forms: [],
  },
  {
    term: 'Singer cycle',
    lesson: 13,
    def: 'The symmetry of PG(2, q) given by multiplying every element of GF(q³) by α. It moves point i to point i + 1, so it carries every point around a single cycle of length v = q² + q + 1.',
    see: ['symmetry', 'cyclic projective plane'],
  },
  {
    term: 'Singer\'s theorem',
    lesson: 13,
    def: 'For every prime power q there is a (q² + q + 1, q + 1, 1) difference set: the numbers i mod v for which αⁱ lies on one fixed line of PG(2, q). James Singer proved it in 1938, along with the same result for PG(m, q).',
    forms: ['Singer\'s theorem', 'Singer’s theorem'],
    see: ['Singer difference set'],
  },
  {
    term: 'conjugates',
    lesson: 14,
    def: 'For x in GF(q³), the three elements x, x^q and x^(q²): what the Frobenius map x ↦ x^q does to x zero, one and two times. Their sum is the trace.',
    forms: ['conjugates'],
    see: ['trace', 'Frobenius map'],
  },
  {
    term: 'lexicographically smallest form',
    lesson: 14,
    def: 'Of all the turns of a planar difference set and of its mirror image, the one whose sorted list of members comes first, compared member by member like words in a dictionary. It always starts {0, 1, …}.',
    forms: ['lexicographically smallest'],
    see: ['translation class', 'shape'],
  },
  {
    term: 'Singer difference set',
    lesson: 14,
    def: 'D = {i : Tr(αⁱ) = 0}, with i taken mod v = q² + q + 1: the numbers of the points on one line of PG(2, q). It is a (q² + q + 1, q + 1, 1) difference set, written down without any search.',
    forms: ['Singer difference set', 'Singer set'],
    see: ['trace', 'Singer\'s theorem'],
  },
  {
    term: 'multiplier',
    lesson: 15,
    def: 'A number t, coprime to v, for which t · D (every member multiplied by t, mod v) is a translate of D. For a Singer set of order q = pᵉ, p is always a multiplier.',
    see: ['translate'],
  },
  {
    term: 'shape',
    lesson: 15,
    def: 'A translation class together with its mirror image, the class of −D. Two sets have the same shape when one is a translate of the other or of the other\'s mirror image.',
    forms: [],
    see: ['translation class'],
  },
  {
    term: 'translation class',
    lesson: 15,
    def: 'A set D together with all its translates D + j. Two sets are in the same class exactly when one is a translate of the other.',
    see: ['translate', 'shape'],
  },
  // Part VI: the frontier
  {
    term: 'autocorrelation',
    lesson: 16,
    def: 'The score of a ±1 sequence against a copy of itself shifted t steps: multiply position by position and add. A sequence made from a difference set scores v at shift 0 and the same small value at every other shift.',
    see: ['correlation', 'sidelobes'],
  },
  {
    term: 'biplane',
    lesson: 16,
    def: 'A geometry whose lines (blocks) meet pairwise in exactly two points. A (v, k, 2) difference set gives one, like {0, 1, 2, 4, 7} mod 11.',
  },
  {
    term: 'complement',
    lesson: 16,
    def: 'The numbers not in a set. The complement of a (v, k, λ) difference set is a (v, v − k, v − 2k + λ) difference set.',
  },
  {
    term: 'hyperplane',
    lesson: 16,
    def: 'The solutions of one linear equation a₀x₀ + … + aₘxₘ = 0 in GF(q)^(m+1): a subspace with one dimension fewer than the whole space, as a plane through the origin is in GF(q)³. In PG(m, q) the hyperplanes play the role of lines, and their points give Singer\'s higher difference sets.',
    see: ['projective space'],
  },
  {
    term: 'm-sequence',
    lesson: 16,
    def: 'A maximal-length sequence: the bits from a shift register that runs through the longest possible period, 2^(m+1) − 1, before repeating. The positions of its 0s in one period form a Singer difference set.',
    forms: ['m-sequence', 'maximal-length sequence'],
    see: ['shift register', 'autocorrelation'],
  },
  {
    term: 'projective space',
    lesson: 16,
    def: 'PG(m, q): the lines through the origin in GF(q)^(m+1), with m + 1 coordinates instead of 3. PG(2, q) is the projective plane.',
    see: ['hyperplane', 'projective plane'],
  },
  {
    term: 'shift register',
    lesson: 16,
    def: 'A simple circuit that remembers the last few bits and makes the next bit by adding some of them, mod 2, then moves along one place.',
    see: ['m-sequence'],
  },
  {
    term: 'Desarguesian',
    lesson: 17,
    def: 'A projective plane built from a finite field, like PG(2, q). The open conjecture says every cyclic projective plane is Desarguesian.',
    see: ['prime power conjecture'],
  },
  {
    term: 'equivalent',
    lesson: 17,
    def: 'Two difference sets are equivalent when one is a translate of a multiple t · D of the other, for some t coprime to v. A set equivalent to a Singer set is "of Singer type".',
    forms: [],
    see: ['multiplier', 'translate'],
  },
  {
    term: 'Euler\'s totient',
    lesson: 8,
    def: 'φ(v), "phi of v": how many of 1, 2, …, v are coprime to v. For example φ(7) = 6 and φ(21) = 12.',
    forms: ['totient'],
  },
  {
    term: 'prime power conjecture',
    lesson: 17,
    def: 'The unproved guess that every finite projective plane has prime-power order. For cyclic planes it says every planar difference set has prime-power order; it is still open.',
    see: ['prime power', 'Desarguesian'],
  },
  // Part VII: applications
  {
    term: 'coded aperture',
    lesson: 19,
    def: 'A plate with many holes in a known pattern, used instead of a lens for X-rays and gamma rays. The detector records overlapping shadows, which a computer unscrambles.',
    see: ['uniformly redundant array'],
  },
  {
    term: 'uniformly redundant array',
    lesson: 19,
    def: 'A coded-aperture mask built from a cyclic difference set, so that decoding gives a flat floor with no ghosts.',
    see: ['coded aperture'],
  },
  {
    term: 'correlation',
    lesson: 20,
    def: 'The match score of two signals at a given shift: multiply matching entries and add. High when the two line up.',
    see: ['autocorrelation'],
  },
  {
    term: 'sidelobes',
    lesson: 20,
    def: 'The autocorrelation values at the wrong shifts, where the copies don\'t line up. A good code has small, even sidelobes.',
    forms: ['sidelobes', 'side-lobes'],
    see: ['autocorrelation'],
  },
  {
    term: 'bit',
    lesson: 21,
    def: 'A binary digit: 0 or 1.',
    forms: ['bits'],
  },
  {
    term: 'codeword',
    lesson: 21,
    def: 'A word that passes all the parity checks of an error-correcting code. The sender only ever sends codewords.',
    see: ['parity check'],
  },
  {
    term: 'difference-set cyclic code',
    lesson: 21,
    def: 'An error-correcting code whose parity checks are the lines of a cyclic plane, the translates of a difference set. Each bit is fixed by a majority vote of its checks.',
    forms: ['difference-set cyclic code'],
    see: ['parity check', 'codeword'],
  },
  {
    term: 'error-correcting code',
    lesson: 21,
    def: 'A scheme that adds extra bits to a message so the receiver can find and undo a few flipped bits.',
  },
  {
    term: 'parity',
    lesson: 21,
    def: 'The sum of some bits mod 2: 0 when they hold an even number of 1s, 1 when odd. Flipping any one bit flips the parity.',
    see: ['XOR'],
  },
  {
    term: 'parity check',
    lesson: 21,
    def: 'A set of bit positions. A word passes the check when the bits there have parity 0, and fails it otherwise.',
  },
  {
    term: 'XOR',
    lesson: 21,
    def: '"Exclusive or", written ⊕: adding bits mod 2. a ⊕ b is 1 when exactly one of a and b is 1.',
    forms: ['XOR'],
    see: ['parity'],
  },
  {
    term: 'quorum',
    lesson: 22,
    def: 'The group of servers one server must ask before acting. Using the translates of a planar difference set as quorums makes any two quorums overlap in exactly one server.',
  },
  {
    term: 'Golomb ruler',
    lesson: 23,
    def: 'A set of marks in which no two pairs are the same distance apart. It need not measure every length, only never measure one twice.',
    see: ['modular Golomb ruler'],
  },
  {
    term: 'modular Golomb ruler',
    lesson: 23,
    def: 'Marks on a clock with no two ordered pairs the same number of steps apart clockwise. A planar difference set is one with nothing missing.',
  },
  {
    term: 'bye',
    lesson: 24,
    def: 'In a race chart, a phantom car that fills a place when there are fewer cars than the chart has. Its lane simply runs empty.',
    forms: ['byes'],
    see: ['race chart'],
  },
  {
    term: 'race chart',
    lesson: 24,
    def: 'A schedule of heats for a race on a track with several lanes, saying which car runs in which lane in each heat.',
  },
  {
    term: 'balanced incomplete block design',
    lesson: 25,
    def: 'A collection of equal-size blocks (subsets) of some items, in which every pair of items lies together in the same number of blocks. A projective plane is one, with lines as blocks.',
    see: ['projective plane'],
  },
  {
    term: 'parity declustering',
    lesson: 25,
    def: 'Spreading a storage system\'s stripes over more disks than a stripe is wide, so that rebuilding a failed disk shares the reading among all the others.',
    see: ['stripe', 'RAID-5'],
  },
  {
    term: 'RAID-5',
    lesson: 25,
    def: 'A disk array in which each stripe of data chunks gets one extra XOR parity chunk, so the data on any one failed disk can be rebuilt from the rest.',
    see: ['stripe', 'parity'],
  },
  {
    term: 'stripe',
    lesson: 25,
    def: 'A group of data chunks on different disks, plus one parity chunk on yet another disk.',
    forms: ['stripe', 'chunk'],
  },
  {
    term: 'affine rule',
    lesson: 26,
    def: 'A linear rule on bits, or a linear rule with its answer flipped (XOR 1).',
    see: ['linear rule'],
  },
  {
    term: 'bent function',
    lesson: 26,
    def: 'A Boolean function as far as possible from every affine rule: on 4 bits, each affine rule agrees with it on exactly 6 or 10 of the 16 inputs. The inputs where it is 1 form a difference set under XOR.',
    see: ['Hadamard difference set', 'perfect nonlinear'],
  },
  {
    term: 'Boolean function',
    lesson: 26,
    def: 'A rule that gives one output bit, 0 or 1, for each string of input bits.',
  },
  {
    term: 'differential cryptanalysis',
    lesson: 26,
    def: 'An attack that flips some input bits and watches how often the output changes. Biham and Shamir published it in 1991.',
    see: ['perfect nonlinear'],
  },
  {
    term: 'Hadamard difference set',
    lesson: 26,
    def: 'A difference set with parameters (4n², 2n² − n, n² − n) or (4n², 2n² + n, n² + n), such as (16, 6, 2). Bent functions give them under XOR.',
    forms: ['Hadamard difference set'],
    see: ['bent function'],
  },
  {
    term: 'linear cryptanalysis',
    lesson: 26,
    def: 'An attack that pretends a piece of a cipher is a linear rule, and is right often enough to learn the key. Matsui published it in 1993.',
    see: ['linear rule', 'bent function'],
  },
  {
    term: 'linear rule',
    lesson: 26,
    def: 'A function on bits that XORs some of the input bits together, such as x₁ ⊕ x₃. On 4 bits there are 16, counting the rule that always says 0.',
    see: ['affine rule'],
  },
  {
    term: 'perfect nonlinear',
    lesson: 26,
    def: 'A Boolean function whose output changes for exactly half of all inputs, whichever input bits are flipped. On an even number of bits these are exactly the bent functions.',
    see: ['bent function', 'differential cryptanalysis'],
  },
];

export const SYMBOLS: GlossarySymbol[] = [
  { symbol: 'ℤ', lesson: 1, def: 'The integers: … −2, −1, 0, 1, 2, …' },
  { symbol: 'vℤ', lesson: 1, def: 'The multiples of v: … −2v, −v, 0, v, 2v, …' },
  { symbol: 'ℤ/vℤ', read: 'Z mod v Z', lesson: 1, def: 'The integers mod v: the v points of a v-hour clock.' },
  { symbol: 'a ≡ b (mod v)', read: 'a is congruent to b mod v', lesson: 1, def: 'a and b differ by a multiple of v.' },
  { symbol: 'x mod v', lesson: 1, def: 'The residue of x: its remainder after dividing by v, between 0 and v − 1.' },
  { symbol: '(v, k, λ)', read: 'v, k, lambda', lesson: 1, def: 'A difference set with k points on a v-hour clock, where each nonzero difference occurs λ times.' },
  { symbol: 'n', lesson: 1, def: 'The order of a planar difference set or projective plane: v = n² + n + 1 and k = n + 1.' },
  { symbol: 'D + j', lesson: 2, def: 'The translate of D by j: add j to every member, mod v.' },
  { symbol: 'A ∩ B', lesson: 2, def: 'The intersection of A and B: the members they share.' },
  { symbol: 'x ↦ y', read: 'x goes to y', lesson: 3, def: 'A rule that turns each x into y.' },
  { symbol: 'a⁻¹', read: 'a inverse', lesson: 5, def: 'The multiplicative inverse of a: a × a⁻¹ = 1.' },
  { symbol: 'GF(q)', lesson: 5, def: 'The finite (Galois) field with q elements. GF(p) for a prime p is ℤ/pℤ.' },
  { symbol: 'p', lesson: 5, def: 'Always a prime.' },
  { symbol: 'q = pᵉ', lesson: 6, def: 'The size of a finite field, a prime power: p its characteristic, e the exponent.' },
  { symbol: 'F ≅ G', read: 'F is isomorphic to G', lesson: 6, def: 'F and G are the same field with different labels.' },
  { symbol: 'F*', read: 'F star', lesson: 8, def: 'The nonzero elements of a field F.' },
  { symbol: '⟨g⟩', read: 'the powers of g', lesson: 8, def: 'The set {1, g, g², …}.' },
  { symbol: 'α', read: 'alpha', lesson: 8, def: 'A primitive element: every nonzero element of the field is a power of α. In Parts IV and V, α is a primitive element of GF(q³).' },
  { symbol: 'd | N', read: 'd divides N', lesson: 8, def: 'N is a whole-number multiple of d.' },
  { symbol: 'ω', read: 'omega', lesson: 11, def: 'A primitive element of the small field GF(q) when q is not prime, so its elements can be written 0, 1, ω, ω², …' },
  { symbol: 'Tr(x)', read: 'trace of x', lesson: 9, def: 'x + x^q + x^(q²), an element of GF(q) for every x in GF(q³).' },
  { symbol: 'GF(q)³', lesson: 10, def: 'All vectors (x, y, z) with coordinates in GF(q): q³ of them.' },
  { symbol: 'PG(2, q)', lesson: 11, def: 'The projective plane over GF(q): points are lines through the origin of GF(q)³, lines are planes through the origin. It has q² + q + 1 points.' },
  { symbol: '[x : y : z]', lesson: 11, def: 'Homogeneous coordinates of a point of PG(2, q).' },
  { symbol: 'u · w, u × w', lesson: 11, def: 'The dot product and the cross product of two vectors.' },
  { symbol: 't · D', read: 't times D', lesson: 15, def: 'Every member of D multiplied by t, mod v.' },
  { symbol: '−D', lesson: 15, def: 'The mirror image of D: every member negated.' },
  { symbol: 'PG(m, q)', lesson: 16, def: 'Projective space of dimension m over GF(q), with m + 1 coordinates.' },
  { symbol: 'φ(v)', read: 'phi of v', lesson: 8, def: 'Euler\'s totient function: how many of 1, …, v are coprime to v.' },
  { symbol: 'Σ', read: 'sigma', lesson: 20, def: '"Add up": Σ xᵢ is x₀ + x₁ + … + x_{v−1}.' },
  { symbol: '⊕', read: 'XOR', lesson: 21, def: 'Adding bits mod 2.' },
];

/** The URL fragment for a term: lower case, words joined by hyphens. */
export function termSlug(term: string): string {
  return term
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Terms in dictionary order, ignoring case. */
export function sortedGlossary(terms: readonly GlossaryTerm[] = GLOSSARY): GlossaryTerm[] {
  return [...terms].sort((a, b) => a.term.localeCompare(b.term, 'en', { sensitivity: 'base' }));
}

/** The phrases to link in lesson text for a term (its own name by default). */
export function linkForms(t: GlossaryTerm): string[] {
  return t.forms ?? [t.term];
}

/**
 * Split a definition into plain text and superscripts, so "x^q" and
 * "2^(m+1)" can be drawn as x<sup>q</sup> and 2<sup>m+1</sup>.
 */
export function defParts(def: string): (string | { sup: string })[] {
  const parts: (string | { sup: string })[] = [];
  const re = /\^(?:\(([^()]*)\)|([\p{L}\p{N}²³]+))/gu;
  let at = 0;
  for (const m of def.matchAll(re)) {
    if (m.index > at) parts.push(def.slice(at, m.index));
    parts.push({ sup: m[1] ?? m[2] });
    at = m.index + m[0].length;
  }
  if (at < def.length) parts.push(def.slice(at));
  return parts;
}
