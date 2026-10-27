import { describe, expect, it } from 'vitest';
import { differenceSetLambda } from '../../src/math/difference';
import { autocorrelation, correlation, indicator, plusMinus, plusMinusOffPeak } from '../../src/math/sequences';
import { singerSet } from '../../src/math/singer';
import { lfsr, mSequence, singerParams, singerSetPG } from '../../src/math/singerPG';

describe('higher-dimensional Singer sets', () => {
  const cases: [number, number][] = [
    [2, 2], [3, 2], [4, 2], [2, 3], [2, 4], [2, 5], [2, 6], [3, 3], [4, 3], [2, 9],
  ];
  for (const [q, m] of cases) {
    it(`PG(${m}, ${q}) gives a (v, k, λ) difference set`, () => {
      const { v, k, lambda } = singerParams(q, m);
      const D = singerSetPG(q, m);
      expect(D).toHaveLength(k);
      expect(differenceSetLambda(D, v)).toBe(lambda);
    });
  }

  it('has the stated parameters', () => {
    expect(singerParams(2, 2)).toMatchObject({ v: 7, k: 3, lambda: 1 });
    expect(singerParams(2, 3)).toMatchObject({ v: 15, k: 7, lambda: 3 });
    expect(singerParams(2, 5)).toMatchObject({ v: 63, k: 31, lambda: 15 });
    expect(singerParams(3, 3)).toMatchObject({ v: 40, k: 13, lambda: 4 });
  });

  it('matches singerSet in the plane', () => {
    for (const q of [2, 3, 4, 5, 7, 8, 9]) expect(singerSetPG(q, 2)).toEqual(singerSet(q));
  });
});

describe('m-sequences', () => {
  for (const n of [3, 4, 5, 6, 7]) {
    it(`length ${2 ** n - 1}: zeros are a Singer set and the shift register reproduces it`, () => {
      const { bits, poly } = mSequence(n);
      const zeros = bits.flatMap((b, i) => (b === 0 ? [i] : []));
      expect(zeros).toEqual(singerSetPG(2, n - 1));
      expect(lfsr(poly, bits.slice(0, n), bits.length)).toEqual(bits);
      // Every nonzero n-bit window appears once in a period.
      const windows = new Set(bits.map((_, i) => Array.from({ length: n }, (_, j) => bits[(i + j) % bits.length]).join('')));
      expect(windows.size).toBe(2 ** n - 1);
    });
  }
});

describe('autocorrelation of a difference set', () => {
  const sets: [number[], number][] = [
    [[0, 1, 3], 7],
    [[0, 1, 3, 9], 13],
    [[0, 1, 4, 14, 16], 21],
    [singerSet(5), 31],
    [singerSetPG(2, 3), 15],
    [singerSetPG(2, 5), 63],
    [singerSetPG(3, 3), 40],
  ];
  for (const [D, v] of sets) {
    const k = D.length;
    const lambda = differenceSetLambda(D, v)!;
    it(`(${v}, ${k}, ${lambda}): 0/1 gives k then λ; ±1 gives v then v − 4(k − λ)`, () => {
      const a = autocorrelation(indicator(D, v));
      expect(a[0]).toBe(k);
      expect(new Set(a.slice(1))).toEqual(new Set([lambda]));
      const s = autocorrelation(plusMinus(D, v));
      expect(s[0]).toBe(v);
      expect(new Set(s.slice(1))).toEqual(new Set([plusMinusOffPeak(v, k, lambda)]));
    });
  }

  it('gives the table values from the notes', () => {
    expect(plusMinusOffPeak(7, 3, 1)).toBe(-1);
    expect(plusMinusOffPeak(13, 4, 1)).toBe(1);
    expect(plusMinusOffPeak(21, 5, 1)).toBe(5);
    expect(plusMinusOffPeak(31, 6, 1)).toBe(11);
    expect(plusMinusOffPeak(15, 7, 3)).toBe(-1);
  });

  it('cross-correlation finds a shift', () => {
    const s = plusMinus([0, 1, 3], 7);
    const shifted = s.map((_, i) => s[(i + 3) % 7]);
    const c = correlation(shifted, s);
    expect(c.indexOf(Math.max(...c))).toBe(3);
  });
});
