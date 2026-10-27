// Finite fields for Part III: the clocks ℤ/nℤ, and the rings GF(p)[x]/(f)
// that are fields exactly when f is irreducible.

import { divisors, extendedGcd, gcd, isPrime, mobius, mod, primeFactors, totient } from './numbers';
import {
  type Poly,
  polyAdd,
  polyDeg,
  polyDivMod,
  polyExtGcd,
  polyFormat,
  polyIsOne,
  polyIsZero,
  polyMod,
  polyMulMod,
  polySub,
} from './poly';

// ---------------------------------------------------------------------------
// ℤ/nℤ

export function znAddTable(n: number): number[][] {
  return Array.from({ length: n }, (_, a) => Array.from({ length: n }, (_, b) => (a + b) % n));
}

export function znMulTable(n: number): number[][] {
  return Array.from({ length: n }, (_, a) => Array.from({ length: n }, (_, b) => (a * b) % n));
}

/** The inverse of a in ℤ/nℤ, or null when there is none. */
export function znInverse(a: number, n: number): number | null {
  if (n === 1) return 0;
  const { g, s } = extendedGcd(mod(a, n), n);
  return g === 1 ? mod(s, n) : null;
}

/** Nonzero a for which some nonzero b has a·b ≡ 0 (mod n). */
export function znZeroDivisors(n: number): number[] {
  const result: number[] = [];
  for (let a = 1; a < n; a++) if (gcd(a, n) > 1) result.push(a);
  return result;
}

/** ℤ/nℤ is a field exactly when n is prime. */
export function znIsField(n: number): boolean {
  return isPrime(n);
}

/** True when the row contains every value 0…n−1 once. */
export function isPermutation(row: readonly number[]): boolean {
  const seen = new Set(row);
  return seen.size === row.length && row.every((x) => x >= 0 && x < row.length);
}

/** One division step of Euclid's algorithm: a = q·b + r. */
export interface EuclidStep {
  a: number;
  b: number;
  q: number;
  r: number;
}

/** The division steps of Euclid's algorithm on (n, a), ending at remainder 0. */
export function euclidSteps(a: number, n: number): EuclidStep[] {
  const steps: EuclidStep[] = [];
  let [x, y] = [n, mod(a, n)];
  while (y !== 0) {
    const q = Math.floor(x / y);
    steps.push({ a: x, b: y, q, r: x - q * y });
    [x, y] = [y, x - q * y];
  }
  return steps;
}

// ---------------------------------------------------------------------------
// Polynomials over GF(p)

/** Coefficients of n in base p, as a polynomial with `length` coefficients (lowest first). */
export function digitsOf(n: number, p: number, length: number): number[] {
  const d: number[] = [];
  for (let i = 0; i < length; i++, n = Math.floor(n / p)) d.push(n % p);
  return d;
}

/** Every monic polynomial of degree k over GF(p), ordered by the base-p value of its lower coefficients. */
export function monicPolys(p: number, k: number): Poly[] {
  const result: Poly[] = [];
  for (let n = 0; n < p ** k; n++) result.push([...digitsOf(n, p, k), 1]);
  return result;
}

/** Irreducible over GF(p): f is not a product of two polynomials of smaller degree. */
export function isIrreducible(f: Poly, p: number): boolean {
  const k = polyDeg(f);
  if (k < 1) return false;
  for (let d = 1; 2 * d <= k; d++) {
    for (const g of monicPolys(p, d)) if (polyIsZero(polyDivMod(f, g, p).r)) return false;
  }
  return true;
}

/** The monic irreducible factors of a monic f, with repetition, lowest degree first. */
export function factorPoly(f: Poly, p: number): Poly[] {
  const factors: Poly[] = [];
  let rest = f.slice();
  for (let d = 1; 2 * d <= polyDeg(rest); d++) {
    for (const g of monicPolys(p, d)) {
      if (!isIrreducible(g, p)) continue;
      for (;;) {
        const { q, r } = polyDivMod(rest, g, p);
        if (!polyIsZero(r)) break;
        factors.push(g);
        rest = q;
      }
    }
  }
  if (polyDeg(rest) >= 1) factors.push(rest);
  return factors;
}

/** Number of monic irreducible polynomials of degree k over GF(p): (1/k) Σ_{d|k} μ(d) p^(k/d). */
export function irreducibleCount(p: number, k: number): number {
  return divisors(k).reduce((acc, d) => acc + mobius(d) * p ** (k / d), 0) / k;
}

/** Number of primitive polynomials of degree k over GF(p): φ(p^k − 1)/k. */
export function primitiveCount(p: number, k: number): number {
  return totient(p ** k - 1) / k;
}

export function irreduciblePolys(p: number, k: number): Poly[] {
  return monicPolys(p, k).filter((f) => isIrreducible(f, p));
}

/** Irreducible, and x has order p^k − 1 modulo f. */
export function isPrimitivePoly(f: Poly, p: number): boolean {
  if (!isIrreducible(f, p)) return false;
  const R = new PolyRing(p, f);
  return R.isPrimitive(R.x);
}

export function primitivePolys(p: number, k: number): Poly[] {
  return monicPolys(p, k).filter((f) => isPrimitivePoly(f, p));
}

export type PolyKind = 'primitive' | 'irreducible' | 'reducible';

export function polyKind(f: Poly, p: number): PolyKind {
  if (!isIrreducible(f, p)) return 'reducible';
  return isPrimitivePoly(f, p) ? 'primitive' : 'irreducible';
}

// ---------------------------------------------------------------------------
// GF(p)[x] / (f)

export type LabelStyle = 'poly' | 'digits';

/**
 * The ring of polynomials over GF(p) modulo a monic f of degree k, which is
 * the field GF(p^k) exactly when f is irreducible. Elements are numbered
 * 0 … p^k − 1 by their coefficients read as a base-p numeral:
 * a₀ + a₁x + … + a_(k−1)x^(k−1) is Σ aᵢ pⁱ.
 */
export class PolyRing {
  readonly p: number;
  readonly k: number;
  readonly modulus: Poly;
  readonly size: number;
  readonly isField: boolean;
  /** Coefficient lists for each element number. */
  private readonly polys: Poly[];

  constructor(p: number, modulus: Poly) {
    if (!isPrime(p)) throw new Error(`${p} is not prime`);
    const f = modulus.map((c) => mod(c, p));
    const k = polyDeg(f);
    if (k < 1 || f[k] !== 1 || f.length !== k + 1) throw new Error('The modulus must be monic of degree ≥ 1');
    this.p = p;
    this.k = k;
    this.modulus = f;
    this.size = p ** k;
    this.isField = isIrreducible(f, p);
    this.polys = Array.from({ length: this.size }, (_, n) => trimmed(digitsOf(n, p, k)));
  }

  /** The polynomial (coefficients lowest first) for element n. */
  poly(n: number): Poly {
    return this.polys[n].slice();
  }

  /** The coefficient tuple (a₀, …, a_(k−1)) for element n. */
  coeffs(n: number): number[] {
    return digitsOf(n, this.p, this.k);
  }

  /** The element number of any polynomial, after reducing it mod f. */
  index(a: Poly): number {
    const r = polyMod(
      a.map((c) => mod(c, this.p)),
      this.modulus,
      this.p,
    );
    return r.reduceRight((acc, c) => acc * this.p + c, 0);
  }

  get zero(): number {
    return 0;
  }

  get one(): number {
    return this.index([1]);
  }

  /** The class of x itself. */
  get x(): number {
    return this.index([0, 1]);
  }

  /** The element c·1 for an integer c (an element of the prime subfield). */
  constant(c: number): number {
    return this.index([mod(c, this.p)]);
  }

  elements(): number[] {
    return Array.from({ length: this.size }, (_, i) => i);
  }

  add(a: number, b: number): number {
    return this.index(polyAdd(this.polys[a], this.polys[b], this.p));
  }

  sub(a: number, b: number): number {
    return this.index(polySub(this.polys[a], this.polys[b], this.p));
  }

  neg(a: number): number {
    return this.sub(0, a);
  }

  mul(a: number, b: number): number {
    return this.index(polyMulMod(this.polys[a], this.polys[b], this.modulus, this.p));
  }

  pow(a: number, e: number): number {
    if (e < 0) {
      const inv = this.inv(a);
      if (inv === null) throw new Error('Negative power of a non-unit');
      return this.pow(inv, -e);
    }
    let result = this.one;
    let base = a;
    while (e > 0) {
      if (e % 2 === 1) result = this.mul(result, base);
      base = this.mul(base, base);
      e = Math.floor(e / 2);
    }
    return result;
  }

  /** The inverse of a, found with the extended Euclidean algorithm, or null if a shares a factor with f. */
  inv(a: number): number | null {
    if (a === 0) return null;
    const { g, s } = polyExtGcd(this.polys[a], this.modulus, this.p);
    return polyIsOne(g) ? this.index(s) : null;
  }

  div(a: number, b: number): number | null {
    const inv = this.inv(b);
    return inv === null ? null : this.mul(a, inv);
  }

  /** Nonzero elements a with a·b = 0 for some nonzero b. */
  zeroDivisors(): number[] {
    return this.elements().filter((a) => a !== 0 && this.inv(a) === null);
  }

  addTable(): number[][] {
    return this.elements().map((a) => this.elements().map((b) => this.add(a, b)));
  }

  mulTable(): number[][] {
    return this.elements().map((a) => this.elements().map((b) => this.mul(a, b)));
  }

  /** Multiplicative order of a, or null when a is zero or not invertible. */
  order(a: number): number | null {
    if (a === 0 || this.inv(a) === null) return null;
    let x = a;
    for (let n = 1; ; n++) {
      if (x === this.one) return n;
      x = this.mul(x, a);
    }
  }

  /**
   * a is primitive when its powers visit every nonzero element, i.e. its
   * order is p^k − 1. Uses the fast test: a^((p^k − 1)/r) ≠ 1 for every
   * prime r dividing p^k − 1.
   */
  isPrimitive(a: number): boolean {
    if (!this.isField || a === 0) return false;
    const n = this.size - 1;
    if (this.pow(a, n) !== this.one) return false;
    return primeFactors(n).every((r) => this.pow(a, n / r) !== this.one);
  }

  /** a⁰, a¹, …, up to (not including) the first repeat of 1. */
  powers(a: number): number[] {
    const result = [this.one];
    if (a === 0) return [this.one, 0];
    for (let x = a; x !== this.one; x = this.mul(x, a)) {
      result.push(x);
      if (result.length > this.size) break;
    }
    return result;
  }

  /** logs[a] = i with g^i = a, or −1 where a is not a power of g (always for a = 0). */
  logTable(g: number): number[] {
    const logs = new Array<number>(this.size).fill(-1);
    if (g === 0) return logs;
    this.powers(g).forEach((x, i) => {
      if (logs[x] === -1) logs[x] = i;
    });
    return logs;
  }

  /** The Frobenius map applied e times: a ↦ a^(p^e). */
  frobenius(a: number, e = 1): number {
    return this.pow(a, this.p ** e);
  }

  /** Evaluate a polynomial with coefficients in GF(p) at the element r. */
  evaluate(f: Poly, r: number): number {
    let acc = 0;
    for (let i = f.length - 1; i >= 0; i--) acc = this.add(this.mul(acc, r), this.constant(f[i]));
    return acc;
  }

  /** Elements r with f(r) = 0. */
  roots(f: Poly): number[] {
    return this.elements().filter((r) => this.evaluate(f, r) === 0);
  }

  /** Label for element n: a polynomial in `variable`, or its coefficient digits highest first. */
  label(n: number, style: LabelStyle = 'poly', variable = 'x', compact = true): string {
    if (style === 'digits') return this.coeffs(n).reverse().join('');
    return polyFormat(this.polys[n], variable, compact);
  }
}

function trimmed(a: Poly): Poly {
  const r = a.slice();
  while (r.length > 1 && r[r.length - 1] === 0) r.pop();
  return r;
}

/**
 * An isomorphism from F = GF(p)[x]/(f) to G = GF(p)[y]/(g), both fields of
 * the same size: send x to a root r of f in G, so a(x) ↦ a(r). Returns the
 * relabeling as an array (element of F ↦ element of G), or null if f has no
 * root in G. `choice` picks among the roots.
 */
export function findIsomorphism(F: PolyRing, G: PolyRing, choice = 0): number[] | null {
  if (F.p !== G.p || F.k !== G.k || !F.isField || !G.isField) return null;
  const roots = G.roots(F.modulus);
  if (roots.length === 0) return null;
  const r = roots[mod(choice, roots.length)];
  return F.elements().map((a) => G.evaluate(F.poly(a), r));
}

/** True when map is a bijection from F to G that preserves + and ×. */
export function isIsomorphism(F: PolyRing, G: PolyRing, map: readonly number[]): boolean {
  if (map.length !== F.size || new Set(map).size !== G.size) return false;
  for (const a of F.elements()) {
    for (const b of F.elements()) {
      if (map[F.add(a, b)] !== G.add(map[a], map[b])) return false;
      if (map[F.mul(a, b)] !== G.mul(map[a], map[b])) return false;
    }
  }
  return true;
}

/** Parse "1,1,0,1" (lowest coefficient first) into a polynomial, or null. */
export function parsePoly(text: string | null | undefined): Poly | null {
  if (!text) return null;
  const parts = text.split(',').map((s) => Number(s.trim()));
  if (parts.length < 2 || parts.some((c) => !Number.isInteger(c) || c < 0)) return null;
  return parts;
}

/** The first primitive polynomial of degree k over GF(p) in monicPolys order. */
export function firstPrimitivePoly(p: number, k: number): Poly {
  const f = monicPolys(p, k).find((g) => isPrimitivePoly(g, p));
  if (!f) throw new Error(`No primitive polynomial of degree ${k} over GF(${p})`);
  return f;
}

const SUPERSCRIPT_DIGITS = '⁰¹²³⁴⁵⁶⁷⁸⁹';

/**
 * Parse a polynomial typed by a reader, such as "x^4 + 2x + 1", "x⁴+x+1",
 * or "x3 - 1", reducing coefficients mod p. Returns null if it can't parse.
 */
export function parsePolyText(text: string, p: number, variable = 'x'): Poly | null {
  let s = text.replace(/\s+/g, '').toLowerCase();
  s = s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]+/g, (m) => '^' + [...m].map((c) => SUPERSCRIPT_DIGITS.indexOf(c)).join(''));
  s = s.replace(/[−–]/g, '-').replace(/\*/g, '');
  if (s === '') return null;
  const v = variable.toLowerCase();
  const termRe = new RegExp(`^([+-]?)(\\d*)(${v}(?:\\^?(\\d+))?)?`);
  const coeffs: number[] = [];
  let rest = s;
  while (rest.length > 0) {
    const m = termRe.exec(rest);
    if (!m || m[0] === '' || m[0] === '+' || m[0] === '-') return null;
    const sign = m[1] === '-' ? -1 : 1;
    const hasVar = m[3] !== undefined;
    if (!hasVar && m[2] === '') return null;
    const c = m[2] === '' ? 1 : Number(m[2]);
    const deg = hasVar ? (m[4] !== undefined ? Number(m[4]) : 1) : 0;
    if (deg > 64) return null;
    while (coeffs.length <= deg) coeffs.push(0);
    coeffs[deg] = mod(coeffs[deg] + sign * c, p);
    rest = rest.slice(m[0].length);
    if (rest.length > 0 && rest[0] !== '+' && rest[0] !== '-') return null;
  }
  while (coeffs.length > 1 && coeffs[coeffs.length - 1] === 0) coeffs.pop();
  return coeffs;
}

export interface DivisionStep {
  /** The term c·x^d added to the quotient. */
  term: Poly;
  /** term × divisor, the amount subtracted. */
  subtracted: Poly;
  /** What is left after subtracting. */
  remainder: Poly;
}

/** Long division of a by b over GF(p), one leading term at a time. */
export function divisionSteps(a: Poly, b: Poly, p: number): DivisionStep[] {
  const db = polyDeg(b);
  if (db < 0) throw new Error('Division by zero');
  const leadInv = modInverseSmall(b[db], p);
  const steps: DivisionStep[] = [];
  let r = a.slice();
  while (polyDeg(r) >= db) {
    const dr = polyDeg(r);
    const c = mod(r[dr] * leadInv, p);
    const term = [...new Array<number>(dr - db).fill(0), c];
    const subtracted = polyMulPlain(term, b, p);
    r = polySub(r, subtracted, p);
    steps.push({ term, subtracted, remainder: r });
  }
  return steps;
}

function modInverseSmall(c: number, p: number): number {
  for (let i = 1; i < p; i++) if ((c * i) % p === 1) return i;
  throw new Error(`${c} has no inverse mod ${p}`);
}

function polyMulPlain(a: Poly, b: Poly, p: number): Poly {
  const res = new Array<number>(a.length + b.length - 1).fill(0);
  for (let i = 0; i < a.length; i++) for (let j = 0; j < b.length; j++) res[i + j] = (res[i + j] + a[i] * b[j]) % p;
  return trimmed(res);
}
