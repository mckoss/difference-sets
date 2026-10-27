// Runs the planar difference set search off the main thread, streaming
// each set as it is found, classified against the Singer sets. The page
// cancels a search by terminating the worker.

import { primePower } from '../math/numbers';
import { searchPlanar } from '../math/planarSearch';
import { nonIsomorphicSingerSets, normalizeSet, singerSet } from '../math/singer';

export type SearchRequest = { n: number };

export type SearchMessage =
  | { type: 'singer'; classes: number[][]; ms: number }
  | { type: 'found'; set: number[]; classIndex: number; nodes: number; ms: number }
  | { type: 'progress'; nodes: number; ms: number }
  | { type: 'done'; nodes: number; ms: number; count: number };

const post = (m: SearchMessage) => postMessage(m);

/** Average time of one call to `singerSet(q)`, repeated until about 20 ms have passed. */
function timeSinger(q: number): number {
  let runs = 0;
  const start = performance.now();
  do {
    singerSet(q);
    runs++;
  } while (performance.now() - start < 20);
  return (performance.now() - start) / runs;
}

onmessage = (e: MessageEvent<SearchRequest>) => {
  const { n } = e.data;
  const v = n * n + n + 1;
  const classes = primePower(n) ? nonIsomorphicSingerSets(n) : [];
  const keys = classes.map((c) => c.join(','));
  post({ type: 'singer', classes, ms: classes.length ? timeSinger(n) : 0 });

  const start = performance.now();
  const result = searchPlanar(n, {
    progressEvery: 1 << 18,
    onProgress: (nodes) => post({ type: 'progress', nodes, ms: performance.now() - start }),
    onFound: (set, nodes) =>
      post({
        type: 'found',
        set,
        classIndex: keys.indexOf(normalizeSet(set, v).join(',')),
        nodes,
        ms: performance.now() - start,
      }),
  });
  post({ type: 'done', nodes: result.nodes, ms: performance.now() - start, count: result.sets.length });
};
