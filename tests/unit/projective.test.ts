import { describe, expect, it } from 'vitest';
import { projectivePlaneOrder } from '../../src/math/cyclicPlane';
import { differenceSetLambda, translate } from '../../src/math/difference';
import {
  allVectors,
  alphaImageLine,
  alphaMatrix,
  canonicalVectors,
  cross,
  dot,
  formatPoint,
  gf,
  incident,
  isZero,
  joinLine,
  lineIndex,
  meetPoint,
  mulAlpha,
  normalize,
  pg2,
  planeThroughOrigin,
  pointIndex,
  scale,
  singerFrame,
  singerLine,
  span1,
  trace,
} from '../../src/math/projective';
import { nonIsomorphicSingerSets, normalizeSet, singerSet } from '../../src/math/singer';

const QS = [2, 3, 4, 5, 7, 8, 9];

describe('GF(q)', () => {
  it('is a field for each q', () => {
    for (const q of QS) {
      const F = gf(q);
      for (const a of F.elements) {
        expect(F.add(a, F.neg(a))).toBe(0);
        expect(F.mul(a, 1)).toBe(a);
        if (a !== 0) expect(F.mul(a, F.inv(a))).toBe(1);
      }
    }
  });

  it('labels GF(4) as 0, 1, ω, ω²', () => {
    const F = gf(4);
    expect(F.elements.map(F.label)).toEqual(['0', '1', 'ω', 'ω²']);
    expect(F.add(2, 3)).toBe(1); // ω + ω² = 1
    expect(gf(9).elements.map(gf(9).label)).toContain('ω⁷');
  });
});

describe('GF(q)³', () => {
  it('has q³ vectors, and each line through 0 has q − 1 nonzero ones', () => {
    for (const q of [2, 3, 4, 5]) {
      const F = gf(q);
      const all = allVectors(F);
      expect(all).toHaveLength(q ** 3);
      const seen = new Set<string>();
      for (const u of canonicalVectors(F)) {
        const line = span1(F, u).filter((w) => !isZero(w));
        expect(new Set(line.map(String)).size).toBe(q - 1);
        for (const w of line) {
          expect(seen.has(String(w))).toBe(false);
          seen.add(String(w));
          expect(normalize(F, w)).toEqual(u);
        }
      }
      // The lines through 0 split the q³ − 1 nonzero vectors with nothing left over.
      expect(seen.size).toBe(q ** 3 - 1);
    }
  });

  it('planes through 0 hold q² vectors and are closed under + and scaling', () => {
    for (const q of [2, 3, 4]) {
      const F = gf(q);
      for (const n of canonicalVectors(F)) {
        const plane = planeThroughOrigin(F, n);
        expect(plane).toHaveLength(q * q);
        const keys = new Set(plane.map(String));
        for (const a of plane) {
          for (const b of plane) expect(keys.has(String([0, 1, 2].map((i) => F.add(a[i], b[i]))))).toBe(true);
          for (const c of F.elements) expect(keys.has(String(scale(F, c, a)))).toBe(true);
        }
      }
    }
  });
});

describe('PG(2, q)', () => {
  it('has q² + q + 1 points and lines, q + 1 points on each line and lines through each point', () => {
    for (const q of QS) {
      const P = pg2(q);
      expect(P.v).toBe(q * q + q + 1);
      expect(P.lines).toHaveLength(P.v);
      for (const s of P.lineSets) expect(s).toHaveLength(q + 1);
      for (const s of P.pencils) expect(s).toHaveLength(q + 1);
    }
  });

  it('numbers points so that pointIndex inverts the list', () => {
    for (const q of QS) {
      const P = pg2(q);
      P.points.forEach((u, i) => {
        expect(pointIndex(P, u)).toBe(i);
        expect(pointIndex(P, scale(P.F, q - 1, u))).toBe(i);
      });
    }
  });

  it('puts every two points on exactly one line, found by the cross product', () => {
    for (const q of [2, 3, 4, 5, 7]) {
      const P = pg2(q);
      for (let a = 0; a < P.v; a++) {
        for (let b = a + 1; b < P.v; b++) {
          const through = P.lineSets.flatMap((s, j) => (s.includes(a) && s.includes(b) ? [j] : []));
          expect(through).toEqual([joinLine(P, a, b)]);
        }
      }
    }
  });

  it('makes every two lines meet in exactly one point', () => {
    for (const q of [2, 3, 4, 5]) {
      const P = pg2(q);
      for (let i = 0; i < P.v; i++) {
        for (let j = i + 1; j < P.v; j++) {
          const m = meetPoint(P, i, j);
          expect(incident(P, m, i) && incident(P, m, j)).toBe(true);
          expect(P.lineSets[i].filter((x) => P.lineSets[j].includes(x))).toEqual([m]);
        }
      }
    }
  });

  it('passes the projective plane axioms with order q', () => {
    for (const q of [2, 3, 4]) {
      const P = pg2(q);
      expect(projectivePlaneOrder({ v: P.v, lines: P.lineSets })).toBe(q);
    }
  });

  it('has incidence by dot product, and the cross product is orthogonal to both', () => {
    const P = pg2(3);
    const F = P.F;
    expect(formatPoint(F, P.points[0])).toBe('[1 : 0 : 0]');
    const z = lineIndex(P, [0, 0, 1]);
    expect(P.lineSets[z].map((i) => formatPoint(F, P.points[i]))).toEqual([
      '[1 : 0 : 0]',
      '[1 : 1 : 0]',
      '[1 : 2 : 0]',
      '[0 : 1 : 0]',
    ]);
    const n = cross(F, P.points[1], P.points[5]);
    expect(dot(F, n, P.points[1])).toBe(0);
    expect(dot(F, n, P.points[5])).toBe(0);
  });
});

describe('the Singer cycle', () => {
  it('gives every point exactly one number i mod v', () => {
    for (const q of QS) {
      const S = singerFrame(q);
      expect(S.powers).toHaveLength(q ** 3 - 1);
      expect(new Set(S.singerToPoint).size).toBe(S.v);
      // αⁱ and α^(i + v) differ by the scalar α^v in GF(q), so they name the same point.
      for (let i = 0; i < S.powers.length; i++) {
        expect(pointIndex(S.P, S.powers[i])).toBe(S.singerToPoint[i % S.v]);
      }
      const beta = S.powers[S.v % S.powers.length]; // α^v, in GF(q)
      expect(beta[1]).toBe(0);
      expect(beta[2]).toBe(0);
    }
  });

  it('multiplies by α with its 3 × 3 matrix', () => {
    const S = singerFrame(2);
    expect(alphaMatrix(S.F, S.cubic)).toEqual([
      [0, 0, 1],
      [1, 0, 1],
      [0, 1, 0],
    ]);
    expect(mulAlpha(S.F, S.cubic, [0, 0, 1])).toEqual([1, 1, 0]); // α³ = 1 + α
  });

  it('sends point i to point i + 1 and every line to a line', () => {
    for (const q of QS) {
      const S = singerFrame(q);
      for (let i = 0; i < S.v; i++) {
        const next = pointIndex(S.P, mulAlpha(S.F, S.cubic, S.P.points[S.singerToPoint[i]]));
        expect(S.pointToSinger[next]).toBe((i + 1) % S.v);
      }
      const keys = new Set(S.P.lineSets.map((_, j) => singerLine(S, j).join(',')));
      for (let j = 0; j < S.v; j++) {
        const moved = translate(singerLine(S, j), 1, S.v);
        expect(keys.has(moved.join(','))).toBe(true);
        expect(singerLine(S, alphaImageLine(S, j))).toEqual(moved);
      }
    }
  });

  it('makes the line z = 0 the featured difference sets', () => {
    const z = (q: number) => singerLine(singerFrame(q), lineIndex(pg2(q), [0, 0, 1]));
    expect(z(2)).toEqual([0, 1, 3]);
    expect(z(3)).toEqual([0, 1, 3, 9]);
    expect(z(4)).toEqual([0, 1, 4, 14, 16]);
  });

  it('turns every line into a planar difference set, a Singer set', () => {
    for (const q of QS) {
      const S = singerFrame(q);
      const classes = new Set(nonIsomorphicSingerSets(q).map((s) => s.join(',')));
      for (let j = 0; j < S.v; j++) {
        const D = singerLine(S, j);
        expect(differenceSetLambda(D, S.v)).toBe(1);
        expect(classes.has(normalizeSet(D, S.v).join(','))).toBe(true);
      }
    }
  });

  it('agrees with singerSet: the trace-zero line for prime q is exactly singerSet(q)', () => {
    for (const q of [2, 3, 5, 7, 11]) {
      const S = singerFrame(q);
      const D = S.powers.slice(0, S.v).flatMap((u, i) => (trace(S, u) === 0 ? [i] : []));
      expect(D).toEqual(singerSet(q));
    }
  });
});
