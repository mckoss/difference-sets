// Clock arithmetic: wrapping any integer onto the v points 0 … v − 1.

/** Write n = q·v + r with 0 ≤ r < v (q rounds down, also for negative n). */
export function divMod(n: number, v: number): { q: number; r: number } {
  const q = Math.floor(n / v);
  return { q, r: n - q * v };
}

/** The forward distance around a v-hour clock from b to a: the residue of a − b. */
export function clockDifference(a: number, b: number, v: number): number {
  return divMod(a - b, v).r;
}
