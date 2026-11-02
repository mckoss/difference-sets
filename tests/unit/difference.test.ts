import { describe, expect, it } from 'vitest';
import { differenceCounts, differenceSetLambda, isDifferenceSet, startAtZeroOne, translate } from '../../src/math/difference';
import { singerSet, singerV } from '../../src/math/singer';

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

describe('startAtZeroOne', () => {
  it('turns {1, 2, 4} mod 7 to {0, 1, 3}, with mirror {0, 1, 5}', () => {
    expect(startAtZeroOne([1, 2, 4], 7)).toEqual({
      b: 1,
      turned: [0, 1, 3],
      mirrored: [0, 1, 5],
      best: [0, 1, 3],
      mirrorWins: false,
    });
  });

  it('picks the mirror image when it is smaller', () => {
    const r = startAtZeroOne([0, 1, 5], 7)!;
    expect(r.mirrorWins).toBe(true);
    expect(r.best).toEqual([0, 1, 3]);
  });

  it('gives null unless the difference 1 occurs exactly once', () => {
    expect(startAtZeroOne([0, 2, 4], 7)).toBeNull();
  });

  for (const q of [2, 3, 4, 5, 7, 8]) {
    it(`q = ${q}: every turn and mirror image of D has the same canonical form`, () => {
      const v = singerV(q);
      const D = singerSet(q);
      const best = startAtZeroOne(D, v)!.best;
      expect(best.slice(0, 2)).toEqual([0, 1]);
      const mirror = D.map((d) => v - d);
      for (let j = 0; j < v; j += 1 + Math.floor(v / 9)) {
        expect(startAtZeroOne(translate(D, j, v), v)!.best).toEqual(best);
        expect(startAtZeroOne(translate(mirror, j, v), v)!.best).toEqual(best);
      }
    });
  }
});
