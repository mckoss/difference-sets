import { describe, expect, it } from 'vitest';
import {
  checksThrough,
  codeBasis,
  codeParams,
  encode,
  incidenceMatrix,
  isCodeword,
  lines,
  majorityDecode,
  minimumDistance,
  rankGF2,
  votes,
} from '../../src/math/codes';
import { differenceSetLambda } from '../../src/math/difference';
import { mulberry32, randomInt } from '../../src/math/random';
import { singerSet, singerV } from '../../src/math/singer';

/** Every set of at most `max` positions out of 0 … v − 1. */
function* errorPatterns(v: number, max: number, start = 0, chosen: number[] = []): Generator<number[]> {
  yield chosen;
  if (chosen.length === max) return;
  for (let i = start; i < v; i++) yield* errorPatterns(v, max, i + 1, [...chosen, i]);
}

describe('GF(2) rank', () => {
  it('handles small matrices', () => {
    expect(rankGF2([[1, 1], [1, 1]], 2)).toBe(1);
    expect(rankGF2([[1, 0, 1], [0, 1, 1], [1, 1, 0]], 3)).toBe(2);
    expect(rankGF2([[1, 0], [0, 1]], 2)).toBe(2);
  });
});

describe('difference-set cyclic codes', () => {
  it('q = 2 gives the (7, 3) code with distance 4, fixing 1 error', () => {
    const D = singerSet(2);
    expect(codeParams(D, 7)).toEqual({ length: 7, parityBits: 4, messageBits: 3, checksPerBit: 3, corrects: 1 });
    expect(minimumDistance(codeBasis(D, 7))).toBe(4);
  });

  it('q = 4 gives the (21, 11) code with distance 6, fixing 2 errors', () => {
    const D = [0, 1, 4, 14, 16];
    expect(differenceSetLambda(D, 21)).toBe(1);
    expect(codeParams(singerSet(4), 21)).toEqual(codeParams(D, 21));
    expect(codeParams(D, 21)).toEqual({ length: 21, parityBits: 10, messageBits: 11, checksPerBit: 5, corrects: 2 });
    expect(minimumDistance(codeBasis(D, 21))).toBe(6);
  });

  it('q = 2^s has 3^s + 1 parity bits: (73, 45) and the (273, 191) code', () => {
    expect(codeParams(singerSet(8), 73)).toMatchObject({ parityBits: 28, messageBits: 45, corrects: 4 });
    const big = codeParams(singerSet(16), singerV(16));
    expect(big).toMatchObject({ length: 273, parityBits: 82, messageBits: 191, checksPerBit: 17, corrects: 8 });
  });

  it('basis words are codewords, and rotating a codeword gives a codeword', () => {
    const D = singerSet(4);
    const basis = codeBasis(D, 21);
    expect(basis).toHaveLength(11);
    expect(rankGF2(basis, 21)).toBe(11);
    for (const w of basis) {
      expect(isCodeword(w, D, 21)).toBe(true);
      expect(isCodeword([...w.slice(1), w[0]], D, 21)).toBe(true);
    }
    expect(incidenceMatrix(D, 21)[0].filter(Boolean)).toHaveLength(5);
  });

  it('the checks through a bit contain it and share no other bit', () => {
    for (const q of [2, 4]) {
      const D = singerSet(q);
      const v = singerV(q);
      const ls = lines(D, v);
      for (let j = 0; j < v; j++) {
        const through = checksThrough(j, D, v);
        expect(through).toHaveLength(q + 1);
        const seen = new Map<number, number>();
        for (const t of through) {
          expect(ls[t]).toContain(j);
          for (const x of ls[t]) seen.set(x, (seen.get(x) ?? 0) + 1);
        }
        for (const [x, count] of seen) expect(count).toBe(x === j ? q + 1 : 1);
      }
    }
  });

  for (const q of [2, 4]) {
    it(`q = ${q}: majority voting fixes every pattern of up to ${Math.floor((q + 1) / 2)} errors`, () => {
      const D = singerSet(q);
      const v = singerV(q);
      const basis = codeBasis(D, v);
      const { corrects } = codeParams(D, v);
      const rng = mulberry32(7);
      for (let trial = 0; trial < 6; trial++) {
        const sent = encode(
          basis.map(() => randomInt(rng, 2)),
          basis,
        );
        expect(isCodeword(sent, D, v)).toBe(true);
        for (const errs of errorPatterns(v, corrects)) {
          const received = [...sent];
          for (const i of errs) received[i] ^= 1;
          const { word, flipped } = majorityDecode(received, D, v);
          expect(word).toEqual(sent);
          expect([...flipped].sort((a, b) => a - b)).toEqual(errs);
        }
      }
    });
  }

  it('q = 4: some patterns of 3 errors fool the vote', () => {
    const D = singerSet(4);
    const sent = new Array<number>(21).fill(0);
    let fooled = 0;
    for (const errs of errorPatterns(21, 3)) {
      if (errs.length !== 3) continue;
      const received = [...sent];
      for (const i of errs) received[i] ^= 1;
      if (majorityDecode(received, D, 21).word.some((b, i) => b !== sent[i])) fooled++;
    }
    expect(fooled).toBeGreaterThan(0);
  });

  it('a single error makes all of its checks fail', () => {
    const D = singerSet(4);
    const w = new Array<number>(21).fill(0);
    w[5] = 1;
    const vs = votes(w, D, 21);
    expect(vs[5]).toMatchObject({ failing: 5, flip: true });
    expect(vs.filter((_, j) => j !== 5).every((b) => b.failing <= 1 && !b.flip)).toBe(true);
  });
});
