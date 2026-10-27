import { describe, expect, it } from 'vitest';
import {
  allTranslates,
  differenceCounts,
  differenceReport,
  intersection,
  normalizeSet,
  pairsWithDifference,
  translate,
  translateIntersections,
} from '../../src/math/difference';
import { cyclicPlane, linesThrough, meet, projectivePlaneOrder } from '../../src/math/cyclicPlane';
import { allDifferenceSets, binomial, planarParams, SubsetSearch } from '../../src/math/search';
import { singerSet, singerV } from '../../src/math/singer';
import { formatCount, formatDuration, setText } from '../../src/widgets/format';

describe('set helpers', () => {
  it('normalizes and translates', () => {
    expect(normalizeSet([3, 7, 1, 8, -1], 7)).toEqual([0, 1, 3, 6]);
    expect(translate([0, 1, 3], 4, 7)).toEqual([0, 4, 5]);
    expect(allTranslates([0, 1, 3], 7)).toHaveLength(7);
    expect(intersection([0, 1, 3], [1, 2, 4])).toEqual([1]);
  });

  it('lists the pairs behind each difference', () => {
    expect(pairsWithDifference([0, 1, 3], 2, 7)).toEqual([[3, 1]]);
    expect(pairsWithDifference([0, 1, 2], 1, 7)).toEqual([
      [1, 0],
      [2, 1],
    ]);
  });
});

describe('translates', () => {
  it('meet in exactly λ points for a difference set', () => {
    for (const [set, v, lambda] of [
      [[0, 1, 3], 7, 1],
      [[0, 1, 3, 9], 13, 1],
      [[1, 3, 4, 5, 9], 11, 2],
    ] as const) {
      const m = translateIntersections(set, v);
      m.forEach((row, i) => row.forEach((x, j) => expect(x).toBe(i === j ? set.length : lambda)));
    }
  });

  it('meet in as many points as the difference occurs, for any set', () => {
    const set = [0, 1, 2, 5];
    const v = 11;
    const counts = differenceCounts(set, v);
    const m = translateIntersections(set, v);
    for (let i = 0; i < v; i++) for (let j = 0; j < v; j++) if (i !== j) expect(m[i][j]).toBe(counts[(j - i + v) % v]);
  });
});

describe('differenceReport', () => {
  it('confirms a planar set', () => {
    const r = differenceReport([9, 0, 3, 1], 13);
    expect(r).toMatchObject({ set: [0, 1, 3, 9], k: 4, lambda: 1, target: 1, tooFew: [], tooMany: [] });
  });

  it('names missing and repeated differences', () => {
    const r = differenceReport([0, 1, 2], 7);
    expect(r.lambda).toBeNull();
    expect(r.target).toBe(1);
    expect(r.tooFew).toEqual([3, 4]);
    expect(r.tooMany).toEqual([1, 6]);
  });

  it('has no target when k(k − 1) does not divide evenly', () => {
    const r = differenceReport([0, 1], 7);
    expect(r.target).toBeNull();
    expect(r.tooFew).toEqual([2, 3, 4, 5]);
    expect(r.tooMany).toEqual([]);
  });

  it('handles tiny sets', () => {
    expect(differenceReport([], 7)).toMatchObject({ k: 0, lambda: null, target: 0 });
    expect(differenceReport([4], 7).lambda).toBeNull();
  });
});

describe('cyclic planes', () => {
  it('the Fano plane is {0, 1, 3} + j mod 7', () => {
    const fano = cyclicPlane([0, 1, 3], 7);
    expect(fano.lines[0]).toEqual([0, 1, 3]);
    expect(fano.lines[6]).toEqual([0, 2, 6]);
    expect(linesThrough(fano, 2, 6)).toEqual([6]);
    expect(meet(fano, 0, 1)).toEqual([1]);
    expect(projectivePlaneOrder(fano)).toBe(2);
  });

  it('every Singer set up to q = 5 gives a projective plane of order q', () => {
    for (const q of [2, 3, 4, 5]) expect(projectivePlaneOrder(cyclicPlane(singerSet(q), singerV(q)))).toBe(q);
  });

  it('a non-difference set does not', () => {
    expect(projectivePlaneOrder(cyclicPlane([0, 1, 2], 7))).toBeNull();
    expect(projectivePlaneOrder(cyclicPlane([0, 1, 2, 4], 13))).toBeNull();
  });
});

describe('brute-force search', () => {
  it('computes binomial coefficients exactly', () => {
    expect(binomial(7, 3)).toBe(35n);
    expect(binomial(13, 4)).toBe(715n);
    expect(binomial(5, 0)).toBe(1n);
    expect(binomial(5, 6)).toBe(0n);
    expect(binomial(111, 11)).toBe(473239787751081n);
  });

  it('gives planar parameters', () => {
    expect(planarParams(3)).toEqual({ n: 3, v: 13, k: 4 });
  });

  it('finds {0, 1, 3} first and every planar set for v = 7, 13, 21', () => {
    expect(allDifferenceSets(7, 3)[0]).toEqual([0, 1, 3]);
    // v · φ(v) / 3e planar sets for q = p^e (multiplier group of order 3e).
    expect(allDifferenceSets(7, 3)).toHaveLength(14);
    expect(allDifferenceSets(13, 4)).toHaveLength(52);
    expect(allDifferenceSets(21, 5)).toHaveLength(42);
  });

  it('searches in slices and counts every subset', () => {
    const s = new SubsetSearch(13, 4);
    s.run(100);
    expect(s.checked).toBe(100);
    expect(s.done).toBe(false);
    while (!s.done) s.run(100);
    expect(BigInt(s.checked)).toBe(s.total);
  });

  it('finds the (11, 5, 2) sets', () => {
    expect(allDifferenceSets(11, 5)).toContainEqual([1, 3, 4, 5, 9]);
  });
});

describe('formatting', () => {
  it('formats counts', () => {
    expect(formatCount(35n)).toBe('35');
    expect(formatCount(736281n)).toBe('736,281');
    expect(formatCount(473239787751081n)).toBe('4.73 × 10¹⁴');
  });

  it('formats durations at a billion checks per second', () => {
    expect(formatDuration(35n)).toBe('under a millisecond');
    expect(formatDuration(5_000_000n)).toBe('5 milliseconds');
    expect(formatDuration(473239787751081n)).toBe('5 days');
    expect(formatDuration(10n ** 30n)).toMatch(/^2,296 × the age of the universe$/);
    expect(formatDuration(439n * 10n ** 24n)).toBe('about the age of the universe');
  });

  it('formats sets', () => {
    expect(setText([0, 1, 3])).toBe('{0, 1, 3}');
  });
});

describe('clock arithmetic', () => {
  it('wraps any integer onto 0 … v − 1', async () => {
    const { divMod, clockDifference } = await import('../../src/math/clock');
    expect(divMod(10, 7)).toEqual({ q: 1, r: 3 });
    expect(divMod(-1, 7)).toEqual({ q: -1, r: 6 });
    expect(divMod(-14, 7)).toEqual({ q: -2, r: 0 });
    expect(divMod(5, 7)).toEqual({ q: 0, r: 5 });
    expect(clockDifference(0, 3, 7)).toBe(4);
    expect(clockDifference(3, 0, 7)).toBe(3);
  });
});
