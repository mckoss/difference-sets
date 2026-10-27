/** Count how often each residue 0..v-1 occurs as a difference a - b (a ≠ b) of elements of `set` mod v. */
export function differenceCounts(set: readonly number[], v: number): number[] {
  const counts = new Array<number>(v).fill(0);
  for (const a of set) {
    for (const b of set) {
      if (a !== b) counts[(((a - b) % v) + v) % v]++;
    }
  }
  return counts;
}

/** Return λ if `set` is a (v, k, λ) difference set mod v, otherwise null. */
export function differenceSetLambda(set: readonly number[], v: number): number | null {
  if (new Set(set.map((x) => ((x % v) + v) % v)).size !== set.length) return null;
  const counts = differenceCounts(set, v);
  const lambda = counts[1] ?? 0;
  for (let d = 1; d < v; d++) {
    if (counts[d] !== lambda) return null;
  }
  return lambda;
}

export function isDifferenceSet(set: readonly number[], v: number): boolean {
  return differenceSetLambda(set, v) !== null;
}

/** The residues of `set` mod v, without repeats, in increasing order. */
export function normalizeSet(set: readonly number[], v: number): number[] {
  return [...new Set(set.map((x) => ((x % v) + v) % v))].sort((a, b) => a - b);
}

/** The translate D + j mod v, sorted. */
export function translate(set: readonly number[], j: number, v: number): number[] {
  return normalizeSet(
    set.map((x) => x + j),
    v,
  );
}

/** All v translates D + 0, D + 1, …, D + (v − 1). */
export function allTranslates(set: readonly number[], v: number): number[][] {
  return Array.from({ length: v }, (_, j) => translate(set, j, v));
}

/** The members shared by two sets. */
export function intersection(a: readonly number[], b: readonly number[]): number[] {
  const inB = new Set(b);
  return a.filter((x) => inB.has(x));
}

/**
 * The v × v table of |(D + i) ∩ (D + j)|. Entry (i, j) equals the number of
 * times j − i occurs as a difference of D (and k on the diagonal).
 */
export function translateIntersections(set: readonly number[], v: number): number[][] {
  const ts = allTranslates(set, v);
  return ts.map((a) => ts.map((b) => intersection(a, b).length));
}

export interface DifferenceReport {
  v: number;
  /** The set, reduced mod v and sorted. */
  set: number[];
  k: number;
  /** counts[d] = how often d occurs as a difference (counts[0] is 0). */
  counts: number[];
  /** λ when the set is a difference set, otherwise null. */
  lambda: number | null;
  /** k(k − 1)/(v − 1) when that is a whole number: the λ a difference set of this size would need. */
  target: number | null;
  /** Nonzero differences that occur fewer than `target` times (all zero counts when there is no target). */
  tooFew: number[];
  /** Nonzero differences that occur more than `target` times (empty when there is no target). */
  tooMany: number[];
}

/** Everything the workbench shows about a candidate set: its difference tally and why it is or isn't a difference set. */
export function differenceReport(set: readonly number[], v: number): DifferenceReport {
  const s = normalizeSet(set, v);
  const k = s.length;
  const counts = differenceCounts(s, v);
  const lambda = k >= 2 ? differenceSetLambda(s, v) : null;
  const total = k < 2 ? 0 : k * (k - 1);
  const target = v > 1 && total % (v - 1) === 0 ? total / (v - 1) : null;
  const nonzero = Array.from({ length: v - 1 }, (_, i) => i + 1);
  const tooFew = target === null ? nonzero.filter((d) => counts[d] === 0) : nonzero.filter((d) => counts[d] < target);
  const tooMany = target === null ? [] : nonzero.filter((d) => counts[d] > target);
  return { v, set: s, k, counts, lambda, target, tooFew, tooMany };
}

/** The pairs (a, b) of members with a − b ≡ d (mod v). */
export function pairsWithDifference(set: readonly number[], d: number, v: number): [number, number][] {
  const pairs: [number, number][] = [];
  for (const a of set) {
    for (const b of set) {
      if (a !== b && ((((a - b) % v) + v) % v) === d) pairs.push([a, b]);
    }
  }
  return pairs;
}
