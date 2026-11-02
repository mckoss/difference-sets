// Exhaustive search for the fairest rotation race chart: a set D of k lanes'
// starting cars mod N whose differences are spread as evenly as possible.
// Kept free of imports so scripts/race-table.ts can run it under plain Node.

export interface RotationResult {
  /** The cars in heat 0, lane by lane: D, containing 0. */
  set: number[];
  /** Every two cars meet at least `lo` and at most `hi` times. */
  lo: number;
  hi: number;
}

/**
 * A k-subset D of ℤ/Nℤ containing 0 whose nonzero differences each occur
 * between `lo` and `hi` times, or null if there is none.
 */
export function rotationInWindow(k: number, N: number, lo: number, hi: number): number[] | null {
  const counts = new Array<number>(N).fill(0);
  const set = [0];
  // Total shortfall below lo, over the nonzero differences.
  let deficit = lo * (N - 1);
  const add = (x: number, depth: number): boolean => {
    let ok = true;
    for (let i = 0; i < depth; i++) {
      for (const d of [(x - set[i] + N) % N, (set[i] - x + N) % N]) {
        if (counts[d] < lo) deficit--;
        if (++counts[d] > hi) ok = false;
      }
    }
    return ok;
  };
  const remove = (x: number, depth: number) => {
    for (let i = 0; i < depth; i++) {
      for (const d of [(x - set[i] + N) % N, (set[i] - x + N) % N]) {
        if (--counts[d] < lo) deficit++;
      }
    }
  };
  const search = (depth: number, start: number): boolean => {
    if (depth === k) return deficit === 0;
    // The pairs still to come can each fill at most one unit of shortfall.
    if (deficit > k * (k - 1) - depth * (depth - 1)) return false;
    for (let x = start; x <= N - (k - depth); x++) {
      const ok = add(x, depth);
      set[depth] = x;
      if (ok && search(depth + 1, x + 1)) return true;
      remove(x, depth);
    }
    return false;
  };
  return search(1, 1) ? set.slice(0, k) : null;
}

/**
 * The fairest rotation chart for k lanes and N cars (k < N): the narrowest
 * window [lo, hi] around the average k(k − 1)/(N − 1) meetings per pair that
 * some D fits, preferring the smaller hi among windows of the same width.
 */
export function fairestRotation(k: number, N: number): RotationResult {
  const pairs = k * (k - 1);
  const floor = Math.floor(pairs / (N - 1));
  const ceil = Math.ceil(pairs / (N - 1));
  for (let width = ceil - floor; ; width++) {
    for (let lo = Math.max(0, ceil - width); lo <= floor; lo++) {
      const set = rotationInWindow(k, N, lo, lo + width);
      if (set) return { set, lo, hi: lo + width };
    }
  }
}
