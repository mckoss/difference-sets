// Disk-array layouts and their rebuild load (Lesson 28).
//
// A layout places stripes on disks. Each stripe has one chunk on each of its
// disks: data chunks plus one parity chunk, the XOR of the data. When a disk
// fails, every stripe with a chunk on it is rebuilt by reading that stripe's
// other chunks. A surviving disk reads one chunk for every stripe it shares
// with the failed disk, so the rebuild takes as long as the busiest survivor.
//
// With stripes D + j for a (v, k, λ) difference set D, any two disks share
// exactly λ stripes (Lesson 2), so every survivor reads the same amount.

import { mod } from './numbers';
import { type Rng, randomInt, shuffled } from './random';

export type LayoutKind = 'declustered' | 'classic' | 'random';

export interface Stripe {
  /** The disks holding this stripe's chunks, one chunk each. */
  disks: number[];
  /** The disk holding the parity chunk (one of `disks`). */
  parity: number;
}

export interface Layout {
  kind: LayoutKind;
  /** Number of disks. */
  disks: number;
  /** Chunks per stripe. */
  width: number;
  stripes: Stripe[];
  /** For a random layout, the seed that produced it. */
  seed?: number;
}

export interface RaidPreset {
  label: string;
  q: number;
  v: number;
  set: number[];
}

/** The three smallest planar difference sets, as used throughout the lessons. */
export const RAID_PRESETS: RaidPreset[] = [
  { label: '7 disks, stripes of 3 (q = 2)', q: 2, v: 7, set: [0, 1, 3] },
  { label: '13 disks, stripes of 4 (q = 3)', q: 3, v: 13, set: [0, 1, 3, 9] },
  { label: '21 disks, stripes of 5 (q = 4)', q: 4, v: 21, set: [0, 1, 4, 14, 16] },
];

/**
 * Stripe j sits on the disks D + j mod v. The parity chunk goes on the last
 * member, so each disk also holds exactly one parity chunk.
 */
export function declusteredLayout(set: readonly number[], v: number): Layout {
  const stripes = Array.from({ length: v }, (_, j) => {
    const disks = set.map((d) => mod(d + j, v));
    return { disks, parity: disks[disks.length - 1] };
  });
  return { kind: 'declustered', disks: v, width: set.length, stripes };
}

/**
 * Classic RAID-5: the disks are split into groups of `width`, and each group
 * holds `width` stripes of its own, with the parity chunk rotating. Disks left
 * over after the last full group hold nothing (a spare).
 */
export function classicLayout(v: number, width: number): Layout {
  const stripes: Stripe[] = [];
  for (let g = 0; (g + 1) * width <= v; g++) {
    const disks = Array.from({ length: width }, (_, i) => g * width + i);
    for (let s = 0; s < width; s++) stripes.push({ disks, parity: disks[width - 1 - s] });
  }
  return { kind: 'classic', disks: v, width, stripes };
}

/**
 * A random layout with the same shape as the declustered one: v stripes of
 * `width` chunks, and every disk holding exactly `width` chunks. Chunks are
 * dealt at random, then any stripe that got two chunks on one disk is fixed by
 * swapping with another stripe.
 */
export function randomLayout(v: number, width: number, rng: Rng): Layout {
  const slots = shuffled(
    Array.from({ length: v * width }, (_, i) => Math.floor(i / width)),
    rng,
  );
  const stripes = Array.from({ length: v }, (_, j) => slots.slice(j * width, (j + 1) * width));
  const hasDup = (s: number[]) => new Set(s).size < s.length;
  for (let guard = 0; guard < 100_000 && stripes.some(hasDup); guard++) {
    const a = stripes.findIndex(hasDup);
    const sa = stripes[a];
    const ia = sa.findIndex((x, i) => sa.indexOf(x) !== i);
    const b = randomInt(rng, v);
    const ib = randomInt(rng, width);
    const sb = stripes[b];
    if (b === a || sa.includes(sb[ib]) || sb.includes(sa[ia])) continue;
    [sa[ia], sb[ib]] = [sb[ib], sa[ia]];
  }
  if (stripes.some(hasDup)) throw new Error('Could not build a random layout');
  return {
    kind: 'random',
    disks: v,
    width,
    stripes: stripes.map((disks) => ({ disks, parity: disks[disks.length - 1] })),
  };
}

/** The indices of the stripes with a chunk on `disk`. */
export function stripesOnDisk(layout: Layout, disk: number): number[] {
  return layout.stripes.flatMap((s, j) => (s.disks.includes(disk) ? [j] : []));
}

/**
 * How many chunks each disk reads to rebuild `failed`: the number of stripes
 * it shares with the failed disk. The failed disk itself reads 0.
 */
export function rebuildReads(layout: Layout, failed: number): number[] {
  const reads = new Array<number>(layout.disks).fill(0);
  for (const s of layout.stripes) {
    if (!s.disks.includes(failed)) continue;
    for (const d of s.disks) if (d !== failed) reads[d]++;
  }
  return reads;
}

export interface RebuildSummary {
  failed: number;
  /** Stripes that lost a chunk. */
  lost: number[];
  reads: number[];
  /** Reads by the busiest survivor: the rebuild takes this many read-times. */
  busiest: number;
  /** Fewest reads by any survivor. */
  fewest: number;
  /** All reads added up. */
  total: number;
  /** Survivors that read nothing. */
  idle: number[];
  /** True if every survivor reads the same number of chunks. */
  even: boolean;
}

export function rebuildSummary(layout: Layout, failed: number): RebuildSummary {
  const reads = rebuildReads(layout, failed);
  const survivors = reads.filter((_, d) => d !== failed);
  const busiest = Math.max(...survivors);
  const fewest = Math.min(...survivors);
  return {
    failed,
    lost: stripesOnDisk(layout, failed),
    reads,
    busiest,
    fewest,
    total: survivors.reduce((a, b) => a + b, 0),
    idle: reads.flatMap((r, d) => (d !== failed && r === 0 ? [d] : [])),
    even: busiest === fewest,
  };
}

/** True if, whichever disk fails, every survivor reads the same number of chunks. */
export function evenForEveryFailure(layout: Layout): boolean {
  return Array.from({ length: layout.disks }, (_, d) => rebuildSummary(layout, d).even).every(Boolean);
}

/**
 * The first random layout, trying seeds from `seed` upward, in which losing
 * disk 0 leaves some survivor idle and another reading 2 or more chunks.
 */
export function unevenRandomLayout(v: number, width: number, seed: number, makeRng: (seed: number) => Rng): Layout {
  for (let s = seed; s < seed + 10_000; s++) {
    const layout = randomLayout(v, width, makeRng(s));
    const sum = rebuildSummary(layout, 0);
    if (sum.fewest === 0 && sum.busiest >= 2) return { ...layout, seed: s };
  }
  throw new Error(`No uneven random layout of ${v} disks near seed ${seed}`);
}

// ---------------------------------------------------------------------------
// XOR parity

/** Number of bits in a demo chunk. */
export const CHUNK_BITS = 8;

/** A made-up 8-bit data chunk for position `pos` of stripe `stripe`. */
export function dataChunk(stripe: number, pos: number): number {
  return (Math.imul(stripe * 31 + pos * 7 + 11, 2654435761) >>> 24) & 0xff;
}

export const xorAll = (values: readonly number[]) => values.reduce((a, b) => a ^ b, 0);

/**
 * The chunk values of one stripe, in the order of `stripe.disks`: made-up data
 * on the data disks, and their XOR on the parity disk.
 */
export function stripeChunks(stripe: Stripe, index: number): number[] {
  const values = stripe.disks.map((d, pos) => (d === stripe.parity ? 0 : dataChunk(index, pos)));
  const p = stripe.disks.indexOf(stripe.parity);
  values[p] = xorAll(values);
  return values;
}

/** Rebuild the chunk at position `lost` as the XOR of all the others. */
export function recoverChunk(values: readonly number[], lost: number): number {
  return xorAll(values.filter((_, i) => i !== lost));
}

/** "10110010" */
export const bits = (x: number, n = CHUNK_BITS) => x.toString(2).padStart(n, '0');
