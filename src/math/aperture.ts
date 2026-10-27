// Coded apertures and echoes: the two-level correlation of a difference set
// put to work on a 2-D detector (Lesson 19) and on a noisy signal (Lesson 20).
//
// Images are rows × cols grids stored row by row and treated cyclically, like
// a clock in each direction. When gcd(rows, cols) = 1, the Chinese remainder
// theorem matches each i mod rows·cols with the cell (i mod rows, i mod cols),
// and a shift by t on the clock becomes the 2-D shift (t mod rows, t mod cols).
// So a difference set folds into a mask whose shifted copies all overlap it in
// exactly λ holes.

import { gcd, mod } from './numbers';
import { randomInt, type Rng, shuffled } from './random';

export interface Mask2D {
  rows: number;
  cols: number;
  /** 1 for an open hole, 0 for solid, row by row. */
  open: number[];
}

const cell = (r: number, c: number, rows: number, cols: number) => mod(r, rows) * cols + mod(c, cols);

/** The i mod rows·cols with i ≡ r (mod rows) and i ≡ c (mod cols). */
export function crtIndex(r: number, c: number, rows: number, cols: number): number {
  for (let i = mod(r, rows); i < rows * cols; i += rows) if (i % cols === mod(c, cols)) return i;
  throw new Error(`No index for (${r}, ${c}); are ${rows} and ${cols} coprime?`);
}

/** Fold a set mod rows·cols into a mask: i goes to the cell (i mod rows, i mod cols). */
export function foldSet(set: readonly number[], rows: number, cols: number): Mask2D {
  if (gcd(rows, cols) !== 1) throw new Error(`${rows} and ${cols} must be coprime`);
  const open = new Array<number>(rows * cols).fill(0);
  for (const i of set) open[cell(i, i, rows, cols)] = 1;
  return { rows, cols, open };
}

/** A mask with `holes` open cells placed at random. */
export function randomMask(rows: number, cols: number, holes: number, rng: Rng): Mask2D {
  const order = shuffled(
    Array.from({ length: rows * cols }, (_, i) => i),
    rng,
  );
  const open = new Array<number>(rows * cols).fill(0);
  for (const i of order.slice(0, holes)) open[i] = 1;
  return { rows, cols, open };
}

/** Cyclic 2-D correlation: out at shift (dr, dc) is Σ a[x] · b[x + (dr, dc)]. */
export function correlate2D(a: readonly number[], b: readonly number[], rows: number, cols: number): number[] {
  const out = new Array<number>(rows * cols).fill(0);
  for (let dr = 0; dr < rows; dr++) {
    for (let dc = 0; dc < cols; dc++) {
      let sum = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = a[r * cols + c];
          if (x !== 0) sum += x * b[cell(r + dr, c + dc, rows, cols)];
        }
      }
      out[dr * cols + dc] = sum;
    }
  }
  return out;
}

/**
 * What the detector records: every bright cell of the sky casts the mask's
 * shadow shifted by its own position, and the shadows add up.
 */
export function detectorImage(mask: Mask2D, sky: readonly number[]): number[] {
  const { rows, cols, open } = mask;
  const out = new Array<number>(rows * cols).fill(0);
  for (let sr = 0; sr < rows; sr++) {
    for (let sc = 0; sc < cols; sc++) {
      const b = sky[sr * cols + sc];
      if (!b) continue;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (open[r * cols + c]) out[cell(r + sr, c + sc, rows, cols)] += b;
        }
      }
    }
  }
  return out;
}

/**
 * Decode a detector image by correlating it with G = mask − (k − 1)/(v − 1),
 * the mask minus its average overlap per hole, scaled so a point source of
 * brightness 1 decodes to 1. For a difference-set mask the average overlap is
 * exactly λ at every shift, so the result is the sky itself with a floor of 0.
 */
export function decodeImage(mask: Mask2D, detector: readonly number[]): number[] {
  const { rows, cols, open } = mask;
  const v = rows * cols;
  const k = open.reduce((s, x) => s + x, 0);
  const c = (k - 1) / (v - 1);
  const norm = (k * (v - k)) / (v - 1);
  const g = open.map((x) => x - c);
  // R(z) = Σ_x P(x) G(x − z): correlate G against P.
  return correlate2D(g, detector, rows, cols).map((x) => x / norm);
}

/** A sky with brightness b at each listed cell. */
export function skyFrom(sources: readonly { r: number; c: number; b: number }[], rows: number, cols: number): number[] {
  const sky = new Array<number>(rows * cols).fill(0);
  for (const s of sources) sky[cell(s.r, s.c, rows, cols)] += s.b;
  return sky;
}

// ---- Echoes ----

/** A standard normal random number (Box–Muller). */
export function gaussian(rng: Rng): number {
  const u = 1 - rng();
  const w = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * w);
}

/** A random ±1 code of length v. */
export const randomPlusMinus = (v: number, rng: Rng) => Array.from({ length: v }, () => (randomInt(rng, 2) ? 1 : -1));

/** ±1 code from m-sequence bits: 0 ↦ −1, 1 ↦ +1, so the −1s sit on the Singer set (the zeros). */
export const bitsToPlusMinus = (bits: readonly number[]) => bits.map((b) => (b ? 1 : -1));

/** The code delayed by `delay` steps (cyclically), plus noise of standard deviation `noise`. */
export function received(code: readonly number[], delay: number, noise: number, rng: Rng): number[] {
  const v = code.length;
  return code.map((_, i) => code[mod(i - delay, v)] + noise * gaussian(rng));
}

/** The index of the largest value (the first, on ties). */
export function argmax(values: readonly number[]): number {
  let best = 0;
  for (let i = 1; i < values.length; i++) if (values[i] > values[best]) best = i;
  return best;
}
