import { describe, expect, it } from 'vitest';
import { differenceCounts, differenceSetLambda, isDifferenceSet } from '../../src/math/difference';

describe('difference sets', () => {
  it('recognizes small Singer sets', () => {
    expect(differenceSetLambda([0, 1, 3], 7)).toBe(1);
    expect(differenceSetLambda([0, 1, 3, 9], 13)).toBe(1);
    expect(differenceSetLambda([0, 1, 4, 14, 16], 21)).toBe(1);
  });

  it('recognizes a λ = 2 set', () => {
    // Quadratic residues mod 11: a (11, 5, 2) Paley difference set.
    expect(differenceSetLambda([1, 3, 4, 5, 9], 11)).toBe(2);
  });

  it('rejects non-difference sets and duplicates', () => {
    expect(isDifferenceSet([0, 1, 2], 7)).toBe(false);
    expect(isDifferenceSet([0, 7, 1, 3], 7)).toBe(false);
  });

  it('counts differences', () => {
    expect(differenceCounts([0, 1, 3], 7)).toEqual([0, 1, 1, 1, 1, 1, 1]);
  });
});
