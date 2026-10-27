import { primePower, totient } from '../math/numbers';
import { bruckRyser } from '../math/planeOrders';
import type { SearchMessage } from '../workers/planarSearch.worker';
import { setText } from './format';

const ORDERS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
/** Rough running times measured on a laptop, for the larger orders. */
const ESTIMATE: Record<number, string> = {
  9: 'a fraction of a second',
  10: 'about a second',
  11: '10 to 20 seconds',
  12: '2 to 3 minutes',
};
/** Orders that start searching on page load when `data-autorun` is set. */
const AUTORUN_MAX = 9;

const num = (x: number) => x.toLocaleString('en-US');
const sup = (x: number) => [...String(x)].map((d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(d)]).join('');

function formatMs(ms: number): string {
  if (ms < 0.01) return 'under 0.01 ms';
  if (ms < 10) return `${ms.toFixed(2)} ms`;
  if (ms < 10_000) return `${Math.round(ms).toLocaleString('en-US')} ms`;
  return `${(ms / 1000).toFixed(1)} s`;
}

function stat(label: string): { box: HTMLElement; value: HTMLElement; note: HTMLElement } {
  const box = document.createElement('div');
  box.className = 'stat';
  const l = document.createElement('span');
  l.className = 'stat-label';
  l.textContent = label;
  const value = document.createElement('span');
  value.className = 'stat-value';
  value.textContent = '–';
  const note = document.createElement('span');
  note.className = 'stat-note';
  box.append(l, value, note);
  return { box, value, note };
}

/** What theory says about order n before the search starts. */
function preview(n: number): string {
  const v = n * n + n + 1;
  const pe = primePower(n);
  const est = ESTIMATE[n] ? ` Expect the search to take ${ESTIMATE[n]}.` : '';
  if (pe) {
    const [p, e] = pe;
    const reduced = totient(v) / (3 * e);
    return (
      `${e === 1 ? `${n} is a prime` : `${n} = ${p}${sup(e)} is a prime power`}, so Singer's construction gives difference sets mod ${v}. ` +
      `If every planar difference set is a Singer set, the search will find exactly φ(${v})/${3 * e} = ${reduced} sets containing 0 and 1, ` +
      `all of Singer type.${est}`
    );
  }
  const br = bruckRyser(n);
  const brText = br.excluded
    ? `Bruck–Ryser already rules it out: ${n} ≡ ${br.residue} (mod 4) and ${n} is not a sum of two squares.`
    : br.applies
      ? `Bruck–Ryser does not rule it out, since ${n} = ${br.squares![0]}² + ${br.squares![1]}².`
      : `Bruck–Ryser says nothing here, since ${n} ≡ ${br.residue} (mod 4).`;
  return `${n} is not a prime power, so there is no Singer set mod ${v}. ${brText} The search checks directly.${est}`;
}

/**
 * `<div data-widget="planar-search" data-n="7" [data-url-state] [data-autorun]>`:
 * a backtracking search, in a Web Worker, for every planar difference set of
 * order n containing 0 and 1. Each result is checked against the Singer sets,
 * and the search's time and node count sit beside the time Singer's
 * construction takes for the same order.
 */
export function mount(el: HTMLElement): void {
  const useUrl = el.hasAttribute('data-url-state');
  const fromUrl = useUrl ? Number(new URLSearchParams(location.search).get('n')) : NaN;
  let n = ORDERS.includes(fromUrl) ? fromUrl : Number(el.dataset.n ?? 7);

  const controls = document.createElement('div');
  controls.className = 'controls';
  const label = document.createElement('label');
  label.className = 'control';
  const select = document.createElement('select');
  select.className = 'order-select';
  for (const x of ORDERS) select.append(new Option(`n = ${x} (v = ${x * x + x + 1}, k = ${x + 1})`, String(x)));
  label.append('Order ', select);
  const run = document.createElement('button');
  run.type = 'button';
  run.className = 'run-button';
  run.textContent = 'Run search';
  const cancel = document.createElement('button');
  cancel.type = 'button';
  cancel.className = 'cancel-button';
  cancel.textContent = 'Cancel';
  cancel.disabled = true;
  controls.append(label, run, cancel);

  const intro = document.createElement('p');
  intro.className = 'search-intro';

  const stats = document.createElement('div');
  stats.className = 'stats';
  const sNodes = stat('Search');
  const sFound = stat('Sets found');
  const sSinger = stat('Singer type');
  const sBuild = stat("Singer's construction");
  stats.append(sNodes.box, sFound.box, sSinger.box, sBuild.box);

  const status = document.createElement('p');
  status.className = 'search-status table-note';
  status.setAttribute('aria-live', 'polite');
  const list = document.createElement('ol');
  list.className = 'search-results';

  let worker: Worker | null = null;
  let classes: number[][] = [];
  let singerMs = 0;
  let found = 0;
  let singerCount = 0;
  const classSeen = new Set<number>();

  const setRunning = (on: boolean) => {
    run.disabled = on;
    cancel.disabled = !on;
    select.disabled = on;
    el.classList.toggle('running', on);
  };

  const stop = () => {
    worker?.terminate();
    worker = null;
    setRunning(false);
  };

  const reset = () => {
    stop();
    intro.textContent = preview(n);
    for (const s of [sNodes, sFound, sSinger, sBuild]) {
      s.value.textContent = '–';
      s.note.textContent = '';
    }
    status.textContent = 'Press Run search to start.';
    status.className = 'search-status table-note';
    list.replaceChildren();
    found = 0;
    singerCount = 0;
    classSeen.clear();
    classes = [];
  };

  const showNodes = (nodes: number, ms: number) => {
    sNodes.value.textContent = formatMs(ms);
    sNodes.note.textContent = `${num(nodes)} partial sets tried`;
  };

  const showFound = () => {
    sFound.value.textContent = String(found);
    sFound.note.textContent = `${classSeen.size} up to translation and negation`;
    if (classes.length) {
      sSinger.value.textContent = found ? `${Math.round((100 * singerCount) / found)}%` : '–';
      sSinger.note.textContent = `${singerCount} of ${found}`;
    }
  };

  const onMessage = (m: SearchMessage) => {
    const v = n * n + n + 1;
    if (m.type === 'singer') {
      classes = m.classes;
      singerMs = m.ms;
      if (classes.length) {
        sBuild.value.textContent = formatMs(m.ms);
        sBuild.note.textContent = `${v} steps, no search`;
      } else {
        sBuild.value.textContent = 'none';
        sBuild.note.textContent = `${n} is not a prime power`;
        sSinger.value.textContent = 'n/a';
        sSinger.note.textContent = 'no Singer sets';
      }
    } else if (m.type === 'progress') {
      showNodes(m.nodes, m.ms);
    } else if (m.type === 'found') {
      found++;
      const li = document.createElement('li');
      const text = document.createElement('span');
      text.className = 'found-set';
      text.textContent = setText(m.set);
      const badge = document.createElement('span');
      if (m.classIndex >= 0) {
        singerCount++;
        classSeen.add(m.classIndex);
        badge.className = 'badge singer';
        badge.textContent = `Singer type · class ${m.classIndex + 1} of ${classes.length}`;
        badge.title = `Equivalent to ${setText(classes[m.classIndex])} by a translation, or a translation and negation`;
      } else {
        classSeen.add(-1 - found);
        badge.className = 'badge other';
        badge.textContent = 'Not a Singer set!';
      }
      li.append(text, ' ', badge);
      list.append(li);
      showNodes(m.nodes, m.ms);
      showFound();
    } else {
      showNodes(m.nodes, m.ms);
      showFound();
      stop();
      const br = bruckRyser(n);
      if (m.count === 0) {
        status.className = 'search-status table-note done';
        status.textContent =
          `Done: the search checked every possibility and found no planar difference set of order ${n}.` +
          (br.excluded ? ' Bruck–Ryser predicted this without any search.' : '');
      } else {
        const all = singerCount === found;
        status.className = `search-status table-note done ${all ? 'ok' : 'bad'}`;
        status.textContent = all
          ? `Done: all ${found} sets are Singer sets, as the conjecture predicts. The search took ${formatMs(m.ms)}; ` +
            `Singer's construction writes one down in ${formatMs(singerMs)}.`
          : `Done: ${found - singerCount} of ${found} sets are not Singer sets.`;
      }
    }
  };

  const start = () => {
    reset();
    setRunning(true);
    status.textContent = `Searching mod ${n * n + n + 1}…`;
    worker = new Worker(new URL('../workers/planarSearch.worker.ts', import.meta.url), { type: 'module' });
    worker.onmessage = (e: MessageEvent<SearchMessage>) => onMessage(e.data);
    worker.onerror = (e) => {
      stop();
      status.textContent = `The search stopped with an error: ${e.message}`;
    };
    worker.postMessage({ n });
  };

  select.addEventListener('change', () => {
    n = Number(select.value);
    reset();
    if (useUrl) {
      const url = new URL(location.href);
      url.searchParams.set('n', String(n));
      history.replaceState(null, '', url);
    }
  });
  run.addEventListener('click', start);
  cancel.addEventListener('click', () => {
    const shown = sNodes.note.textContent;
    stop();
    status.className = 'search-status table-note';
    status.textContent = `Cancelled${shown ? ` after ${shown}` : ''}. The sets listed so far are real; the list is incomplete.`;
  });

  el.classList.add('widget', 'planar-search');
  el.replaceChildren(controls, intro, stats, status, list);
  select.value = String(n);
  reset();
  if (el.hasAttribute('data-autorun') && n <= AUTORUN_MAX) start();
}
