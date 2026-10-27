// Sequences from a set D mod v, and their periodic correlations.
//
// For a (v, k, λ) difference set, the 0/1 sequence a_i = [i ∈ D] has
// autocorrelation k at shift 0 and λ at every other shift; the ±1 sequence
// s_i = −1 if i ∈ D, +1 otherwise, has v at shift 0 and v − 4(k − λ)
// everywhere else.

/** a_i = 1 if i is in D, else 0, for i = 0 … v − 1. */
export function indicator(set: readonly number[], v: number): number[] {
  const a = new Array<number>(v).fill(0);
  for (const x of set) a[((x % v) + v) % v] = 1;
  return a;
}

/** s_i = −1 if i is in D, else +1. */
export function plusMinus(set: readonly number[], v: number): number[] {
  return indicator(set, v).map((x) => (x ? -1 : 1));
}

/** Periodic cross-correlation C(t) = Σ_i a_i · b_(i + t mod v), for t = 0 … v − 1. */
export function correlation(a: readonly number[], b: readonly number[]): number[] {
  const v = a.length;
  if (b.length !== v) throw new Error('Sequences must have the same length');
  const out = new Array<number>(v).fill(0);
  for (let t = 0; t < v; t++) {
    let sum = 0;
    for (let i = 0; i < v; i++) sum += a[i] * b[(i + t) % v];
    out[t] = sum;
  }
  return out;
}

export const autocorrelation = (a: readonly number[]) => correlation(a, a);

/** The off-peak value of the ±1 autocorrelation of a (v, k, λ) difference set. */
export const plusMinusOffPeak = (v: number, k: number, lambda: number) => v - 4 * (k - lambda);
