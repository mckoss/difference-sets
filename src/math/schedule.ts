// Wake-up schedules (and quorums and key rings) built from a set D mod v.
//
// A device whose clock is shifted by `offset` is awake in the slots
// D + offset. Two devices with offsets i and j share the slots
// (D + i) ∩ (D + j), and that set has as many members as there are ways to
// write j − i as a difference of D. For a (v, k, λ) difference set that is
// λ for every i ≠ j, so the devices always meet.

import { intersection, translate } from './difference';
import { mod } from './numbers';
import { type Rng, shuffled } from './random';

export interface SchedulePreset {
  label: string;
  v: number;
  set: number[];
}

/** The three smallest planar Singer sets, as in Lessons 1–4. */
export const SCHEDULE_PRESETS: SchedulePreset[] = [
  { label: '7 slots, awake in {0, 1, 3}', v: 7, set: [0, 1, 3] },
  { label: '13 slots, awake in {0, 1, 3, 9}', v: 13, set: [0, 1, 3, 9] },
  { label: '21 slots, awake in {0, 1, 4, 14, 16}', v: 21, set: [0, 1, 4, 14, 16] },
];

/** The slots a device with this clock offset is awake in: D + offset mod v. */
export const awakeSlots = (set: readonly number[], offset: number, v: number) => translate(set, mod(offset, v), v);

/** The slots two devices, with clock offsets i and j, are both awake in. */
export function sharedSlots(set: readonly number[], i: number, j: number, v: number): number[] {
  return intersection(awakeSlots(set, i, v), awakeSlots(set, j, v));
}

/** For each relative offset t = 0 … v − 1, how many slots D and D + t share. */
export function overlapByOffset(set: readonly number[], v: number): number[] {
  return Array.from({ length: v }, (_, t) => sharedSlots(set, 0, t, v).length);
}

/** The relative offsets t ≠ 0 at which two devices on this schedule never meet. */
export function missedOffsets(set: readonly number[], v: number): number[] {
  return overlapByOffset(set, v).flatMap((n, t) => (t > 0 && n === 0 ? [t] : []));
}

/** True if any two devices meet at least once per cycle, whatever their offsets. */
export const alwaysMeet = (set: readonly number[], v: number) => missedOffsets(set, v).length === 0;

/** A random schedule: k of the v slots, sorted. */
export function randomSchedule(v: number, k: number, rng: Rng): number[] {
  return shuffled(
    Array.from({ length: v }, (_, i) => i),
    rng,
  )
    .slice(0, k)
    .sort((a, b) => a - b);
}

/**
 * The first random k-slot schedule, trying seeds from `seed` upward, for which
 * some pair of offsets never meets. Used to show how a random schedule fails.
 */
export function failingRandomSchedule(
  v: number,
  k: number,
  seed: number,
  makeRng: (seed: number) => Rng,
): { set: number[]; seed: number } {
  for (let s = seed; s < seed + 10_000; s++) {
    const set = randomSchedule(v, k, makeRng(s));
    if (!alwaysMeet(set, v)) return { set, seed: s };
  }
  throw new Error(`No failing schedule of ${k} slots in ${v} near seed ${seed}`);
}
