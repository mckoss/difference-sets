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
