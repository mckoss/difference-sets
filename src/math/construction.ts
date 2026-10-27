// Part V: Singer's algorithm. The trace construction (Lesson 14) and the
// multipliers that turn one Singer set into the others (Lesson 15).
//
// Elements of GF(q³) are coordinate vectors (c₀, c₁, c₂) for c₀ + c₁α + c₂α²,
// exactly as in `projective.ts`, so the steps shown here use the same α, the
// same cubic, and the same point numbering as Lessons 12 and 13.

import { gcd, mod, primePower } from './numbers';
import { addVec, type SingerFrame, singerFrame, type Vec } from './projective';

// ---------------------------------------------------------------------------
// The trace

/** The three conjugates x, x^q, x^(q²) of x = αⁱ, read from the power table. */
export function conjugates(S: SingerFrame, i: number): [Vec, Vec, Vec] {
  const N = S.q ** 3 - 1;
  const at = (n: number) => S.powers[mod(n, N)];
  return [at(i), at(i * S.q), at(i * S.q * S.q)];
}

/**
 * Tr(αⁱ) = αⁱ + α^(iq) + α^(iq²), computed the long way, by adding the three
 * conjugates as vectors. The sum always has c₁ = c₂ = 0: it lies in GF(q).
 */
export function traceSum(S: SingerFrame, i: number): Vec {
  const [a, b, c] = conjugates(S, i);
  return addVec(S.F, addVec(S.F, a, b), c);
}

/** The trace of αⁱ as an element of GF(q). Throws if the sum ever left GF(q). */
export function traceOfPower(S: SingerFrame, i: number): number {
  const t = traceSum(S, i);
  if (t[1] !== 0 || t[2] !== 0) throw new Error(`Tr(α^${i}) is not in GF(${S.q})`);
  return t[0];
}

/**
 * The line the trace cuts out: Tr(c₀ + c₁α + c₂α²) = c₀·Tr(1) + c₁·Tr(α) + c₂·Tr(α²),
 * so the trace-zero points are the line with coordinates [Tr(1) : Tr(α) : Tr(α²)].
 */
export function traceLine(S: SingerFrame): Vec {
  return [traceOfPower(S, 0), traceOfPower(S, 1), traceOfPower(S, 2)];
}

export interface TraceStep {
  i: number;
  /** αⁱ, α^(iq), α^(iq²) as coordinate vectors. */
  conjugates: [Vec, Vec, Vec];
  /** Tr(αⁱ), an element of GF(q). */
  trace: number;
  /** Whether i joins D. */
  inD: boolean;
}

/** One step of Singer's construction for each i = 0 … v − 1. */
export function traceSteps(q: number): TraceStep[] {
  const S = singerFrame(q);
  return Array.from({ length: S.v }, (_, i) => {
    const trace = traceOfPower(S, i);
    return { i, conjugates: conjugates(S, i), trace, inD: trace === 0 };
  });
}

/** D = {i mod v : Tr(αⁱ) = 0}, in the numbering of Lessons 12 and 13. */
export function traceSet(q: number): number[] {
  return traceSteps(q)
    .filter((s) => s.inD)
    .map((s) => s.i);
}

// ---------------------------------------------------------------------------
// Translates and multiples

const sorted = (xs: readonly number[]) => [...xs].sort((a, b) => a - b);
const key = (xs: readonly number[]) => sorted(xs).join(',');

/** t·D = {t·d mod v}, sorted. For t sharing a factor with v, members can collide. */
export function multiplySet(set: readonly number[], t: number, v: number): number[] {
  return [...new Set(set.map((d) => mod(t * d, v)))].sort((a, b) => a - b);
}

/** The j with A + j = B (mod v), or null if B is not a translate of A. */
export function translateOffset(a: readonly number[], b: readonly number[], v: number): number | null {
  if (a.length !== b.length || a.length === 0) return null;
  const target = key(b);
  const first = Math.min(...b.map((x) => mod(x, v)));
  for (const x of a) {
    const j = mod(first - x, v);
    if (key(a.map((y) => mod(y + j, v))) === target) return j;
  }
  return null;
}

/**
 * The reduced form of a planar difference set: its one translate that
 * contains 0 and 1 (Halberstam and Laxton). The difference 1 occurs exactly
 * once, as a − b, and sliding by −b moves b to 0 and a to 1.
 */
export function reducedSet(set: readonly number[], v: number): number[] {
  const members = new Set(set.map((x) => mod(x, v)));
  for (const b of members) {
    if (members.has(mod(b + 1, v))) return sorted([...members].map((x) => mod(x - b, v)));
  }
  throw new Error('The set has no two members one apart');
}

/** The residues t with 1 ≤ t < v and no common factor with v. There are φ(v) of them. */
export function units(v: number): number[] {
  return Array.from({ length: v }, (_, t) => t).filter((t) => t > 0 && gcd(t, v) === 1);
}

/** The multipliers of D: the units t for which t·D is a translate of D. */
export function multipliers(set: readonly number[], v: number): number[] {
  return units(v).filter((t) => translateOffset(set, multiplySet(set, t, v), v) !== null);
}

/** 1, p, p², … mod v, until the powers repeat. */
export function powersMod(p: number, v: number): number[] {
  const out = [1 % v];
  for (let x = mod(p, v); x !== out[0]; x = mod(x * p, v)) out.push(x);
  return out;
}

export interface MultiplierClass {
  /** The reduced form (containing 0 and 1) shared by t·D for every t in the class. */
  reduced: number[];
  /** The units t whose multiples t·D land in this translation class, ascending. */
  ts: number[];
  /** The index of the class holding −D's multiples, the mirror images. */
  mirror: number;
}

/**
 * Group the φ(v) units t by the translation class of t·D. For a Singer set
 * each group is a coset t·{1, p, p², …} of the 3e multipliers, so there are
 * φ(v)/3e groups, and negation pairs them off into φ(v)/6e.
 */
export function multiplierClasses(set: readonly number[], v: number): MultiplierClass[] {
  const groups = new Map<string, { reduced: number[]; ts: number[] }>();
  for (const t of units(v)) {
    const reduced = reducedSet(multiplySet(set, t, v), v);
    const k = reduced.join(',');
    const g = groups.get(k);
    if (g) g.ts.push(t);
    else groups.set(k, { reduced, ts: [t] });
  }
  const list = [...groups.values()];
  const indexOf = new Map(list.map((g, i) => [g.reduced.join(','), i]));
  return list.map((g) => ({
    ...g,
    mirror: indexOf.get(reducedSet(multiplySet(g.reduced, v - 1, v), v).join(','))!,
  }));
}

/** 3e for q = pᵉ: how many multipliers a Singer set mod q² + q + 1 has. */
export function singerMultiplierCount(q: number): number {
  const pe = primePower(q);
  if (!pe) throw new Error(`${q} is not a prime power`);
  return 3 * pe[1];
}
