export function gcd(a: number, b: number): number {
  while (b !== 0) [a, b] = [b, a % b];
  return Math.abs(a);
}

export function mod(a: number, n: number): number {
  return ((a % n) + n) % n;
}

/** Return [p, e] when n = p^e for a prime p, otherwise null. */
export function primePower(n: number): [number, number] | null {
  if (n < 2) return null;
  for (let d = 2; d * d <= n; d++) {
    if (n % d === 0) {
      let e = 0;
      while (n % d === 0) {
        n /= d;
        e++;
      }
      return n === 1 ? [d, e] : null;
    }
  }
  return [n, 1];
}

export function primeFactors(n: number): number[] {
  const factors: number[] = [];
  for (let d = 2; d * d <= n; d++) {
    if (n % d === 0) {
      factors.push(d);
      while (n % d === 0) n /= d;
    }
  }
  if (n > 1) factors.push(n);
  return factors;
}

export function primePowersUpTo(limit: number): number[] {
  const result: number[] = [];
  for (let n = 2; n <= limit; n++) if (primePower(n)) result.push(n);
  return result;
}

/** Euler's totient φ(n). */
export function totient(n: number): number {
  return primeFactors(n).reduce((acc, p) => (acc / p) * (p - 1), n);
}

export function isPrime(n: number): boolean {
  if (!Number.isInteger(n) || n < 2) return false;
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
  return true;
}

/** Extended Euclid: g = gcd(a, b) ≥ 0 and Bézout coefficients with s·a + t·b = g. */
export function extendedGcd(a: number, b: number): { g: number; s: number; t: number } {
  let [r0, r1] = [a, b];
  let [s0, s1] = [1, 0];
  let [t0, t1] = [0, 1];
  while (r1 !== 0) {
    const q = Math.floor(r0 / r1);
    [r0, r1] = [r1, r0 - q * r1];
    [s0, s1] = [s1, s0 - q * s1];
    [t0, t1] = [t1, t0 - q * t1];
  }
  return r0 < 0 ? { g: -r0, s: -s0, t: -t0 } : { g: r0, s: s0, t: t0 };
}

/** The inverse of a mod n, or null when gcd(a, n) ≠ 1. */
export function modInverse(a: number, n: number): number | null {
  const { g, s } = extendedGcd(mod(a, n), n);
  return g === 1 ? mod(s, n) : null;
}

/** Möbius function μ(n). */
export function mobius(n: number): number {
  let result = 1;
  for (let d = 2; d * d <= n; d++) {
    if (n % d === 0) {
      n /= d;
      if (n % d === 0) return 0;
      result = -result;
    }
  }
  return n > 1 ? -result : result;
}

export function divisors(n: number): number[] {
  const result: number[] = [];
  for (let d = 1; d <= n; d++) if (n % d === 0) result.push(d);
  return result;
}
