import { describe, expect, it } from 'vitest';
import { isDifferenceSet } from '../../src/math/difference';
import { characterPath, identityForm, productCoefficients } from '../../src/math/groupRing';
import { primePower, primePowersUpTo, totient } from '../../src/math/numbers';
import { planarVK, searchPlanar } from '../../src/math/planarSearch';
import {
  bruckRyser,
  cyclicStatus,
  EXCLUDED_DIVISORS,
  factorize,
  planeStatus,
  sumOfTwoSquares,
} from '../../src/math/planeOrders';
import { nonIsomorphicSingerSets, normalizeSet, singerSet, singerV } from '../../src/math/singer';
import { findPrimitiveCubic, singerSetFast, smallField } from '../../src/math/singerFast';

/** OEIS A058241, indexed by k = n + 1 from k = 1: planar sets up to translation and negation. */
const A058241 = [1, 1, 1, 2, 1, 5, 0, 6, 4, 6, 0, 18, 0, 20, 0, 0, 6, 51, 0, 42, 0, 0, 0];
const a058241 = (n: number) => A058241[n]; // k = n + 1 sits at index n

describe('planar search', () => {
  it('finds exactly the A058241 counts up to translation and negation, n = 2 … 10', { timeout: 60_000 }, () => {
    for (let n = 2; n <= 10; n++) {
      const { v, k } = planarVK(n);
      const { sets } = searchPlanar(n);
      for (const s of sets) {
        expect(s.length).toBe(k);
        expect(s.slice(0, 2)).toEqual([0, 1]);
        expect(isDifferenceSet(s, v)).toBe(true);
      }
      const classes = new Set(sets.map((s) => normalizeSet(s, v).join(',')));
      expect(classes.size, `order ${n}`).toBe(a058241(n));
    }
  });

  it('matches the spec values n = 2 → 1, 3 → 2, 4 → 1, 5 → 5, 6 → 0, 7 → 6, 8 → 4', () => {
    expect([2, 3, 4, 5, 6, 7, 8].map(a058241)).toEqual([1, 2, 1, 5, 0, 6, 4]);
  });

  it('finds φ(v)/3e reduced sets for prime powers (OEIS A335866), every one of Singer type', () => {
    for (const n of [2, 3, 4, 5, 7, 8, 9]) {
      const [, e] = primePower(n)!;
      const { v } = planarVK(n);
      const { sets } = searchPlanar(n);
      expect(sets.length).toBe(totient(v) / (3 * e));
      const singer = new Set(nonIsomorphicSingerSets(n).map((s) => s.join(',')));
      for (const s of sets) expect(singer.has(normalizeSet(s, v).join(','))).toBe(true);
    }
  });

  it('returns sets in lexicographic order and reports progress and finds', () => {
    const found: number[][] = [];
    const progress: number[] = [];
    const r = searchPlanar(7, { onFound: (s) => found.push(s), onProgress: (x) => progress.push(x), progressEvery: 1000 });
    expect(found).toEqual(r.sets);
    expect(r.sets.map((s) => s.join(','))).toEqual([...r.sets.map((s) => s.join(','))].sort((a, b) => {
      const x = a.split(',').map(Number);
      const y = b.split(',').map(Number);
      for (let i = 0; i < x.length; i++) if (x[i] !== y[i]) return x[i] - y[i];
      return 0;
    }));
    expect(progress.length).toBeGreaterThan(5);
    expect(r.nodes).toBeGreaterThan(progress[progress.length - 1]);
    expect(searchPlanar(2).sets).toEqual([
      [0, 1, 3],
      [0, 1, 5],
    ]);
  });
});

describe('fast Singer construction', () => {
  it('builds GF(q) with working tables', () => {
    for (const q of [4, 8, 9, 16, 25, 27]) {
      const F = smallField(q);
      for (let a = 0; a < q; a++) {
        expect(F.add(a, F.neg(a))).toBe(0);
        expect(F.mul(a, 1)).toBe(a);
        if (a) expect(new Set(Array.from({ length: q }, (_, b) => F.mul(a, b))).size).toBe(q);
        for (let b = 0; b < q; b++) {
          expect(F.add(a, b)).toBe(F.add(b, a));
          expect(F.mul(a, b)).toBe(F.mul(b, a));
        }
      }
      // Distributive on a sample.
      for (let a = 0; a < q; a += 3) for (let b = 0; b < q; b += 2) for (let c = 0; c < q; c++) {
        expect(F.mul(a, F.add(b, c))).toBe(F.add(F.mul(a, b), F.mul(a, c)));
      }
    }
  });

  it('finds primitive cubics', () => {
    expect(findPrimitiveCubic(smallField(2))).toEqual([1, 0, 1]); // x³ = x² + 1
  });

  it('gives a planar difference set equivalent to singerSet for every prime power up to 32', () => {
    for (const q of primePowersUpTo(32)) {
      const v = singerV(q);
      const D = singerSetFast(q);
      expect(D.length).toBe(q + 1);
      expect(isDifferenceSet(D, v)).toBe(true);
      const singer = new Set(nonIsomorphicSingerSets(q).map((s) => s.join(',')));
      expect(singer.has(normalizeSet(D, v).join(',')), `q = ${q}`).toBe(true);
    }
    expect(singerSet(7).length).toBe(8);
  }, 60_000);

  it('handles q near 1000 quickly', () => {
    for (const q of [997, 1024]) {
      const t = performance.now();
      const D = singerSetFast(q);
      expect(performance.now() - t).toBeLessThan(5000);
      expect(D.length).toBe(q + 1);
      const v = singerV(q);
      const seen = new Uint8Array(v);
      for (const a of D) for (const b of D) {
        if (a === b) continue;
        const d = (a - b + v) % v;
        expect(seen[d]).toBe(0);
        seen[d] = 1;
      }
    }
  });
});

describe('the polynomial identity', () => {
  it('works out D(x)·D(x⁻¹) for {0, 1, 3} mod 7', () => {
    expect(productCoefficients([0, 1, 3], 7)).toEqual([3, 1, 1, 1, 1, 1, 1]);
    expect(identityForm([0, 1, 3], 7)).toEqual({ m: 2, lambda: 1 });
    expect(identityForm([0, 1, 2, 4, 5, 8, 10], 15)).toEqual({ m: 4, lambda: 3 });
    expect(identityForm([0, 1, 2], 7)).toBeNull();
    expect(identityForm([0, 1, 2, 4], 7)).toEqual({ m: 2, lambda: 2 }); // the complement of {3, 5, 6}
  });

  it('gives arrows of total length √n at every turn', () => {
    for (const [set, v, n] of [
      [[0, 1, 3], 7, 2],
      [[0, 1, 3, 9], 13, 3],
      [[0, 1, 4, 14, 16], 21, 4],
    ] as [number[], number, number][]) {
      for (let j = 1; j < v; j++) expect(characterPath(set, v, j).length).toBeCloseTo(Math.sqrt(n), 9);
    }
    expect(characterPath([0, 1, 3], 7, 1).path).toHaveLength(4);
  });
});

describe('orders of planes', () => {
  it('writes numbers as sums of two squares', () => {
    expect(sumOfTwoSquares(10)).toEqual([1, 3]);
    expect(sumOfTwoSquares(45)).toEqual([3, 6]);
    expect(sumOfTwoSquares(21)).toBeNull();
    expect(factorize(360)).toEqual([
      [2, 3],
      [3, 2],
      [5, 1],
    ]);
  });

  it('Bruck–Ryser rules out exactly the orders listed in docs/citations.md below 80', () => {
    const out = Array.from({ length: 78 }, (_, i) => i + 2).filter((n) => bruckRyser(n).excluded);
    expect(out).toEqual([6, 14, 21, 22, 30, 33, 38, 42, 46, 54, 57, 62, 66, 69, 70, 77, 78]);
    for (const n of [10, 12, 15, 18, 20]) expect(bruckRyser(n).excluded).toBe(false);
    // The two forms of the test agree.
    for (let n = 2; n < 2000; n++) expect(sumOfTwoSquares(n) === null).toBe(bruckRyser(n).badPrimes.length > 0);
  });

  it('classifies cyclic orders up to 100', () => {
    const byStatus = (s: string) =>
      Array.from({ length: 99 }, (_, i) => i + 2).filter((n) => cyclicStatus(n).status === s);
    expect(byStatus('singer')).toEqual(primePowersUpTo(100));
    expect(byStatus('computer')).toEqual([85, 91, 95]);
    expect(byStatus('open')).toEqual([]);
    expect(cyclicStatus(10).status).toBe('theorem');
    expect(cyclicStatus(12).reason).toContain('Wilbrink');
    expect(cyclicStatus(40).reason).toContain('multiple of 10');
    expect(cyclicStatus(6).status).toBe('bruck-ryser');
    expect(EXCLUDED_DIVISORS).toHaveLength(19);
  });

  it('classifies general planes up to 100', () => {
    expect(planeStatus(10).status).toBe('computer');
    expect(planeStatus(12).status).toBe('open');
    expect(planeStatus(9).status).toBe('exists');
    expect(planeStatus(6).status).toBe('bruck-ryser');
  });
});
