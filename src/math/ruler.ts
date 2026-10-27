// Golomb rulers: sets of marks whose pairwise distances are all different.
//
// On a circle of v points, the distance from mark a to mark b going
// clockwise is (b − a) mod v. A planar (v, k, 1) difference set has every
// nonzero distance exactly once: a perfect modular Golomb ruler. Cutting the
// circle open at one gap unwinds it into an ordinary (straight) Golomb ruler.

import { mod } from './numbers';

/** Marks reduced mod v, without repeats, in increasing order. */
const sorted = (set: readonly number[], v: number) => [...new Set(set.map((x) => mod(x, v)))].sort((a, b) => a - b);

/** How many ordered pairs of marks are d steps apart clockwise, for d = 0 … v − 1 (entry 0 is unused). */
export function modularDistanceCounts(set: readonly number[], v: number): number[] {
  const counts = new Array<number>(v).fill(0);
  for (const a of set) for (const b of set) if (a !== b) counts[mod(b - a, v)]++;
  return counts;
}

/** Every nonzero distance mod v occurs at most once: a modular Golomb ruler. */
export const isModularGolomb = (set: readonly number[], v: number) =>
  modularDistanceCounts(set, v).every((c) => c <= 1);

/** Every nonzero distance mod v occurs exactly once: a perfect modular ruler (a planar difference set). */
export const isPerfectModularRuler = (set: readonly number[], v: number) =>
  modularDistanceCounts(set, v).every((c, d) => d === 0 || c === 1);

/** The smallest circle a k-mark modular Golomb ruler can live on: k(k − 1) + 1 = k² − k + 1. */
export const minModulus = (k: number) => k * k - k + 1;

export interface Gap {
  /** The mark the gap starts after. */
  from: number;
  /** The next mark clockwise. */
  to: number;
  /** The number of steps from `from` to `to`. */
  length: number;
}

/** The gaps between consecutive marks going clockwise around the circle. */
export function gaps(set: readonly number[], v: number): Gap[] {
  const s = sorted(set, v);
  return s.map((from, i) => {
    const to = s[(i + 1) % s.length];
    return { from, to, length: mod(to - from, v) || v };
  });
}

/**
 * Cut the circle open in the gap after mark `cutAfter` and lay it out
 * straight: the next mark becomes 0 and the rest follow clockwise. The ruler's
 * length is v minus the length of the cut gap.
 */
export function unwind(set: readonly number[], v: number, cutAfter: number): number[] {
  const gap = gaps(set, v).find((g) => g.from === mod(cutAfter, v));
  if (!gap) throw new Error(`${cutAfter} is not a mark`);
  return sorted(set, v)
    .map((x) => mod(x - gap.to, v))
    .sort((a, b) => a - b);
}

/** The gap whose cut gives the shortest straight ruler: the longest gap (first one on ties). */
export function bestCut(set: readonly number[], v: number): Gap {
  return gaps(set, v).reduce((best, g) => (g.length > best.length ? g : best));
}

/** The length (last mark minus first) of a straight ruler. */
export const rulerLength = (marks: readonly number[]) => Math.max(...marks) - Math.min(...marks);

/** How many pairs of marks on a straight ruler are d apart, for d = 0 … length. */
export function linearDistanceCounts(marks: readonly number[]): number[] {
  const counts = new Array<number>(rulerLength(marks) + 1).fill(0);
  for (let i = 0; i < marks.length; i++)
    for (let j = i + 1; j < marks.length; j++) counts[Math.abs(marks[j] - marks[i])]++;
  return counts;
}

/** All pairwise distances on a straight ruler are different. */
export const isGolomb = (marks: readonly number[]) => linearDistanceCounts(marks).every((c) => c <= 1);
