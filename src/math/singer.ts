import { gcd, mod, primeFactors, primePower } from './numbers';
import { type Poly, polyAdd, polyIsOne, polyIsZero, polyMulMod, polyPowMod } from './poly';

const X: Poly = [0, 1];

/**
 * The first primitive monic polynomial of degree m over GF(p), searching
 * constant terms first in lexicographic order. Deterministic, unlike the
 * notebook's random search; any primitive polynomial gives an equivalent set.
 */
export function findPrimitivePoly(p: number, m: number): Poly {
  const order = p ** m - 1;
  const factors = primeFactors(order);
  const total = p ** m;
  for (let n = 0; n < total; n++) {
    const poly: Poly = [];
    for (let i = 0, r = n; i < m; i++, r = Math.floor(r / p)) poly.push(r % p);
    poly.push(1);
    if (poly[0] === 0) continue;
    if (!polyIsOne(polyPowMod(X, order, poly, p))) continue;
    if (factors.every((r) => !polyIsOne(polyPowMod(X, order / r, poly, p)))) return poly;
  }
  throw new Error(`No primitive polynomial of degree ${m} over GF(${p})`);
}

export function singerV(q: number): number {
  return q * q + q + 1;
}

/**
 * A Singer (q² + q + 1, q + 1, 1) planar difference set: the indices i for
 * which Tr(α^i) = α^i + α^(iq) + α^(iq²) vanishes in GF(q³).
 */
export function singerSet(q: number): number[] {
  const pe = primePower(q);
  if (!pe) throw new Error(`${q} is not a prime power`);
  const [p, e] = pe;
  const P = findPrimitivePoly(p, 3 * e);
  const v = singerV(q);

  const xq = polyPowMod(X, q, P, p);
  const xq2 = polyPowMod(xq, q, P, p);
  let cur: Poly = [1];
  let curQ: Poly = [1];
  let curQ2: Poly = [1];
  const set: number[] = [];
  for (let i = 0; i < v; i++) {
    if (polyIsZero(polyAdd(polyAdd(cur, curQ, p), curQ2, p))) set.push(i);
    cur = polyMulMod(cur, X, P, p);
    curQ = polyMulMod(curQ, xq, P, p);
    curQ2 = polyMulMod(curQ2, xq2, P, p);
  }
  return set;
}

function compareLex(a: readonly number[], b: readonly number[]): number {
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i] !== b[i]) return a[i] - b[i];
  }
  return a.length - b.length;
}

/**
 * Canonical representative of a set under translation and negation: the
 * lexicographically smallest sorted translate of D or −D that contains 0.
 */
export function normalizeSet(set: readonly number[], v: number): number[] {
  let best: number[] | null = null;
  for (const s of [set, set.map((y) => mod(-y, v))]) {
    for (const x of s) {
      const rep = s.map((y) => mod(y - x, v)).sort((a, b) => a - b);
      if (!best || compareLex(rep, best) < 0) best = rep;
    }
  }
  return best ?? [];
}

/**
 * The distinct Singer sets for q up to translation and negation, found by
 * applying every multiplier t coprime to v, sorted lexicographically.
 */
export function nonIsomorphicSingerSets(q: number): number[][] {
  const v = singerV(q);
  const base = singerSet(q);
  const classes = new Map<string, number[]>();
  for (let t = 1; t < v; t++) {
    if (gcd(t, v) !== 1) continue;
    const rep = normalizeSet(
      base.map((x) => (x * t) % v),
      v,
    );
    classes.set(rep.join(','), rep);
  }
  return [...classes.values()].sort(compareLex);
}
