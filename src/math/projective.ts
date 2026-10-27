// Part IV: the vector space GF(q)³, the projective plane PG(2, q) built from
// it, and the Singer cycle that multiplication by α induces on that plane.
//
// GF(q) comes from `smallField` (elements 0 … q − 1, the base-p numbering of
// Lesson 7). GF(q³) is GF(q)[α] modulo a primitive cubic, so an element
// c₀ + c₁α + c₂α² is the coordinate vector (c₀, c₁, c₂) in GF(q)³. For prime
// q the cubic is the one `singerSet` uses, so the two agree exactly.

import { mod, primePower } from './numbers';
import { superscript } from './poly';
import { findPrimitivePoly, singerV } from './singer';
import { findPrimitiveCubic, smallField } from './singerFast';

// ---------------------------------------------------------------------------
// GF(q)

export interface GF {
  q: number;
  p: number;
  e: number;
  elements: number[];
  add(a: number, b: number): number;
  sub(a: number, b: number): number;
  neg(a: number): number;
  mul(a: number, b: number): number;
  /** The inverse of a nonzero element. */
  inv(a: number): number;
  /** How the widgets write an element: 0 … p − 1 for prime q, else 0, 1, ω, ω², … (ω a primitive element). */
  label(a: number): string;
}

const fieldCache = new Map<number, GF>();

export function gf(q: number): GF {
  const cached = fieldCache.get(q);
  if (cached) return cached;
  const pe = primePower(q);
  if (!pe) throw new Error(`${q} is not a prime power`);
  const F = smallField(q);
  const elements = Array.from({ length: q }, (_, i) => i);
  const inverse = elements.map((a) => (a === 0 ? -1 : elements.find((b) => F.mul(a, b) === 1)!));
  const labels = elements.map(String);
  if (F.e > 1) {
    // smallField multiplies through powers of x, which is element p.
    let x = 1;
    for (let j = 0; j < q - 1; j++, x = F.mul(x, F.p)) labels[x] = j === 0 ? '1' : j === 1 ? 'ω' : `ω${superscript(j)}`;
  }
  const field: GF = {
    q,
    p: F.p,
    e: F.e,
    elements,
    add: F.add,
    neg: F.neg,
    sub: (a, b) => F.add(a, F.neg(b)),
    mul: F.mul,
    inv: (a) => {
      if (a === 0) throw new Error('0 has no inverse');
      return inverse[a];
    },
    label: (a) => labels[a],
  };
  fieldCache.set(q, field);
  return field;
}

// ---------------------------------------------------------------------------
// Vectors in GF(q)³

export type Vec = [number, number, number];

export const vecKey = (u: readonly number[]) => u.join(',');

export function isZero(u: Vec): boolean {
  return u[0] === 0 && u[1] === 0 && u[2] === 0;
}

export function addVec(F: GF, u: Vec, w: Vec): Vec {
  return [F.add(u[0], w[0]), F.add(u[1], w[1]), F.add(u[2], w[2])];
}

export function scale(F: GF, c: number, u: Vec): Vec {
  return [F.mul(c, u[0]), F.mul(c, u[1]), F.mul(c, u[2])];
}

/** x₁y₁ + x₂y₂ + x₃y₃, computed in GF(q). */
export function dot(F: GF, u: Vec, w: Vec): number {
  return F.add(F.add(F.mul(u[0], w[0]), F.mul(u[1], w[1])), F.mul(u[2], w[2]));
}

/** The cross product, a nonzero vector orthogonal to both u and w when they are independent. */
export function cross(F: GF, u: Vec, w: Vec): Vec {
  return [
    F.sub(F.mul(u[1], w[2]), F.mul(u[2], w[1])),
    F.sub(F.mul(u[2], w[0]), F.mul(u[0], w[2])),
    F.sub(F.mul(u[0], w[1]), F.mul(u[1], w[0])),
  ];
}

/** All q³ vectors, in base-q counting order of (x, y, z). */
export function allVectors(F: GF): Vec[] {
  const out: Vec[] = [];
  for (const x of F.elements) for (const y of F.elements) for (const z of F.elements) out.push([x, y, z]);
  return out;
}

/** The line through the origin spanned by u: the q multiples c·u, starting with 0. */
export function span1(F: GF, u: Vec): Vec[] {
  return F.elements.map((c) => scale(F, c, u));
}

/** The plane through the origin with normal n: the q² vectors x with n · x = 0. */
export function planeThroughOrigin(F: GF, n: Vec): Vec[] {
  return allVectors(F).filter((x) => dot(F, n, x) === 0);
}

/** Scale a nonzero vector so its first nonzero coordinate is 1: the canonical name of its projective point. */
export function normalize(F: GF, u: Vec): Vec {
  const lead = u.find((c) => c !== 0);
  if (lead === undefined) throw new Error('The zero vector is not a projective point');
  return scale(F, F.inv(lead), u);
}

/** The q² + q + 1 canonical vectors: [1 : y : z], then [0 : 1 : z], then [0 : 0 : 1]. */
export function canonicalVectors(F: GF): Vec[] {
  const out: Vec[] = [];
  for (const y of F.elements) for (const z of F.elements) out.push([1, y, z]);
  for (const z of F.elements) out.push([0, 1, z]);
  out.push([0, 0, 1]);
  return out;
}

/** "[1 : ω : 0]", using the field's labels. */
export function formatPoint(F: GF, u: readonly number[], open = '[', close = ']'): string {
  return `${open}${u.map((c) => F.label(c)).join(' : ')}${close}`;
}

export function formatVec(F: GF, u: readonly number[]): string {
  return `(${u.map((c) => F.label(c)).join(', ')})`;
}

// ---------------------------------------------------------------------------
// PG(2, q)

export interface PG2 {
  q: number;
  F: GF;
  /** v = q² + q + 1. */
  v: number;
  /** Point i, by its canonical coordinates. */
  points: Vec[];
  /** Line j, by its canonical dual coordinates [a : b : c]: the points with ax + by + cz = 0. */
  lines: Vec[];
  /** The sorted point indices on each line, so a PG2 is also an `Incidence`. */
  lineSets: number[][];
  /** The sorted line indices through each point. */
  pencils: number[][];
}

const planeCache = new Map<number, PG2>();

export function pg2(q: number): PG2 {
  const cached = planeCache.get(q);
  if (cached) return cached;
  const F = gf(q);
  const points = canonicalVectors(F);
  const lines = canonicalVectors(F);
  const lineSets = lines.map((l) => points.flatMap((pt, i) => (dot(F, l, pt) === 0 ? [i] : [])));
  const pencils = points.map((pt) => lines.flatMap((l, j) => (dot(F, l, pt) === 0 ? [j] : [])));
  const plane: PG2 = { q, F, v: points.length, points, lines, lineSets, pencils };
  planeCache.set(q, plane);
  return plane;
}

/** The index of the projective point of a nonzero vector. */
export function pointIndex(P: PG2, u: Vec): number {
  return indexOf(P.q, normalize(P.F, u));
}

/** The index of the line with dual coordinates n (any nonzero multiple). */
export function lineIndex(P: PG2, n: Vec): number {
  return indexOf(P.q, normalize(P.F, n));
}

// Inverse of canonicalVectors' order.
function indexOf(q: number, u: Vec): number {
  if (u[0] === 1) return u[1] * q + u[2];
  if (u[1] === 1) return q * q + u[2];
  return q * q + q;
}

export function incident(P: PG2, point: number, line: number): boolean {
  return dot(P.F, P.points[point], P.lines[line]) === 0;
}

/** The one line through two different points: its dual coordinates are their cross product. */
export function joinLine(P: PG2, a: number, b: number): number {
  if (a === b) throw new Error('Two different points are needed');
  return lineIndex(P, cross(P.F, P.points[a], P.points[b]));
}

/** The one point on two different lines. */
export function meetPoint(P: PG2, i: number, j: number): number {
  if (i === j) throw new Error('Two different lines are needed');
  return pointIndex(P, cross(P.F, P.lines[i], P.lines[j]));
}

// ---------------------------------------------------------------------------
// GF(q³) as GF(q)³, and the Singer cycle

export interface SingerFrame {
  q: number;
  F: GF;
  P: PG2;
  v: number;
  /** α³ = a·α² + b·α + c, stored as [a, b, c]. */
  cubic: Vec;
  /** powers[i] = the coordinates (c₀, c₁, c₂) of αⁱ = c₀ + c₁α + c₂α², for 0 ≤ i < q³ − 1. */
  powers: Vec[];
  /** The coordinate index of Singer point i (the point of αⁱ), for 0 ≤ i < v. */
  singerToPoint: number[];
  /** The Singer number of each coordinate point. */
  pointToSinger: number[];
}

const frameCache = new Map<number, SingerFrame>();

/** The primitive cubic: for prime q, the one singerSet uses; otherwise the first from findPrimitiveCubic. */
export function primitiveCubic(q: number): Vec {
  const F = gf(q);
  if (F.e === 1) {
    const f = findPrimitivePoly(q, 3); // f₀ + f₁x + f₂x² + x³
    return [mod(-f[2], q), mod(-f[1], q), mod(-f[0], q)];
  }
  return findPrimitiveCubic(smallField(q));
}

/** Multiply c₀ + c₁α + c₂α² by α, using α³ = aα² + bα + c. */
export function mulAlpha(F: GF, cubic: Vec, u: Vec): Vec {
  const [a, b, c] = cubic;
  const [c0, c1, c2] = u;
  return [F.mul(c, c2), F.add(c0, F.mul(b, c2)), F.add(c1, F.mul(a, c2))];
}

/** The 3 × 3 matrix of x ↦ αx: column j is α times the j-th basis vector (1, α, α²). */
export function alphaMatrix(F: GF, cubic: Vec): number[][] {
  const cols = ([[1, 0, 0], [0, 1, 0], [0, 0, 1]] as Vec[]).map((u) => mulAlpha(F, cubic, u));
  return [0, 1, 2].map((r) => cols.map((col) => col[r]));
}

export function singerFrame(q: number): SingerFrame {
  const cached = frameCache.get(q);
  if (cached) return cached;
  const P = pg2(q);
  const F = P.F;
  const cubic = primitiveCubic(q);
  const powers: Vec[] = [];
  let u: Vec = [1, 0, 0];
  for (let i = 0; i < q ** 3 - 1; i++) {
    powers.push(u);
    u = mulAlpha(F, cubic, u);
  }
  if (!(u[0] === 1 && u[1] === 0 && u[2] === 0)) throw new Error('α does not have order q³ − 1');
  const singerToPoint = powers.slice(0, P.v).map((w) => pointIndex(P, w));
  const pointToSinger = new Array<number>(P.v);
  singerToPoint.forEach((pt, i) => (pointToSinger[pt] = i));
  const frame: SingerFrame = { q, F, P, v: P.v, cubic, powers, singerToPoint, pointToSinger };
  frameCache.set(q, frame);
  return frame;
}

/** The Singer numbers of the points on coordinate line j, sorted. */
export function singerLine(S: SingerFrame, j: number): number[] {
  return S.P.lineSets[j].map((pt) => S.pointToSinger[pt]).sort((x, y) => x - y);
}

/** The line that multiplying by α carries line j onto. */
export function alphaImageLine(S: SingerFrame, j: number): number {
  const [a, b] = S.P.lineSets[j];
  const image = (pt: number) => pointIndex(S.P, mulAlpha(S.F, S.cubic, S.P.points[pt]));
  return joinLine(S.P, image(a), image(b));
}

/** Tr(x) = x + x^q + x^(q²) for x = c₀ + c₁α + c₂α²: 3c₀ + a·c₁ + (a² + 2b)·c₂ (see singerFast). */
export function trace(S: SingerFrame, u: Vec): number {
  const { F } = S;
  const [a, b] = S.cubic;
  const three = F.add(F.add(1 % F.p, 1 % F.p), 1 % F.p);
  return dot(F, [three, a, F.add(F.mul(a, a), F.add(b, b))], u);
}

/** v = q² + q + 1. */
export const planeV = singerV;
