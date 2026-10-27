// Builds a large Singer set and checks its differences off the main thread.

import { singerSetFast } from '../math/singerFast';

export type ExplorerRequest = { q: number };

export interface ExplorerResult {
  q: number;
  v: number;
  set: number[];
  /** counts[d] = how often d occurs as a difference a − b of members, for d = 0 … v − 1 (counts[0] = 0). */
  counts: Int32Array;
  buildMs: number;
  checkMs: number;
  /**
   * For large k, how many chords cross each cell of a DENSITY_SIZE² grid
   * over the circle's bounding square (null when the page draws the chords
   * itself).
   */
  density: Uint32Array | null;
  drawMs: number;
}

/** Side of the density grid. */
export const DENSITY_SIZE = 512;
/** Above this many members the worker rasterizes the chords. */
export const DENSITY_MIN_K = 120;
/** Inset of the circle from the canvas edge, as a fraction of the size. */
export const RIM_INSET = 8 / 640;

function chordDensity(v: number, set: readonly number[]): Uint32Array {
  const n = DENSITY_SIZE;
  const grid = new Uint32Array(n * n);
  const c = n / 2;
  const r = n / 2 - RIM_INSET * n;
  const xs = set.map((i) => c + r * Math.cos(-Math.PI / 2 + (2 * Math.PI * i) / v));
  const ys = set.map((i) => c + r * Math.sin(-Math.PI / 2 + (2 * Math.PI * i) / v));
  for (let i = 0; i < set.length; i++) {
    for (let j = i + 1; j < set.length; j++) {
      const dx = xs[j] - xs[i];
      const dy = ys[j] - ys[i];
      const steps = Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)));
      let x = xs[i];
      let y = ys[i];
      const sx = dx / steps;
      const sy = dy / steps;
      for (let s = 0; s <= steps; s++, x += sx, y += sy) grid[(y | 0) * n + (x | 0)]++;
    }
  }
  return grid;
}

onmessage = (e: MessageEvent<ExplorerRequest>) => {
  const { q } = e.data;
  const v = q * q + q + 1;
  let t = performance.now();
  const set = singerSetFast(q);
  const buildMs = performance.now() - t;
  t = performance.now();
  const counts = new Int32Array(v);
  for (const a of set) {
    for (const b of set) {
      if (a === b) continue;
      const d = a - b;
      counts[d < 0 ? d + v : d]++;
    }
  }
  const checkMs = performance.now() - t;
  t = performance.now();
  const density = set.length > DENSITY_MIN_K ? chordDensity(v, set) : null;
  const drawMs = performance.now() - t;
  const result: ExplorerResult = { q, v, set, counts, buildMs, checkMs, density, drawMs };
  postMessage(result, { transfer: density ? [counts.buffer, density.buffer] : [counts.buffer] });
};
