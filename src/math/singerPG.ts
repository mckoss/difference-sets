// Singer difference sets in every dimension: the hyperplanes of PG(m, q).
//
// GF(q^(m+1)) is built from a primitive polynomial of degree (m + 1)e over
// GF(p), q = p^e, with α = x. The v = (q^(m+1) − 1)/(q − 1) points of PG(m, q)
// are the classes of α^i, i mod v, and the trace-zero hyperplane
// {x : x + x^q + … + x^(q^m) = 0} gives the difference set
// D = {i mod v : Tr(α^i) = 0}. For m = 2 this is `singerSet` in singer.ts.

import { primePower } from './numbers';
import { type Poly, polyAdd, polyIsZero, polyMulMod, polyPowMod } from './poly';
import { findPrimitivePoly } from './singer';

const X: Poly = [0, 1];

export interface SingerParams {
  q: number;
  m: number;
  v: number;
  k: number;
  lambda: number;
}

/** v = (q^(m+1) − 1)/(q − 1), k = (q^m − 1)/(q − 1), λ = (q^(m−1) − 1)/(q − 1). */
export function singerParams(q: number, m: number): SingerParams {
  const s = (j: number) => (q ** j - 1) / (q - 1);
  return { q, m, v: s(m + 1), k: s(m), lambda: s(m - 1) };
}

/**
 * The trace Tr(α^i) for i = 0 … count − 1, each as a polynomial over GF(p)
 * (it always lies in GF(q)). For q = p prime it is a single digit.
 */
function traces(q: number, m: number, count: number): { traces: Poly[]; poly: Poly; p: number } {
  const pe = primePower(q);
  if (!pe) throw new Error(`${q} is not a prime power`);
  if (m < 1) throw new Error(`Dimension m must be at least 1, not ${m}`);
  const [p, e] = pe;
  const P = findPrimitivePoly(p, (m + 1) * e);
  const steps: Poly[] = [X];
  for (let j = 1; j <= m; j++) steps.push(polyPowMod(steps[j - 1], q, P, p));
  const cur: Poly[] = steps.map(() => [1]);
  const out: Poly[] = [];
  for (let i = 0; i < count; i++) {
    let tr: Poly = [];
    for (const c of cur) tr = polyAdd(tr, c, p);
    out.push(tr);
    for (let j = 0; j <= m; j++) cur[j] = polyMulMod(cur[j], steps[j], P, p);
  }
  return { traces: out, poly: P, p };
}

/** The Singer difference set of PG(m, q): indices i mod v with Tr(α^i) = 0. */
export function singerSetPG(q: number, m: number): number[] {
  const { v } = singerParams(q, m);
  return traces(q, m, v)
    .traces.map((t, i) => (polyIsZero(t) ? i : -1))
    .filter((i) => i >= 0);
}

/**
 * The binary m-sequence of period 2^n − 1, s_i = Tr(α^i) in GF(2), with the
 * primitive polynomial it comes from (coefficients low degree first). Its
 * zeros are the Singer set of PG(n − 1, 2).
 */
export function mSequence(n: number): { bits: number[]; poly: Poly } {
  const { traces: t, poly } = traces(2, n - 1, 2 ** n - 1);
  return { bits: t.map((x) => (polyIsZero(x) ? 0 : 1)), poly };
}

/**
 * Run the shift register for a monic polynomial f = x^n + c_(n−1)x^(n−1) + … + c₀
 * over GF(2): s_(i+n) = c₀s_i + c₁s_(i+1) + … + c_(n−1)s_(i+n−1).
 */
export function lfsr(poly: Poly, seed: readonly number[], length: number): number[] {
  const n = poly.length - 1;
  const s = [...seed.slice(0, n)];
  while (s.length < length) {
    const i = s.length - n;
    let bit = 0;
    for (let j = 0; j < n; j++) bit ^= (poly[j] & s[i + j]) as number;
    s.push(bit);
  }
  return s.slice(0, length);
}
