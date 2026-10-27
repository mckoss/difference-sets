import { describe, expect, it } from 'vitest';
import {
  conjugates,
  multiplierClasses,
  multipliers,
  multiplySet,
  powersMod,
  reducedSet,
  singerMultiplierCount,
  traceLine,
  traceOfPower,
  traceSet,
  traceSteps,
  traceSum,
  translateOffset,
  units,
} from '../../src/math/construction';
import { differenceSetLambda } from '../../src/math/difference';
import { primePower, primePowersUpTo, totient } from '../../src/math/numbers';
import { addVec, lineIndex, scale, singerFrame, singerLine, trace } from '../../src/math/projective';
import { nonIsomorphicSingerSets, normalizeSet, singerSet, singerV } from '../../src/math/singer';

const SMALL_Q = [2, 3, 4, 5, 7, 8, 9, 11, 13];

describe('the trace', () => {
  it.each(SMALL_Q)('adds the three conjugates into GF(q) and matches the shortcut formula for q = %i', (q) => {
    const S = singerFrame(q);
    for (let i = 0; i < q ** 3 - 1; i++) {
      const sum = traceSum(S, i);
      expect(sum[1]).toBe(0);
      expect(sum[2]).toBe(0);
      expect(sum[0]).toBe(trace(S, S.powers[i]));
    }
  });

  it.each(SMALL_Q)('is GF(q)-linear for q = %i', (q) => {
    const S = singerFrame(q);
    const { F } = S;
    const N = q ** 3 - 1;
    const tr = (u: [number, number, number]) => trace(S, u);
    for (let i = 0; i < Math.min(N, 60); i++) {
      for (let j = 0; j < Math.min(N, 60); j += 7) {
        const u = S.powers[i];
        const w = S.powers[j];
        expect(tr(addVec(F, u, w))).toBe(F.add(tr(u), tr(w)));
        for (const s of F.elements) expect(tr(scale(F, s, u))).toBe(F.mul(s, tr(u)));
      }
    }
  });

  it.each(SMALL_Q)('vanishes on exactly q² elements, a plane through the origin, for q = %i', (q) => {
    const S = singerFrame(q);
    const zeros = S.powers.filter((u) => trace(S, u) === 0).length + 1; // plus 0 itself
    expect(zeros).toBe(q * q);
  });

  it('computes the conjugates of α for q = 2 by hand', () => {
    const S = singerFrame(2);
    // α, α², α⁴ = α² + α
    expect(conjugates(S, 1)).toEqual([
      [0, 1, 0],
      [0, 0, 1],
      [0, 1, 1],
    ]);
    expect([0, 1, 2, 3, 4, 5, 6].map((i) => traceOfPower(S, i))).toEqual([1, 0, 0, 1, 0, 1, 1]);
  });

  it('cuts out the lines x = 0 for q = 2, z = 0 for q = 3, and x + y + z = 0 for q = 4', () => {
    expect(traceLine(singerFrame(2))).toEqual([1, 0, 0]);
    expect(traceLine(singerFrame(3))).toEqual([0, 0, 2]);
    expect(traceLine(singerFrame(4))).toEqual([1, 1, 1]);
  });
});

describe('the trace construction', () => {
  it.each(SMALL_Q)('gives a planar difference set for q = %i', (q) => {
    const D = traceSet(q);
    expect(D).toHaveLength(q + 1);
    expect(differenceSetLambda(D, singerV(q))).toBe(1);
    expect(traceSteps(q)).toHaveLength(singerV(q));
  });

  it.each(SMALL_Q)('is the trace line of the plane, a translate of the line z = 0, for q = %i', (q) => {
    const S = singerFrame(q);
    const D = traceSet(q);
    expect(D).toEqual(singerLine(S, lineIndex(S.P, traceLine(S))));
    expect(translateOffset(singerLine(S, lineIndex(S.P, [0, 0, 1])), D, S.v)).not.toBeNull();
  });

  it('agrees with singerSet exactly for prime q, where both use the same cubic', () => {
    for (const q of [2, 3, 5, 7, 11, 13]) expect(traceSet(q)).toEqual(singerSet(q));
  });

  it('explains {1, 2, 4} mod 7: it is {0, 1, 3} + 1', () => {
    expect(traceSet(2)).toEqual([1, 2, 4]);
    expect(translateOffset([0, 1, 3], traceSet(2), 7)).toBe(1);
    expect(traceSet(3)).toEqual([0, 1, 3, 9]);
    expect(translateOffset([0, 1, 4, 14, 16], traceSet(4), 21)).toBe(14);
  });

  it('relates singerSet(4), built from a degree-6 polynomial over GF(2), by negation', () => {
    expect(singerSet(4)).toEqual(multiplySet(traceSet(4), -1, 21));
  });
});

describe('multipliers', () => {
  it('multiplies and finds translates', () => {
    expect(multiplySet([0, 1, 3], 2, 7)).toEqual([0, 2, 6]);
    expect(translateOffset([0, 1, 3], [0, 2, 6], 7)).toBe(6);
    expect(translateOffset([0, 1, 3], [0, 4, 6], 7)).toBeNull();
    expect(reducedSet([2, 3, 5], 7)).toEqual([0, 1, 3]);
    expect(reducedSet([0, 4, 6], 7)).toEqual([0, 1, 5]);
    expect(multiplySet([0, 1, 4, 14, 16], 3, 21)).toEqual([0, 3, 6, 12]);
    expect(units(21)).toHaveLength(totient(21));
    expect(powersMod(2, 21)).toEqual([1, 2, 4, 8, 16, 11]);
  });

  it.each(SMALL_Q)('t·D is a difference set for every t coprime to v, q = %i', (q) => {
    const v = singerV(q);
    const D = traceSet(q);
    for (const t of units(v)) expect(differenceSetLambda(multiplySet(D, t, v), v)).toBe(1);
  });

  it.each(SMALL_Q)('p fixes the trace set, and the multipliers are exactly the 3e powers of p, for q = %i', (q) => {
    const [p] = primePower(q)!;
    const v = singerV(q);
    const D = traceSet(q);
    expect(multiplySet(D, p, v)).toEqual(D);
    const powers = powersMod(p, v);
    expect(powers).toHaveLength(singerMultiplierCount(q));
    expect(multipliers(D, v)).toEqual([...powers].sort((a, b) => a - b));
    expect(multipliers(D, v)).not.toContain(v - 1);
  });

  it.each(primePowersUpTo(32))('groups the units into φ(v)/3e classes, paired into φ(v)/6e, for q = %i', (q) => {
    const v = singerV(q);
    const D = singerSet(q);
    const [p, e] = primePower(q)!;
    const classes = multiplierClasses(D, v);
    expect(classes).toHaveLength(totient(v) / (3 * e));
    const powers = powersMod(p, v);
    for (const c of classes) {
      expect(c.ts).toHaveLength(3 * e);
      // Each class is a coset t·{1, p, p², …}.
      expect(c.ts).toEqual(powers.map((x) => (x * c.ts[0]) % v).sort((a, b) => a - b));
      expect(c.mirror).not.toBe(classes.indexOf(c));
      expect(classes[c.mirror].mirror).toBe(classes.indexOf(c));
    }
    const upToNegation = new Set(classes.map((c) => normalizeSet(c.reduced, v).join(',')));
    expect(upToNegation.size).toBe(totient(v) / (6 * e));
    expect([...upToNegation].sort()).toEqual(nonIsomorphicSingerSets(q).map((s) => s.join(',')).sort());
  });

  it('counts 1, 2, 1, 5, 6, 4, 6, 18, 20 classes up to translation and negation (A058241)', () => {
    const counts = SMALL_Q.map((q) => multiplierClasses(traceSet(q), singerV(q)).length / 2);
    expect(counts).toEqual([1, 2, 1, 5, 6, 4, 6, 18, 20]);
  });
});
