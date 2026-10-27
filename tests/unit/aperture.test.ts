import { describe, expect, it } from 'vitest';
import {
  argmax,
  bitsToPlusMinus,
  correlate2D,
  crtIndex,
  decodeImage,
  detectorImage,
  foldSet,
  randomMask,
  randomPlusMinus,
  received,
  skyFrom,
} from '../../src/math/aperture';
import { autocorrelation, correlation, plusMinus } from '../../src/math/sequences';
import { mulberry32 } from '../../src/math/random';
import { mSequence, singerParams, singerSetPG } from '../../src/math/singerPG';

describe('folded masks', () => {
  const cases: [number, number, number][] = [
    [7, 9, 5], // 63 = 2^6 − 1, PG(5, 2)
    [15, 17, 7], // 255 = 2^8 − 1, PG(7, 2)
    [3, 5, 3], // 15 = 2^4 − 1, PG(3, 2)
  ];
  for (const [rows, cols, m] of cases) {
    const { k, lambda } = singerParams(2, m);
    const mask = foldSet(singerSetPG(2, m), rows, cols);

    it(`${rows} × ${cols}: k holes, two-level 2-D autocorrelation (k at 0, λ elsewhere)`, () => {
      expect(mask.open.reduce((s, x) => s + x, 0)).toBe(k);
      const a = correlate2D(mask.open, mask.open, rows, cols);
      expect(a[0]).toBe(k);
      expect(new Set(a.slice(1))).toEqual(new Set([lambda]));
    });

    it(`${rows} × ${cols}: a single source decodes to one peak on a perfectly flat floor`, () => {
      const sky = skyFrom([{ r: 2, c: 3, b: 1 }], rows, cols);
      const out = decodeImage(mask, detectorImage(mask, sky));
      out.forEach((x, i) => expect(x).toBeCloseTo(sky[i], 10));
    });
  }

  it('decodes several sources of different brightness exactly', () => {
    const mask = foldSet(singerSetPG(2, 7), 15, 17);
    const sky = skyFrom(
      [
        { r: 0, c: 0, b: 1 },
        { r: 7, c: 11, b: 0.7 },
        { r: 14, c: 2, b: 0.45 },
      ],
      15,
      17,
    );
    const out = decodeImage(mask, detectorImage(mask, sky));
    out.forEach((x, i) => expect(x).toBeCloseTo(sky[i], 10));
  });

  it('a random mask with the same number of holes leaves ghosts', () => {
    const mask = randomMask(15, 17, 127, mulberry32(1));
    expect(mask.open.reduce((s, x) => s + x, 0)).toBe(127);
    const sky = skyFrom([{ r: 4, c: 4, b: 1 }], 15, 17);
    const out = decodeImage(mask, detectorImage(mask, sky));
    const ghost = Math.max(...out.map((x, i) => (sky[i] ? 0 : Math.abs(x))));
    expect(ghost).toBeGreaterThan(0.05);
  });

  it('crtIndex inverts the fold', () => {
    for (let i = 0; i < 63; i++) expect(crtIndex(i % 7, i % 9, 7, 9)).toBe(i);
    expect(() => foldSet([0], 4, 6)).toThrow();
  });
});

describe('echoes', () => {
  it('m-sequence ±1 codes have autocorrelation v at 0 and −1 elsewhere', () => {
    for (const n of [3, 4, 5, 6, 7]) {
      const code = bitsToPlusMinus(mSequence(n).bits);
      expect(code).toEqual(plusMinus(singerSetPG(2, n - 1), 2 ** n - 1));
      const c = autocorrelation(code);
      expect(c[0]).toBe(2 ** n - 1);
      expect(new Set(c.slice(1))).toEqual(new Set([-1]));
    }
  });

  it('correlating a delayed copy finds the delay, even in noise', () => {
    const code = bitsToPlusMinus(mSequence(7).bits);
    const rng = mulberry32(42);
    for (const delay of [0, 5, 77, 126]) {
      expect(argmax(correlation(code, received(code, delay, 0, rng)))).toBe(delay);
      expect(argmax(correlation(code, received(code, delay, 1, rng)))).toBe(delay);
    }
  });

  it('a random ±1 code has bumpy side-lobes', () => {
    const c = autocorrelation(randomPlusMinus(63, mulberry32(3)));
    expect(c[0]).toBe(63);
    expect(new Set(c.slice(1)).size).toBeGreaterThan(2);
  });
});
