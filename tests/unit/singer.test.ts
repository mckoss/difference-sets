import { describe, expect, it } from 'vitest';
import { differenceSetLambda } from '../../src/math/difference';
import { primePower, primePowersUpTo } from '../../src/math/numbers';
import { findPrimitivePoly, nonIsomorphicSingerSets, normalizeSet, singerSet, singerV } from '../../src/math/singer';

// Expected output copied from the "Non-isomorphic Singer Sets" notebook.
const NOTEBOOK_CLASSES: Record<number, number[][]> = {
  2: [[0, 1, 3]],
  3: [
    [0, 1, 3, 9],
    [0, 1, 4, 6],
  ],
  4: [[0, 1, 4, 14, 16]],
  5: [
    [0, 1, 3, 8, 12, 18],
    [0, 1, 3, 10, 14, 26],
    [0, 1, 4, 6, 13, 21],
    [0, 1, 4, 10, 12, 17],
    [0, 1, 8, 11, 13, 17],
  ],
  7: [
    [0, 1, 3, 13, 32, 36, 43, 52],
    [0, 1, 4, 9, 20, 22, 34, 51],
    [0, 1, 4, 12, 14, 30, 37, 52],
    [0, 1, 5, 7, 17, 35, 38, 49],
    [0, 1, 5, 27, 34, 37, 43, 45],
    [0, 1, 7, 19, 23, 44, 47, 49],
  ],
  8: [
    [0, 1, 3, 7, 15, 31, 36, 54, 63],
    [0, 1, 5, 12, 18, 21, 49, 51, 59],
    [0, 1, 7, 11, 35, 48, 51, 53, 65],
    [0, 1, 12, 20, 26, 30, 33, 35, 57],
  ],
  9: [
    [0, 1, 3, 9, 27, 49, 56, 61, 77, 81],
    [0, 1, 4, 13, 24, 30, 38, 40, 45, 73],
    [0, 1, 5, 7, 27, 35, 44, 67, 77, 80],
    [0, 1, 5, 8, 18, 20, 29, 43, 59, 65],
    [0, 1, 6, 10, 23, 26, 34, 41, 53, 55],
    [0, 1, 7, 16, 27, 56, 60, 68, 70, 73],
  ],
};

const NOTEBOOK_COUNTS: Record<number, number> = { 11: 18, 13: 20, 16: 6, 17: 51 };

describe('number helpers', () => {
  it('detects prime powers', () => {
    expect(primePower(16)).toEqual([2, 4]);
    expect(primePower(27)).toEqual([3, 3]);
    expect(primePower(12)).toBeNull();
    expect(primePowersUpTo(16)).toEqual([2, 3, 4, 5, 7, 8, 9, 11, 13, 16]);
  });
});

describe('Singer construction', () => {
  it('finds primitive polynomials', () => {
    expect(findPrimitivePoly(2, 3)).toEqual([1, 1, 0, 1]); // x³ + x + 1
  });

  it.each(primePowersUpTo(32))('builds a planar difference set for q = %i', (q) => {
    const ds = singerSet(q);
    expect(ds).toHaveLength(q + 1);
    expect(differenceSetLambda(ds, singerV(q))).toBe(1);
  });

  it('normalizes under translation and negation', () => {
    expect(normalizeSet([2, 3, 5], 7)).toEqual([0, 1, 3]);
    expect(normalizeSet([0, 6, 4], 7)).toEqual([0, 1, 3]);
  });

  it.each(Object.keys(NOTEBOOK_CLASSES).map(Number))('matches the notebook classes for q = %i', (q) => {
    expect(nonIsomorphicSingerSets(q)).toEqual(NOTEBOOK_CLASSES[q]);
  });

  it.each(Object.entries(NOTEBOOK_COUNTS))('matches the notebook class count for q = %s', (q, count) => {
    expect(nonIsomorphicSingerSets(Number(q))).toHaveLength(count);
  });
});
