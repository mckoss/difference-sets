import { gcd, mod } from '../math/numbers';
import { button, h, selectControl } from './ui';

interface Row {
  r: number;
  q: number | null;
  /** r = x·n + y·a */
  x: number;
  y: number;
}

/** Rows of the extended Euclidean algorithm on (n, a), each remainder written as x·n + y·a. */
export function extendedRows(a: number, n: number): Row[] {
  const rows: Row[] = [
    { r: n, q: null, x: 1, y: 0 },
    { r: a, q: null, x: 0, y: 1 },
  ];
  while (rows[rows.length - 1].r !== 0) {
    const [prev, cur] = rows.slice(-2);
    const q = Math.floor(prev.r / cur.r);
    rows.push({ r: prev.r - q * cur.r, q, x: prev.x - q * cur.x, y: prev.y - q * cur.y });
  }
  return rows;
}

/**
 * `<div data-widget="euclid" data-a="5" data-v="13">`: the extended Euclidean
 * algorithm, one division per click. Each remainder is kept as a combination
 * x·n + y·a, so when the remainder reaches 1 the inverse can be read off.
 */
export function mount(el: HTMLElement): void {
  let n = range(Number(el.dataset.v ?? el.dataset.n ?? 13), 2, 99, 13);
  let a = range(Number(el.dataset.a ?? 5), 1, n - 1, 1);
  const rows = () => extendedRows(a, n);
  let shown = 2;

  const controls = h('div', { class: 'controls' });
  const host = h('div', { class: 'ff-scroll' });
  const status = h('p', { class: 'ff-status', attrs: { 'aria-live': 'polite' } });

  const nums = (lo: number, hi: number) =>
    Array.from({ length: hi - lo + 1 }, (_, i) => ({ value: String(lo + i), label: String(lo + i) }));

  const drawControls = () => {
    controls.replaceChildren(
      selectControl('a =', nums(1, n - 1), String(a), (v) => {
        a = Number(v);
        shown = 2;
        render();
      }, 'euclid-a').wrap,
      selectControl('v =', nums(2, 60), String(n), (v) => {
        n = Number(v);
        a = Math.min(a, n - 1);
        shown = 2;
        drawControls();
        render();
      }, 'euclid-n').wrap,
      button('Next step', () => {
        if (shown < rows().length) shown++;
        render();
      }, 'euclid-step'),
      button('Show all', () => {
        shown = rows().length;
        render();
      }, 'euclid-all'),
      button('Reset', () => {
        shown = 2;
        render();
      }, 'euclid-reset'),
    );
  };

  const render = () => {
    const all = rows();
    const table = h('table', { class: 'ff-table euclid-table' });
    table.append(
      h(
        'thead',
        {},
        h('tr', {}, h('th', { text: 'remainder' }), h('th', { text: 'how it was made' }), h('th', { text: `as a combination of ${n} and ${a}` })),
      ),
    );
    const body = h('tbody');
    all.slice(0, shown).forEach((row, i) => {
      const made =
        i === 0 ? 'start with v' : i === 1 ? 'start with a' : `${all[i - 2].r} − ${row.q} × ${all[i - 1].r}`;
      const comb = `${row.r} = ${row.x} × ${n} + ${paren(row.y)} × ${a}`;
      body.append(
        h(
          'tr',
          { class: [row.r === 1 ? 'hit-one' : '', i === shown - 1 && i > 1 ? 'latest' : ''].join(' ').trim() },
          h('td', { text: String(row.r) }),
          h('td', { text: made }),
          h('td', { text: comb }),
        ),
      );
    });
    table.append(body);
    host.replaceChildren(table);

    const last = all[shown - 1];
    const one = all.slice(0, shown).find((r) => r.r === 1);
    if (one) {
      const inv = mod(one.y, n);
      status.textContent =
        `Remainder 1 = ${one.x} × ${n} + ${paren(one.y)} × ${a}. The ${n} term is 0 mod ${n}, so ` +
        `${a} × ${paren(one.y)} ≡ 1, and the inverse of ${a} mod ${n} is ${inv}. Check: ${a} × ${inv} = ${a * inv} = ` +
        `${Math.floor((a * inv) / n)} × ${n} + 1.`;
    } else if (last.r === 0) {
      status.textContent = `The last nonzero remainder is gcd(${a}, ${n}) = ${gcd(a, n)}, not 1, so ${a} has no inverse mod ${n}.`;
    } else {
      status.textContent = `Divide the last two remainders and keep the new remainder. Click Next step.`;
    }
  };

  el.classList.add('widget', 'ff-widget');
  el.replaceChildren(controls, host, status);
  drawControls();
  render();
}

function paren(x: number): string {
  return x < 0 ? `(${x})` : String(x);
}

function range(x: number, lo: number, hi: number, fallback: number): number {
  return Number.isInteger(x) && x >= lo && x <= hi ? x : fallback;
}
