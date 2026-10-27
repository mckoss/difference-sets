// Which orders n can a projective plane, or a cyclic one, have? The tests
// behind Lesson 17's table, each tied to a theorem in docs/citations.md.

import { primePower } from './numbers';

/** [a, b] with a² + b² = n and 0 ≤ a ≤ b, or null when n is not a sum of two squares. */
export function sumOfTwoSquares(n: number): [number, number] | null {
  for (let a = 0; 2 * a * a <= n; a++) {
    const b = Math.round(Math.sqrt(n - a * a));
    if (a * a + b * b === n) return [a, b];
  }
  return null;
}

/** The prime factorization of n as [prime, exponent] pairs, smallest prime first. */
export function factorize(n: number): [number, number][] {
  const out: [number, number][] = [];
  for (let d = 2; d * d <= n; d++) {
    if (n % d !== 0) continue;
    let e = 0;
    while (n % d === 0) {
      n /= d;
      e++;
    }
    out.push([d, e]);
  }
  if (n > 1) out.push([n, 1]);
  return out;
}

export interface BruckRyserReport {
  n: number;
  /** n mod 4. The theorem says something only when this is 1 or 2. */
  residue: number;
  applies: boolean;
  /** A way of writing n as a sum of two squares, when there is one. */
  squares: [number, number] | null;
  /** Primes p ≡ 3 (mod 4) that divide n an odd number of times; n is a sum of two squares exactly when there are none. */
  badPrimes: number[];
  /** True when the theorem rules out every projective plane of order n. */
  excluded: boolean;
}

/**
 * The Bruck–Ryser theorem (1949): if n ≡ 1 or 2 (mod 4) and a projective
 * plane of order n exists, then n is a sum of two squares.
 */
export function bruckRyser(n: number): BruckRyserReport {
  const residue = n % 4;
  const applies = residue === 1 || residue === 2;
  const squares = sumOfTwoSquares(n);
  const badPrimes = factorize(n)
    .filter(([p, e]) => p % 4 === 3 && e % 2 === 1)
    .map(([p]) => p);
  return { n, residue, applies, squares, badPrimes, excluded: applies && squares === null };
}

/** Divisors that no order of a planar abelian difference set can have (Gordon 1994, Corollary 1). */
export const EXCLUDED_DIVISORS = [6, 10, 14, 15, 21, 22, 26, 33, 34, 35, 38, 39, 46, 51, 55, 57, 58, 62, 65];

/** The exact power of p dividing n. */
function exponentOf(p: number, n: number): number {
  let e = 0;
  while (n % p === 0) {
    n /= p;
    e++;
  }
  return e;
}

export type CyclicStatus = 'singer' | 'bruck-ryser' | 'theorem' | 'computer' | 'open';

/** Every order up to this bound that is not a prime power has been ruled out for cyclic planes by computer (Gordon 2022). */
export const COMPUTER_BOUND = 2e10;

export interface CyclicReport {
  n: number;
  status: CyclicStatus;
  /** One sentence giving the reason, naming the theorem. */
  reason: string;
}

/**
 * Why a cyclic projective plane of order n (that is, a planar difference
 * set) does or does not exist, giving the first reason that applies:
 *
 * - n is a prime power: Singer's construction gives one;
 * - Bruck–Ryser rules out every plane of order n;
 * - a theorem about planar difference sets rules out order n: Wilbrink
 *   (1985), Jungnickel–Vedder (1984), or Gordon's (1994) excluded divisors;
 * - otherwise computer searches rule it out: every order up to 2·10⁹ that is
 *   not a prime power is excluded for cyclic planes (Baumert–Gordon 2004),
 *   and up to 2·10¹⁰ for all abelian groups (Gordon 2022);
 * - beyond that, it is open.
 */
export function cyclicStatus(n: number): CyclicReport {
  if (primePower(n)) {
    return { n, status: 'singer', reason: `${n} is a prime power, so Singer's construction gives a cyclic plane.` };
  }
  const br = bruckRyser(n);
  if (br.excluded) {
    return {
      n,
      status: 'bruck-ryser',
      reason: `${n} ≡ ${br.residue} (mod 4) and is not a sum of two squares, so by Bruck–Ryser no plane of order ${n} exists at all.`,
    };
  }
  for (const p of [2, 3]) {
    if (exponentOf(p, n) === 1) {
      return {
        n,
        status: 'theorem',
        reason: `${p} divides ${n} exactly once, and Wilbrink (1985) showed that then the order must be ${p} itself.`,
      };
    }
  }
  if (n % 2 === 0 && n % 8 !== 0) {
    return {
      n,
      status: 'theorem',
      reason: `${n} is even but not a multiple of 8, which Jungnickel and Vedder (1984) ruled out for orders above 4.`,
    };
  }
  const d = EXCLUDED_DIVISORS.find((x) => n % x === 0);
  if (d !== undefined) {
    return {
      n,
      status: 'theorem',
      reason: `${n} is a multiple of ${d}, one of the divisors Gordon (1994) lists as impossible for planar difference sets.`,
    };
  }
  if (n > COMPUTER_BOUND) {
    return {
      n,
      status: 'open',
      reason: `None of these theorems rules out ${n}, and it is beyond the computer searches, which reach 2·10¹⁰. Open.`,
    };
  }
  return {
    n,
    status: 'computer',
    reason: `No theorem listed here rules out ${n}, but computer searches have ruled out every order up to 2·10¹⁰ that is not a prime power (Baumert and Gordon 2004; Gordon 2022).`,
  };
}

export type PlaneStatus = 'exists' | 'bruck-ryser' | 'computer' | 'open';

export interface PlaneReport {
  n: number;
  status: PlaneStatus;
  reason: string;
}

/** What is known about projective planes of order n with no symmetry required. */
export function planeStatus(n: number): PlaneReport {
  if (primePower(n)) {
    return { n, status: 'exists', reason: `${n} is a prime power, so the plane built from the field with ${n} elements exists.` };
  }
  const br = bruckRyser(n);
  if (br.excluded) {
    return {
      n,
      status: 'bruck-ryser',
      reason: `${n} ≡ ${br.residue} (mod 4) and is not a sum of two squares, so Bruck–Ryser rules it out.`,
    };
  }
  if (n === 10) {
    return {
      n,
      status: 'computer',
      reason: '10 = 1² + 3² passes Bruck–Ryser, but a computer search by Lam, Thiel, and Swiercz (1989) showed there is no plane of order 10.',
    };
  }
  return { n, status: 'open', reason: `Open: no plane of order ${n} is known, and none has been ruled out.` };
}
