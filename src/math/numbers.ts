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
