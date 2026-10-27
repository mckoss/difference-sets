// Brute-force search for difference sets: try every k-element subset of ℤ/vℤ.
// Lesson 1 uses it to show how quickly the search space C(v, k) explodes.

/** The binomial coefficient C(n, k), exactly. */
export function binomial(n: number, k: number): bigint {
  if (k < 0 || k > n) return 0n;
  k = Math.min(k, n - k);
  let result = 1n;
  for (let i = 1; i <= k; i++) result = (result * BigInt(n - k + i)) / BigInt(i);
  return result;
}

/** Parameters of a planar difference set of order n: v = n² + n + 1, k = n + 1, λ = 1. */
export function planarParams(n: number): { n: number; v: number; k: number } {
  return { n, v: n * n + n + 1, k: n + 1 };
}

/**
 * Step through every k-subset of {0, …, v − 1} in lexicographic order,
 * checking each for the difference-set property. `run(budget)` examines up
 * to `budget` more subsets, so a widget can search in small slices.
 */
export class SubsetSearch {
  readonly v: number;
  readonly k: number;
  readonly total: bigint;
  checked = 0;
  readonly found: number[][] = [];
  done: boolean;
  private readonly subset: number[];
  private readonly counts: Int32Array;

  constructor(v: number, k: number) {
    this.v = v;
    this.k = k;
    this.total = binomial(v, k);
    this.subset = Array.from({ length: k }, (_, i) => i);
    this.counts = new Int32Array(v);
    this.done = k > v || k < 2;
  }

  run(budget: number): void {
    const { v, k, subset } = this;
    while (budget-- > 0 && !this.done) {
      this.checked++;
      if (this.test()) this.found.push([...subset]);
      // Advance to the next subset in lexicographic order.
      let i = k - 1;
      while (i >= 0 && subset[i] === v - k + i) i--;
      if (i < 0) {
        this.done = true;
        break;
      }
      subset[i]++;
      for (let j = i + 1; j < k; j++) subset[j] = subset[j - 1] + 1;
    }
  }

  /** Whether the current subset is a difference set. */
  private test(): boolean {
    const { v, k, subset, counts } = this;
    const total = k * (k - 1);
    if (total % (v - 1) !== 0) return false;
    const lambda = total / (v - 1);
    counts.fill(0);
    for (let a = 0; a < k; a++) {
      for (let b = 0; b < k; b++) {
        if (a === b) continue;
        let d = subset[a] - subset[b];
        if (d < 0) d += v;
        if (++counts[d] > lambda) return false;
      }
    }
    return true;
  }
}

/** Every k-element difference set mod v, by exhaustive search. */
export function allDifferenceSets(v: number, k: number): number[][] {
  const s = new SubsetSearch(v, k);
  while (!s.done) s.run(1e6);
  return s.found;
}
