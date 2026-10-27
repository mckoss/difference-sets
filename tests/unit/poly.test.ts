import { describe, expect, it } from 'vitest';
import { polyAdd, polyMod, polyMul, polyMulMod, polyPowMod } from '../../src/math/poly';

describe('GF(p) polynomials', () => {
  it('adds and trims leading zeros', () => {
    expect(polyAdd([1, 2, 1], [2, 1, 2], 3)).toEqual([0]);
    expect(polyAdd([1, 1], [0, 1, 1], 2)).toEqual([1, 0, 1]);
  });

  it('multiplies', () => {
    // (x + 1)² = x² + 1 over GF(2).
    expect(polyMul([1, 1], [1, 1], 2)).toEqual([1, 0, 1]);
    // (x + 1)(x + 2) = x² + 2 over GF(3).
    expect(polyMul([1, 1], [2, 1], 3)).toEqual([2, 0, 1]);
  });

  it('reduces modulo a monic polynomial', () => {
    // x³ ≡ x + 1 mod x³ + x + 1 over GF(2).
    expect(polyMod([0, 0, 0, 1], [1, 1, 0, 1], 2)).toEqual([1, 1]);
    expect(polyMod([2, 1], [1, 1, 0, 1], 3)).toEqual([2, 1]);
    expect(polyMod([1, 0, 0, 1], [1, 0, 0, 1], 5)).toEqual([0]);
  });

  it('raises to powers in GF(8)', () => {
    const P = [1, 1, 0, 1];
    expect(polyPowMod([0, 1], 7, P, 2)).toEqual([1]);
    expect(polyPowMod([0, 1], 3, P, 2)).toEqual([1, 1]);
    expect(polyPowMod([0, 1], 0, P, 2)).toEqual([1]);
    expect(polyMulMod([0, 0, 1], [0, 0, 1], P, 2)).toEqual(polyPowMod([0, 1], 4, P, 2));
  });

  it('has x of full order 26 in GF(27) for a primitive cubic', () => {
    // x³ + 2x + 1 is primitive over GF(3).
    const P = [1, 2, 0, 1];
    const powers = new Set<string>();
    for (let i = 0; i < 26; i++) powers.add(polyPowMod([0, 1], i, P, 3).join());
    expect(powers.size).toBe(26);
  });
});
