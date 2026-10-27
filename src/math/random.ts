// A small seeded random number generator, so widgets and the deck maker can
// reproduce a layout from a seed in the URL.

export type Rng = () => number;

/** Mulberry32: a fast 32-bit generator returning numbers in [0, 1). */
export function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A whole number in [0, n). */
export const randomInt = (rng: Rng, n: number) => Math.floor(rng() * n);

/** A shuffled copy of `items` (Fisher–Yates). */
export function shuffled<T>(items: readonly T[], rng: Rng): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = randomInt(rng, i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** A fresh seed for the URL: a whole number below one million. */
export const newSeed = () => Math.floor(Math.random() * 1_000_000);
