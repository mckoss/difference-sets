import { binomial, planarParams, SubsetSearch } from '../math/search';
import { formatCount, formatDuration, setText } from './format';

const TABLE_ORDERS = [2, 3, 4, 5, 7, 8, 9, 10, 16, 32, 100];
const SEARCH_ORDERS = [2, 3, 4, 5];
const SLICE_MS = 12;

/**
 * `<div data-widget="brute-force-count">`: how many k-subsets a brute-force
 * search must try for planar parameters v = n² + n + 1, k = n + 1, and a live
 * search over every subset for small v.
 */
export function mount(el: HTMLElement): void {
  const table = document.createElement('table');
  table.className = 'count-table';
  table.innerHTML =
    '<caption>Subsets to try for a (v, k, 1) difference set, at a billion per second</caption>' +
    '<thead><tr><th>n</th><th>v</th><th>k</th><th>C(v, k)</th><th>time</th></tr></thead>';
  const tbody = document.createElement('tbody');
  for (const n of TABLE_ORDERS) {
    const { v, k } = planarParams(n);
    const c = binomial(v, k);
    const tr = document.createElement('tr');
    for (const text of [n, v, k, formatCount(c), formatDuration(c)]) {
      const td = document.createElement('td');
      td.textContent = String(text);
      tr.append(td);
    }
    tbody.append(tr);
  }
  table.append(tbody);
  const tableWrap = document.createElement('div');
  tableWrap.className = 'table-scroll';
  tableWrap.append(table);

  const controls = document.createElement('div');
  controls.className = 'controls';
  const label = document.createElement('label');
  label.className = 'control';
  const select = document.createElement('select');
  select.className = 'search-select';
  for (const n of SEARCH_ORDERS) {
    const { v, k } = planarParams(n);
    select.append(new Option(`v = ${v}, k = ${k}`, String(n)));
  }
  label.append('Search ', select);
  const run = document.createElement('button');
  run.type = 'button';
  run.className = 'run-button';
  run.textContent = 'Run search';
  controls.append(label, run);

  const progress = document.createElement('p');
  progress.className = 'search-progress';
  progress.setAttribute('aria-live', 'polite');
  const found = document.createElement('p');
  found.className = 'search-found';

  let timer: ReturnType<typeof setTimeout> | undefined;
  const start = () => {
    clearTimeout(timer);
    const { v, k } = planarParams(Number(select.value));
    const search = new SubsetSearch(v, k);
    const t0 = performance.now();
    const report = () => {
      const ms = Math.round(performance.now() - t0);
      progress.textContent =
        `Checked ${formatCount(BigInt(search.checked))} of ${formatCount(search.total)} subsets` +
        ` and found ${search.found.length} difference sets` +
        (search.done ? ` in ${ms} ms.` : '…');
      const shown = search.found.slice(0, 8).map(setText).join(', ');
      found.textContent = search.found.length ? `First found: ${shown}${search.found.length > 8 ? ', …' : ''}` : '';
    };
    const slice = () => {
      const end = performance.now() + SLICE_MS;
      while (!search.done && performance.now() < end) search.run(2000);
      report();
      if (!search.done) timer = setTimeout(slice, 0);
    };
    slice();
  };
  run.addEventListener('click', start);
  select.addEventListener('change', () => {
    clearTimeout(timer);
    progress.textContent = '';
    found.textContent = '';
  });

  el.classList.add('widget', 'brute-force');
  el.replaceChildren(tableWrap, controls, progress, found);
}
