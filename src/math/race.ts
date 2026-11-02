// Race charts by rotation: N cars, k lanes, and a heat-0 lineup D.
//
// Heat j puts car j + d mod N in the lane of each d in D, so heat j is the
// translate D + j. Car c then races in heat c − d for each d in D, once in
// each lane, and cars a and b race each other once for every way of writing
// b − a as a difference of D. For a (N, k, λ) difference set every two cars
// meet exactly λ times.

import { differenceCounts, intersection, normalizeSet, translate } from './difference';
import { mod } from './numbers';
import { RACE_TABLE, type RaceEntry } from './raceTable';

/** The cars in heat j, lane by lane: car (D[i] + j) mod N in lane i. */
export const heatLineup = (set: readonly number[], j: number, cars: number) => set.map((d) => mod(d + j, cars));

/** All N heats, each a lineup lane by lane. */
export const raceChart = (set: readonly number[], cars: number) =>
  Array.from({ length: cars }, (_, j) => heatLineup(set, j, cars));

/** The heats a car races in, with its lane (0-based) in each, in heat order. */
export function carHeats(set: readonly number[], car: number, cars: number): { heat: number; lane: number }[] {
  return set.map((d, lane) => ({ heat: mod(car - d, cars), lane })).sort((a, b) => a.heat - b.heat);
}

/** For each car b, how many heats it shares with car a (a itself gets 0). */
export function opponentCounts(set: readonly number[], a: number, cars: number): number[] {
  const counts = differenceCounts(set, cars);
  return Array.from({ length: cars }, (_, b) => (b === a ? 0 : counts[mod(b - a, cars)]));
}

export interface Fairness {
  /** Every two cars meet at least lo and at most hi times. */
  lo: number;
  hi: number;
  /** pairsByMeetings[m] is the number of pairs of cars that meet m times. */
  pairsByMeetings: number[];
}

/** How evenly the chart spreads meetings over the N(N − 1)/2 pairs of cars. */
export function fairness(set: readonly number[], cars: number): Fairness {
  const counts = differenceCounts(set, cars).slice(1);
  const lo = Math.min(...counts);
  const hi = Math.max(...counts);
  const pairsByMeetings = new Array<number>(hi + 1).fill(0);
  // Each difference d stands for the N ordered pairs (a, a + d); each unordered pair is counted twice.
  for (const c of counts) pairsByMeetings[c] += cars;
  return { lo, hi, pairsByMeetings: pairsByMeetings.map((n) => n / 2) };
}

/** The cars that race in both heat j and heat j + 1 (none after the last heat). */
export function sharedWithNext(set: readonly number[], j: number, cars: number): number[] {
  if (j >= cars - 1) return [];
  return intersection(translate(set, j, cars), translate(set, j + 1, cars));
}

/** The fairest rotation in the precomputed table, or undefined outside it. */
export const fairestChart = (lanes: number, cars: number): RaceEntry | undefined =>
  RACE_TABLE.find((e) => e.lanes === lanes && e.cars === cars);

/** The car counts for which a rotation chart on this many lanes is perfect (every pair meets equally often). */
export const perfectCarCounts = (lanes: number) =>
  RACE_TABLE.filter((e) => e.lanes === lanes && e.lo === e.hi).map((e) => e.cars);

/** Car counts N with N − 1 dividing k(k − 1): the only ones where a perfect chart could exist. */
export function possiblePerfectCounts(lanes: number, maxCars: number): number[] {
  const pairs = lanes * (lanes - 1);
  const out: number[] = [];
  for (let cars = lanes + 1; cars <= maxCars; cars++) if (pairs % (cars - 1) === 0) out.push(cars);
  return out;
}

/**
 * Parse a typed heat-0 lineup: k different cars, each 0 … N − 1. Returns the
 * lineup in the order typed (lane 1 first), or an error message.
 */
export function parseLineup(text: string, lanes: number, cars: number): number[] | string {
  const parts = text.split(/[\s,{}]+/).filter(Boolean);
  if (parts.some((p) => !/^\d+$/.test(p))) return 'Type car numbers separated by commas.';
  const set = parts.map(Number);
  if (set.some((x) => x >= cars)) return `Cars are numbered 0 to ${cars - 1}.`;
  if (normalizeSet(set, cars).length !== set.length) return 'Each car can be in only one lane of a heat.';
  if (set.length !== lanes) return `Heat 0 needs one car in each of the ${lanes} lanes.`;
  return set;
}
