// A set D mod v as the polynomial D(x) = Σ x^d, and the identity
// D(x) · D(x⁻¹) ≡ n + (1 + x + … + x^(v−1)) (mod x^v − 1) that Lesson 17 uses.

import { mod } from './numbers';

/**
 * Coefficients c₀ … c_(v−1) of D(x) · D(x⁻¹) reduced mod x^v − 1, where
 * x⁻¹ stands for x^(v−1). The term x^a · x^(−b) = x^(a−b), so c_d counts the
 * pairs (a, b) of members with a − b ≡ d (mod v), and c₀ = k.
 */
export function productCoefficients(set: readonly number[], v: number): number[] {
  const c = new Array<number>(v).fill(0);
  for (const a of set) for (const b of set) c[mod(a - b, v)]++;
  return c;
}

/**
 * When the product equals m + λ(1 + x + … + x^(v−1)) for whole numbers m and
 * λ ≥ 1, that is, when D is a (v, k, λ) difference set, returns { m, lambda }
 * with m = k − λ (the order n when λ = 1). Otherwise null.
 */
export function identityForm(set: readonly number[], v: number): { m: number; lambda: number } | null {
  const c = productCoefficients(set, v);
  const lambda = c[1] ?? 0;
  for (let d = 1; d < v; d++) if (c[d] !== lambda) return null;
  return lambda >= 1 ? { m: c[0] - lambda, lambda } : null;
}

/**
 * The arrows of D(ζ^j) for ζ a turn of 1/v: member d becomes an arrow of
 * length 1 at angle 2π·j·d/v. Returns the running sums (the head-to-tail
 * path, starting at the origin) and the length of the final sum.
 */
export function characterPath(set: readonly number[], v: number, j: number): { path: [number, number][]; length: number } {
  const path: [number, number][] = [[0, 0]];
  let x = 0;
  let y = 0;
  for (const d of set) {
    const angle = (2 * Math.PI * mod(j * d, v)) / v;
    x += Math.cos(angle);
    y += Math.sin(angle);
    path.push([x, y]);
  }
  return { path, length: Math.hypot(x, y) };
}
