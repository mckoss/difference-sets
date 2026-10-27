// Backtracking search for every planar difference set of order n, used by
// the search-versus-construction playground (in a worker) and by Lesson 17.

/** Parameters of a planar difference set of order n: v = n² + n + 1, k = n + 1. */
export function planarVK(n: number): { v: number; k: number } {
  return { v: n * n + n + 1, k: n + 1 };
}

export interface PlanarSearchOptions {
  /** Called with each set as soon as it is found (sorted, containing 0 and 1). */
  onFound?: (set: number[], nodes: number) => void;
  /** Called every `progressEvery` nodes with the running node count. */
  onProgress?: (nodes: number) => void;
  progressEvery?: number;
}

export interface PlanarSearchResult {
  n: number;
  v: number;
  k: number;
  /** Every planar difference set mod v that contains 0 and 1, in lexicographic order. */
  sets: number[][];
  /** Partial sets the search extended: one per member placed. */
  nodes: number;
}

/**
 * Every planar difference set of order n that contains 0 and 1, by
 * backtracking. Each translation class has exactly one such "reduced" set,
 * because the difference 1 occurs exactly once: if a − b = 1, then D − b
 * contains 0 and 1, and no other translate does.
 *
 * Members are chosen in increasing order. A bitmask of used differences
 * (both x − y and y − x) rejects a candidate as soon as it would repeat a
 * difference, and a counting bound stops a branch when the remaining gaps
 * between neighbors, which must be distinct unused differences, cannot fit
 * in the room left on the clock.
 */
export function searchPlanar(n: number, options: PlanarSearchOptions = {}): PlanarSearchResult {
  const { v, k } = planarVK(n);
  const { onFound, onProgress, progressEvery = 1 << 20 } = options;
  const used = new Uint8Array(v);
  const set = new Int32Array(k);
  const sets: number[][] = [];
  let nodes = 0;
  let nextReport = progressEvery;

  // D = {0, 1, …}: the difference ±1 is taken.
  set[0] = 0;
  set[1] = 1;
  used[1] = 1;
  used[v - 1] = 1;
  nodes = 2;

  /** Smallest possible total of r distinct unused gap sizes, each at least 2. */
  const minGapSum = (r: number): number => {
    let sum = 0;
    for (let g = 2; r > 0 && g < v; g++) {
      if (!used[g]) {
        sum += g;
        r--;
      }
    }
    return r > 0 ? Infinity : sum;
  };

  const extend = (depth: number): void => {
    if (depth === k) {
      const found = Array.from(set);
      sets.push(found);
      onFound?.(found, nodes);
      return;
    }
    const last = set[depth - 1];
    // After placing x at this depth, k − depth gaps remain: between the
    // members still to come, and the wrap from the last one back to 0. They
    // are distinct unused differences that add up to v − x.
    const gapsLeft = k - depth;
    const bound = minGapSum(gapsLeft);
    for (let x = last + 2; x + bound <= v; x++) {
      if (used[x - last]) continue;
      // Mark x − y and y − x for every member y, undoing on a repeat. (Two
      // new differences can collide with each other, not only with old ones.)
      // Then recheck the room: the gaps after x are differences between
      // members not yet placed, so they must still be unused. The last
      // member is the exception: its only gap, back to 0, is v − x itself.
      let i = 0;
      for (; i < depth; i++) {
        const d = x - set[i];
        if (used[d]) break;
        used[d] = 1;
        used[v - d] = 1;
      }
      if (i === depth && (gapsLeft === 1 || x + minGapSum(gapsLeft) <= v)) {
        set[depth] = x;
        nodes++;
        if (onProgress && nodes >= nextReport) {
          nextReport += progressEvery;
          onProgress(nodes);
        }
        extend(depth + 1);
      }
      for (let j = 0; j < i; j++) {
        const d = x - set[j];
        used[d] = 0;
        used[v - d] = 0;
      }
    }
  };

  extend(2);
  return { n, v, k, sets, nodes };
}
