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
