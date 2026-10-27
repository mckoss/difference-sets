// Polynomials over GF(p) as coefficient arrays, lowest degree first, with
// trailing zeros trimmed (the zero polynomial is [0]).

export type Poly = number[];

function trim(a: Poly): Poly {
  while (a.length > 1 && a[a.length - 1] === 0) a.pop();
  return a.length === 0 ? [0] : a;
}

export function polyAdd(a: Poly, b: Poly, p: number): Poly {
  const n = Math.max(a.length, b.length);
  const res = new Array<number>(n);
  for (let i = 0; i < n; i++) res[i] = ((a[i] ?? 0) + (b[i] ?? 0)) % p;
  return trim(res);
}

export function polyMul(a: Poly, b: Poly, p: number): Poly {
  const res = new Array<number>(a.length + b.length - 1).fill(0);
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) res[i + j] = (res[i + j] + a[i] * b[j]) % p;
  }
  return trim(res);
}

/** a mod m, where m is monic. */
export function polyMod(a: Poly, m: Poly, p: number): Poly {
  const r = a.slice();
  while (r.length >= m.length) {
    const coef = r[r.length - 1];
    if (coef !== 0) {
      const shift = r.length - m.length;
      for (let i = 0; i < m.length; i++) r[i + shift] = (((r[i + shift] - coef * m[i]) % p) + p) % p;
    }
    r.pop();
  }
  return trim(r);
}

export function polyMulMod(a: Poly, b: Poly, m: Poly, p: number): Poly {
  return polyMod(polyMul(a, b, p), m, p);
}

/** a^k mod m. */
export function polyPowMod(a: Poly, k: number, m: Poly, p: number): Poly {
  let res: Poly = [1];
  let base = polyMod(a, m, p);
  while (k > 0) {
    if (k % 2 === 1) res = polyMulMod(res, base, m, p);
    base = polyMulMod(base, base, m, p);
    k = Math.floor(k / 2);
  }
  return res;
}

export function polyIsOne(a: Poly): boolean {
  return a.length === 1 && a[0] === 1;
}

export function polyIsZero(a: Poly): boolean {
  return a.length === 1 && a[0] === 0;
}

/** Degree of a, with −1 for the zero polynomial. */
export function polyDeg(a: Poly): number {
  return polyIsZero(a) ? -1 : a.length - 1;
}

export function polySub(a: Poly, b: Poly, p: number): Poly {
  return polyAdd(a, polyScale(b, p - 1, p), p);
}

export function polyScale(a: Poly, c: number, p: number): Poly {
  return trim(a.map((x) => (((x * c) % p) + p) % p));
}

function inverseModPrime(c: number, p: number): number {
  for (let i = 1; i < p; i++) if ((c * i) % p === 1) return i;
  throw new Error(`${c} has no inverse mod ${p}`);
}

/** Quotient and remainder of a ÷ b over GF(p), p prime, b ≠ 0. */
export function polyDivMod(a: Poly, b: Poly, p: number): { q: Poly; r: Poly } {
  if (polyIsZero(b)) throw new Error('Division by the zero polynomial');
  const db = b.length - 1;
  const lead = inverseModPrime(b[db], p);
  const r = a.slice();
  const q = new Array<number>(Math.max(1, a.length - db)).fill(0);
  for (let i = r.length - 1; i >= db; i--) {
    const c = (r[i] * lead) % p;
    if (c === 0) continue;
    q[i - db] = c;
    for (let j = 0; j <= db; j++) r[i - db + j] = (((r[i - db + j] - c * b[j]) % p) + p) % p;
  }
  return { q: trim(q), r: trim(r.slice(0, Math.max(1, db))) };
}

/**
 * Extended Euclid for polynomials over GF(p): g = gcd(a, b), made monic, with
 * s·a + t·b = g.
 */
export function polyExtGcd(a: Poly, b: Poly, p: number): { g: Poly; s: Poly; t: Poly } {
  let [r0, r1] = [trim(a.slice()), trim(b.slice())];
  let [s0, s1]: Poly[] = [[1], [0]];
  let [t0, t1]: Poly[] = [[0], [1]];
  while (!polyIsZero(r1)) {
    const { q, r } = polyDivMod(r0, r1, p);
    [r0, r1] = [r1, r];
    [s0, s1] = [s1, polySub(s0, polyMul(q, s1, p), p)];
    [t0, t1] = [t1, polySub(t0, polyMul(q, t1, p), p)];
  }
  if (polyIsZero(r0)) return { g: [0], s: s0, t: t0 };
  const c = inverseModPrime(r0[r0.length - 1], p);
  return { g: polyScale(r0, c, p), s: polyScale(s0, c, p), t: polyScale(t0, c, p) };
}

const SUPERSCRIPT = '⁰¹²³⁴⁵⁶⁷⁸⁹';

export function superscript(n: number): string {
  return String(n)
    .split('')
    .map((d) => SUPERSCRIPT[Number(d)])
    .join('');
}

/**
 * Human-readable polynomial, highest degree first: "x³ + x + 1", or
 * "x³+x+1" when compact.
 */
export function polyFormat(a: Poly, variable = 'x', compact = false): string {
  const terms: string[] = [];
  for (let i = a.length - 1; i >= 0; i--) {
    const c = a[i];
    if (c === 0) continue;
    const coef = c === 1 && i > 0 ? '' : String(c);
    const pow = i === 0 ? '' : i === 1 ? variable : variable + superscript(i);
    terms.push(coef + pow);
  }
  return terms.length === 0 ? '0' : terms.join(compact ? '+' : ' + ');
}
