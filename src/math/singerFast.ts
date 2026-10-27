// A fast Singer construction for large q, used by the large-q explorer.
//
// `singerSet` in singer.ts builds GF(q³) as polynomials of degree below 3e
// over GF(p), which costs O(e²) per step and takes many seconds near
// q = 1000. Here GF(q) is a pair of log tables, GF(q³) is GF(q)[x]/(f) for a
// primitive cubic f over GF(q), and each step is a handful of table lookups.

import { primeFactors, primePower } from './numbers';
import { findPrimitivePoly, singerV } from './singer';

/** GF(q) for q = p^e: elements are 0…q − 1, written in base p as coefficient vectors. */
export interface SmallField {
  q: number;
  p: number;
  e: number;
  add(a: number, b: number): number;
  neg(a: number): number;
  mul(a: number, b: number): number;
}

export function smallField(q: number): SmallField {
  const pe = primePower(q);
  if (!pe) throw new Error(`${q} is not a prime power`);
  const [p, e] = pe;
  if (e === 1) {
    return {
      q,
      p,
      e,
      add: (a, b) => (a + b) % p,
      neg: (a) => (p - a) % p,
      mul: (a, b) => (a * b) % p,
    };
  }
  // Digit-wise addition, and multiplication through powers of a root of a
  // primitive polynomial of degree e over GF(p).
  const addDigits = (a: number, b: number, sign: 1 | -1): number => {
    let out = 0;
    for (let i = 0, w = 1; i < e; i++, w *= p) {
      const da = Math.floor(a / w) % p;
      const db = Math.floor(b / w) % p;
      out += ((da + sign * db + p) % p) * w;
    }
    return out;
  };
  const addTable = new Uint16Array(q * q);
  for (let a = 0; a < q; a++) for (let b = 0; b < q; b++) addTable[a * q + b] = addDigits(a, b, 1);
  const negTable = new Uint16Array(q);
  for (let a = 0; a < q; a++) negTable[a] = addDigits(0, a, -1);

  const poly = findPrimitivePoly(p, e); // monic, low degree first
  const exp = new Uint16Array(2 * (q - 1));
  const log = new Int32Array(q).fill(-1);
  const coeffs = new Array<number>(e).fill(0);
  coeffs[0] = 1;
  for (let i = 0; i < q - 1; i++) {
    let x = 0;
    for (let j = e - 1; j >= 0; j--) x = x * p + coeffs[j];
    exp[i] = x;
    exp[i + q - 1] = x;
    log[x] = i;
    // Multiply by the root: shift up and reduce with x^e = −(poly[0] + … + poly[e−1] x^(e−1)).
    const top = coeffs[e - 1];
    for (let j = e - 1; j > 0; j--) coeffs[j] = (coeffs[j - 1] - top * poly[j] + p * p) % p;
    coeffs[0] = (p * p - top * poly[0]) % p;
  }
  return {
    q,
    p,
    e,
    add: (a, b) => addTable[a * q + b],
    neg: (a) => negTable[a],
    mul: (a, b) => (a === 0 || b === 0 ? 0 : exp[log[a] + log[b]]),
  };
}

/** A cubic x³ = a x² + b x + c over GF(q), stored as [a, b, c]. */
type Cubic = [number, number, number];
type Elt = [number, number, number];

function mulMod(F: SmallField, f: Cubic, u: Elt, w: Elt): Elt {
  // Schoolbook product of degree ≤ 4, then fold x⁴ and x³ down with f.
  const r = [0, 0, 0, 0, 0];
  for (let i = 0; i < 3; i++) {
    if (u[i] === 0) continue;
    for (let j = 0; j < 3; j++) r[i + j] = F.add(r[i + j], F.mul(u[i], w[j]));
  }
  const [a, b, c] = f;
  for (let d = 4; d >= 3; d--) {
    const t = r[d];
    if (t === 0) continue;
    r[d] = 0;
    r[d - 1] = F.add(r[d - 1], F.mul(t, a));
    r[d - 2] = F.add(r[d - 2], F.mul(t, b));
    r[d - 3] = F.add(r[d - 3], F.mul(t, c));
  }
  return [r[0], r[1], r[2]];
}

function powX(F: SmallField, f: Cubic, n: number): Elt {
  let result: Elt = [1, 0, 0];
  let base: Elt = [0, 1, 0];
  while (n > 0) {
    if (n % 2 === 1) result = mulMod(F, f, result, base);
    base = mulMod(F, f, base, base);
    n = Math.floor(n / 2);
  }
  return result;
}

const isOne = (u: Elt) => u[0] === 1 && u[1] === 0 && u[2] === 0;

/**
 * The first cubic x³ = a x² + b x + c over GF(q) whose root x has order
 * q³ − 1, so that it generates GF(q³). A unit of that order exists only when
 * GF(q)[x]/(f) is a field, so this also proves f irreducible.
 */
export function findPrimitiveCubic(F: SmallField): Cubic {
  const order = F.q ** 3 - 1;
  const factors = primeFactors(order);
  const smallFactors = primeFactors(F.q - 1);
  const powF = (x: number, n: number): number => {
    let r = 1 % F.p;
    for (; n > 0; n = Math.floor(n / 2), x = F.mul(x, x)) if (n % 2 === 1) r = F.mul(r, x);
    return r;
  };
  for (let c = 1; c < F.q; c++) {
    // c is the product of the three roots α · α^q · α^(q²) = α^(q² + q + 1),
    // which generates GF(q)*; skip every c that doesn't.
    if (!smallFactors.every((r) => powF(c, (F.q - 1) / r) !== 1)) continue;
    for (let b = 0; b < F.q; b++) {
      for (let a = 0; a < F.q; a++) {
        const f: Cubic = [a, b, c];
        if (!isOne(powX(F, f, order))) continue;
        if (factors.every((r) => !isOne(powX(F, f, order / r)))) return f;
      }
    }
  }
  throw new Error(`No primitive cubic over GF(${F.q})`);
}

/**
 * A Singer (q² + q + 1, q + 1, 1) difference set, computed as in `singerSet`
 * (the indices i with Tr(α^i) = 0) but fast enough for q near 1000.
 *
 * For f = x³ − a x² − b x − c with roots α, α^q, α^(q²), the trace of
 * c₀ + c₁α + c₂α² is 3c₀ + a c₁ + (a² + 2b) c₂, because the roots add up to a
 * and their squares add up to a² + 2b.
 */
export function singerSetFast(q: number): number[] {
  const F = smallField(q);
  const f = findPrimitiveCubic(F);
  const [a, b, c] = f;
  const three = F.add(F.add(1 % F.p, 1 % F.p), 1 % F.p);
  const t0 = three;
  const t1 = a;
  const t2 = F.add(F.mul(a, a), F.add(b, b));
  const v = singerV(q);
  const set: number[] = [];
  let c0 = 1;
  let c1 = 0;
  let c2 = 0;
  for (let i = 0; i < v; i++) {
    if (F.add(F.add(F.mul(t0, c0), F.mul(t1, c1)), F.mul(t2, c2)) === 0) set.push(i);
    // Multiply by α: x³ = a x² + b x + c.
    const n0 = F.mul(c, c2);
    const n1 = F.add(c0, F.mul(b, c2));
    const n2 = F.add(c1, F.mul(a, c2));
    c0 = n0;
    c1 = n1;
    c2 = n2;
  }
  return set;
}
