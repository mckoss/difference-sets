import { describe, expect, it } from 'vitest';
import {
  euclidSteps,
  factorPoly,
  findIsomorphism,
  firstPrimitivePoly,
  irreducibleCount,
  irreduciblePolys,
  isIrreducible,
  isIsomorphism,
  isPermutation,
  isPrimitivePoly,
  monicPolys,
  parsePoly,
  parsePolyText,
  divisionSteps,
  PolyRing,
  polyKind,
  primitiveCount,
  primitivePolys,
  znAddTable,
  znInverse,
  znIsField,
  znMulTable,
  znZeroDivisors,
} from '../../src/math/field';
import { extendedGcd, isPrime, mobius, modInverse } from '../../src/math/numbers';
import { polyDivMod, polyExtGcd, polyFormat, polyMul, polyMulMod } from '../../src/math/poly';
import { findPrimitivePoly } from '../../src/math/singer';

describe('numbers', () => {
  it('runs the extended Euclidean algorithm', () => {
    const { g, s, t } = extendedGcd(5, 13);
    expect(g).toBe(1);
    expect(5 * s + 13 * t).toBe(1);
    expect(modInverse(5, 13)).toBe(8);
    expect(modInverse(2, 6)).toBeNull();
  });

  it('computes the Möbius function', () => {
    expect([1, 2, 3, 4, 5, 6, 12, 30].map(mobius)).toEqual([1, -1, -1, 0, -1, 1, 0, -1]);
  });

  it('tests primality', () => {
    expect([1, 2, 3, 4, 9, 11, 91].map(isPrime)).toEqual([false, true, true, false, false, true, false]);
  });
});

describe('ℤ/nℤ', () => {
  it('builds tables', () => {
    expect(znAddTable(3)).toEqual([
      [0, 1, 2],
      [1, 2, 0],
      [2, 0, 1],
    ]);
    expect(znMulTable(4)[2]).toEqual([0, 2, 0, 2]);
  });

  it('finds zero divisors exactly for composite n', () => {
    expect(znZeroDivisors(6)).toEqual([2, 3, 4]);
    expect(znZeroDivisors(7)).toEqual([]);
    for (let n = 2; n <= 40; n++) expect(znZeroDivisors(n).length === 0).toBe(znIsField(n));
  });

  it('has inverses and permutation rows exactly for prime n', () => {
    for (let n = 2; n <= 30; n++) {
      const table = znMulTable(n);
      for (let a = 1; a < n; a++) {
        const inv = znInverse(a, n);
        expect(isPermutation(table[a])).toBe(inv !== null);
        if (inv !== null) expect((a * inv) % n).toBe(1);
      }
      expect(table.slice(1).every(isPermutation)).toBe(isPrime(n));
    }
    expect(znInverse(5, 13)).toBe(8);
    expect(znInverse(2, 6)).toBeNull();
  });

  it('records Euclid steps', () => {
    expect(euclidSteps(5, 13)).toEqual([
      { a: 13, b: 5, q: 2, r: 3 },
      { a: 5, b: 3, q: 1, r: 2 },
      { a: 3, b: 2, q: 1, r: 1 },
      { a: 2, b: 1, q: 2, r: 0 },
    ]);
  });
});

describe('polynomials over GF(p)', () => {
  it('divides with remainder', () => {
    // x³ + x + 1 = (x + 1)(x² + x) + 1 over GF(2)
    const { q, r } = polyDivMod([1, 1, 0, 1], [1, 1], 2);
    expect(q).toEqual([0, 1, 1]);
    expect(r).toEqual([1]);
    // Non-monic divisor over GF(3): (x² + 1) ÷ (2x + 1)
    const d = polyDivMod([1, 0, 1], [1, 2], 3);
    expect(polyMul(d.q, [1, 2], 3).map((c, i) => (c + (d.r[i] ?? 0)) % 3)).toEqual([1, 0, 1]);
  });

  it('finds Bézout coefficients', () => {
    const f = [1, 1, 0, 1];
    const a = [0, 1, 1];
    const { g, s } = polyExtGcd(a, f, 2);
    expect(g).toEqual([1]);
    expect(polyMulMod(s, a, f, 2)).toEqual([1]);
  });

  it('formats polynomials highest degree first', () => {
    expect(polyFormat([1, 1, 0, 1])).toBe('x³ + x + 1');
    expect(polyFormat([2, 0, 1], 'y', true)).toBe('y²+2');
    expect(polyFormat([0])).toBe('0');
  });

  it('tests irreducibility', () => {
    expect(isIrreducible([1, 1, 1], 2)).toBe(true); // x² + x + 1
    expect(isIrreducible([1, 0, 1], 2)).toBe(false); // (x + 1)²
    expect(isIrreducible([1, 0, 1], 3)).toBe(true); // x² + 1 mod 3
    expect(isIrreducible([1, 0, 1], 5)).toBe(false); // 2² = −1 mod 5
    expect(isIrreducible([1, 1, 0, 0, 1], 2)).toBe(true); // x⁴ + x + 1
    expect(isIrreducible([1, 1, 1, 1, 1], 2)).toBe(true); // x⁴ + x³ + x² + x + 1
    expect(isIrreducible([1, 0, 1, 0, 1], 2)).toBe(false); // (x² + x + 1)²
  });

  it('factors reducible polynomials', () => {
    expect(factorPoly([1, 0, 1], 2)).toEqual([
      [1, 1],
      [1, 1],
    ]);
    expect(factorPoly([1, 0, 1, 0, 1], 2)).toEqual([
      [1, 1, 1],
      [1, 1, 1],
    ]);
    expect(factorPoly([1, 1, 0, 1], 2)).toEqual([[1, 1, 0, 1]]);
  });

  it('counts irreducibles by the necklace formula', () => {
    for (const [p, maxK] of [
      [2, 8],
      [3, 5],
      [5, 3],
      [7, 3],
    ]) {
      for (let k = 1; k <= maxK; k++) expect(irreduciblePolys(p, k)).toHaveLength(irreducibleCount(p, k));
    }
    expect([1, 2, 3, 4, 5, 6].map((k) => irreducibleCount(2, k))).toEqual([2, 1, 2, 3, 6, 9]);
  });

  it('counts primitive polynomials as φ(p^k − 1)/k', () => {
    for (const [p, maxK] of [
      [2, 8],
      [3, 4],
      [5, 3],
      [7, 2],
    ]) {
      for (let k = 1; k <= maxK; k++) expect(primitivePolys(p, k)).toHaveLength(primitiveCount(p, k));
    }
  });

  it('recognizes known primitive polynomials', () => {
    expect(isPrimitivePoly([1, 1, 0, 1], 2)).toBe(true); // x³ + x + 1
    expect(isPrimitivePoly([1, 0, 1, 1], 2)).toBe(true); // x³ + x² + 1
    expect(isPrimitivePoly([1, 1, 0, 0, 1], 2)).toBe(true); // x⁴ + x + 1
    expect(isPrimitivePoly([1, 1, 1, 1, 1], 2)).toBe(false); // x has order 5
    expect(isPrimitivePoly([1, 0, 1], 3)).toBe(false); // x has order 4 in GF(9)
    expect(isPrimitivePoly([2, 1, 1], 3)).toBe(true); // x² + x + 2
    expect(isPrimitivePoly([1, 0, 0, 0, 1, 1, 1, 0, 1], 2)).toBe(true); // x⁸ + x⁴ + x³ + x² + 1
    expect(polyKind([1, 1, 1, 1, 1], 2)).toBe('irreducible');
    expect(polyKind([1, 0, 1], 2)).toBe('reducible');
  });

  it('agrees with the Singer construction on its first primitive polynomial', () => {
    for (const [p, k] of [
      [2, 3],
      [3, 3],
      [2, 6],
      [5, 3],
    ]) {
      expect(firstPrimitivePoly(p, k)).toEqual(findPrimitivePoly(p, k));
    }
  });

  it('lists monic polynomials', () => {
    expect(monicPolys(2, 2)).toEqual([
      [0, 0, 1],
      [1, 0, 1],
      [0, 1, 1],
      [1, 1, 1],
    ]);
  });

  it('parses URL polynomials', () => {
    expect(parsePoly('1,1,0,1')).toEqual([1, 1, 0, 1]);
    expect(parsePoly('x')).toBeNull();
    expect(parsePoly('1')).toBeNull();
    expect(parsePoly(null)).toBeNull();
  });
});

const SMALL_FIELDS: [number, number[]][] = [
  [2, [1, 1]], // GF(2)
  [5, [3, 1]], // GF(5) as x + 3
  [2, [1, 1, 1]], // GF(4)
  [2, [1, 1, 0, 1]], // GF(8)
  [3, [1, 0, 1]], // GF(9)
  [2, [1, 1, 0, 0, 1]], // GF(16)
  [5, [2, 1, 1]], // GF(25)
];

describe('GF(p^k) as polynomials mod f', () => {
  it('numbers elements by their base-p digits', () => {
    const F = new PolyRing(2, [1, 1, 0, 1]);
    expect(F.size).toBe(8);
    expect(F.x).toBe(2);
    expect(F.poly(5)).toEqual([1, 0, 1]);
    expect(F.label(5)).toBe('x²+1');
    expect(F.label(5, 'digits')).toBe('101');
    expect(F.index([0, 0, 0, 1])).toBe(3); // x³ = x + 1
  });

  it.each(SMALL_FIELDS)('GF(%i) mod %j satisfies the field axioms', (p, f) => {
    const F = new PolyRing(p, f);
    expect(F.isField).toBe(true);
    const els = F.elements();
    for (const a of els) {
      expect(F.add(a, 0)).toBe(a);
      expect(F.mul(a, F.one)).toBe(a);
      expect(F.add(a, F.neg(a))).toBe(0);
      if (a !== 0) expect(F.mul(a, F.inv(a)!)).toBe(F.one);
      for (const b of els) {
        expect(F.add(a, b)).toBe(F.add(b, a));
        expect(F.mul(a, b)).toBe(F.mul(b, a));
        if (a !== 0 && b !== 0) expect(F.mul(a, b)).not.toBe(0);
        for (const c of els.slice(0, 9)) {
          expect(F.add(F.add(a, b), c)).toBe(F.add(a, F.add(b, c)));
          expect(F.mul(F.mul(a, b), c)).toBe(F.mul(a, F.mul(b, c)));
          expect(F.mul(a, F.add(b, c))).toBe(F.add(F.mul(a, b), F.mul(a, c)));
        }
      }
    }
    expect(F.zeroDivisors()).toEqual([]);
    expect(F.mulTable().slice(1).every((row) => isPermutation(row.slice(1).map((x) => x - 1)))).toBe(true);
  });

  it('has zero divisors modulo a reducible polynomial', () => {
    const R = new PolyRing(2, [1, 0, 1]); // x² + 1 = (x + 1)²
    expect(R.isField).toBe(false);
    const xp1 = R.index([1, 1]);
    expect(R.mul(xp1, xp1)).toBe(0);
    expect(R.zeroDivisors()).toEqual([xp1]);
    expect(R.inv(xp1)).toBeNull();
    expect(R.order(xp1)).toBeNull();
  });

  it('shows GF(4) is not ℤ/4ℤ', () => {
    const F = new PolyRing(2, [1, 1, 1]);
    expect(F.add(F.one, F.one)).toBe(0);
    expect((1 + 1) % 4).not.toBe(0);
  });

  it('computes orders, primitivity, and log tables', () => {
    const F = new PolyRing(2, [1, 1, 1, 1, 1]); // x⁴ + x³ + x² + x + 1
    expect(F.order(F.x)).toBe(5);
    expect(F.isPrimitive(F.x)).toBe(false);
    const primitive = F.elements().filter((a) => F.isPrimitive(a));
    expect(primitive).toHaveLength(8); // φ(15)
    for (const a of F.elements().slice(1)) expect(F.isPrimitive(a)).toBe(F.order(a) === 15);

    const G = new PolyRing(2, [1, 1, 0, 1]);
    expect(G.powers(G.x)).toHaveLength(7);
    const logs = G.logTable(G.x);
    expect(logs[0]).toBe(-1);
    expect([...logs.slice(1)].sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4, 5, 6]);
    for (const a of G.elements().slice(1)) {
      for (const b of G.elements().slice(1)) expect(logs[G.mul(a, b)]).toBe((logs[a] + logs[b]) % 7);
    }
  });

  it('every nonzero order divides p^k − 1', () => {
    for (const [p, f] of SMALL_FIELDS) {
      const F = new PolyRing(p, f);
      for (const a of F.elements().slice(1)) expect((F.size - 1) % F.order(a)!).toBe(0);
    }
  });

  it('Frobenius is additive and multiplicative, and fixes exactly the prime field', () => {
    for (const [p, f] of SMALL_FIELDS) {
      const F = new PolyRing(p, f);
      for (const a of F.elements()) {
        for (const b of F.elements()) {
          expect(F.frobenius(F.add(a, b))).toBe(F.add(F.frobenius(a), F.frobenius(b)));
          expect(F.frobenius(F.mul(a, b))).toBe(F.mul(F.frobenius(a), F.frobenius(b)));
        }
        expect(F.frobenius(a, F.k)).toBe(a);
      }
      const fixed = F.elements().filter((a) => F.frobenius(a) === a);
      expect(fixed).toEqual(Array.from({ length: p }, (_, c) => F.constant(c)).sort((a, b) => a - b));
    }
  });

  it('finds GF(q) inside GF(q³) as {0} ∪ ⟨α^(q² + q + 1)⟩', () => {
    for (const [p, e] of [
      [2, 1],
      [3, 1],
      [2, 2],
      [5, 1],
    ]) {
      const q = p ** e;
      const F = new PolyRing(p, firstPrimitivePoly(p, 3 * e));
      const alpha = F.x;
      const v = q * q + q + 1;
      const fixed = F.elements().filter((a) => F.frobenius(a, e) === a);
      const sub = [0, ...Array.from({ length: q - 1 }, (_, i) => F.pow(alpha, i * v))];
      expect(fixed).toEqual(sub.sort((a, b) => a - b));
    }
  });

  it('finds isomorphisms between moduli of the same degree', () => {
    for (const [p, k] of [
      [2, 3],
      [3, 2],
      [2, 4],
      [5, 2],
    ]) {
      const irr = irreduciblePolys(p, k);
      const F = new PolyRing(p, irr[0]);
      for (const g of irr.slice(1)) {
        const G = new PolyRing(p, g);
        expect(G.roots(F.modulus)).toHaveLength(k);
        for (let choice = 0; choice < k; choice++) {
          const map = findIsomorphism(F, G, choice)!;
          expect(isIsomorphism(F, G, map)).toBe(true);
        }
      }
    }
  });

  it('rejects non-isomorphisms', () => {
    const F = new PolyRing(2, [1, 1, 0, 1]);
    const G = new PolyRing(2, [1, 0, 1, 1]);
    expect(isIsomorphism(F, G, F.elements())).toBe(false);
    expect(findIsomorphism(F, new PolyRing(2, [1, 0, 1]))).toBeNull();
  });

  it('rejects bad moduli', () => {
    expect(() => new PolyRing(4, [1, 1, 1])).toThrow();
    expect(() => new PolyRing(2, [1, 1, 0])).toThrow();
    expect(() => new PolyRing(3, [1, 2])).toThrow();
  });
});

describe('reader input and long division', () => {
  it('parses typed polynomials', () => {
    expect(parsePolyText('x^4 + x + 1', 2)).toEqual([1, 1, 0, 0, 1]);
    expect(parsePolyText('x⁴+x+1', 2)).toEqual([1, 1, 0, 0, 1]);
    expect(parsePolyText('2x^2 - 1', 3)).toEqual([2, 0, 2]);
    expect(parsePolyText('x + x', 2)).toEqual([0]);
    expect(parsePolyText('x3+1', 2)).toEqual([1, 0, 0, 1]);
    expect(parsePolyText('7', 5)).toEqual([2]);
    expect(parsePolyText('x^', 2)).toBeNull();
    expect(parsePolyText('y + 1', 2)).toBeNull();
    expect(parsePolyText('', 2)).toBeNull();
    expect(parsePolyText('x++1', 2)).toBeNull();
  });

  it('divides step by step', () => {
    // x⁴ ÷ (x³ + x + 1) over GF(2): quotient x, remainder x² + x
    const steps = divisionSteps([0, 0, 0, 0, 1], [1, 1, 0, 1], 2);
    expect(steps).toHaveLength(1);
    expect(steps[0].term).toEqual([0, 1]);
    expect(steps[0].subtracted).toEqual([0, 1, 1, 0, 1]);
    expect(steps[0].remainder).toEqual([0, 1, 1]);
    for (const [a, b, p] of [
      [[1, 2, 0, 1, 2], [2, 1], 3],
      [[1, 1, 1, 1, 1, 1, 1], [1, 0, 1, 1], 2],
      [[3, 0, 4, 1], [1, 1, 1], 5],
    ] as [number[], number[], number][]) {
      const s = divisionSteps(a, b, p);
      const { r } = polyDivMod(a, b, p);
      expect(s.length ? s[s.length - 1].remainder : a).toEqual(r);
    }
  });
});
