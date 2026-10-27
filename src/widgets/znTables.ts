import { euclidSteps, isPermutation, znAddTable, znInverse, znMulTable, znZeroDivisors } from '../math/field';
import { extendedGcd, gcd, isPrime } from '../math/numbers';
import { emitState, h, opTable, selectControl } from './ui';

const MAX_N = 24;

/**
 * `<div data-widget="zn-tables" data-v="6" data-op="mul">`: addition or
 * multiplication tables of ℤ/vℤ, a clock with v hours. Zero divisors, products equal to 1, and
 * rows that are permutations are marked. Click a row label to explain that
 * element: its inverse (with Euclid's steps) or why it has none.
 * `data-fixed` hides the n selector.
 */
export function mount(el: HTMLElement): void {
  let n = clampN(Number(el.dataset.v ?? el.dataset.n ?? 6));
  let op: 'add' | 'mul' = el.dataset.op === 'add' ? 'add' : 'mul';
  let selected: number | null = el.dataset.select !== undefined ? Number(el.dataset.select) % n : null;
  const fixed = el.hasAttribute('data-fixed');

  const controls = h('div', { class: 'controls' });
  const verdict = h('p', { class: 'ff-verdict', attrs: { 'aria-live': 'polite' } });
  const tableHost = h('div');
  const info = h('div', { class: 'ff-info', attrs: { 'aria-live': 'polite' } });
  const legend = h('p', { class: 'ff-legend' });

  const drawControls = () => {
    const parts: HTMLElement[] = [];
    if (!fixed) {
      parts.push(
        selectControl(
          'v =',
          Array.from({ length: MAX_N - 1 }, (_, i) => ({ value: String(i + 2), label: String(i + 2) })),
          String(n),
          (v) => {
            n = Number(v);
            selected = null;
            emitState(el, { v: String(n) });
            render();
          },
          'zn-n',
        ).wrap,
      );
    }
    parts.push(
      selectControl(
        'table:',
        [
          { value: 'mul', label: 'multiplication ×' },
          { value: 'add', label: 'addition +' },
        ],
        op,
        (v) => {
          op = v === 'add' ? 'add' : 'mul';
          render();
        },
        'zn-op',
      ).wrap,
    );
    controls.replaceChildren(...parts);
  };

  const render = () => {
    const zd = new Set(znZeroDivisors(n));
    const table = op === 'mul' ? znMulTable(n) : znAddTable(n);
    const labels = Array.from({ length: n }, (_, i) => String(i));
    const sym = op === 'mul' ? '×' : '+';
    const permRow = (r: number) => isPermutation(table[r]);

    if (isPrime(n)) {
      verdict.textContent = `${n} is prime: every nonzero row of the multiplication table is a permutation, so every nonzero element has an inverse. ℤ/${n}ℤ is a field.`;
      verdict.className = 'ff-verdict ok';
    } else {
      const [a] = [...zd];
      verdict.textContent = `${n} is not prime: ${a} × ${n / gcd(a, n)} = 0 here, so ${a} has no inverse. ℤ/${n}ℤ is not a field.`;
      verdict.className = 'ff-verdict bad';
    }

    tableHost.replaceChildren(
      opTable({
        caption: `${op === 'mul' ? 'Multiplication' : 'Addition'} mod ${n}`,
        corner: sym,
        rowHeads: labels.map((l, r) => (op === 'mul' && r > 0 ? `${l} ${permRow(r) ? '✓' : '✗'}` : l)),
        colHeads: labels,
        cell: (r, c) => String(table[r][c]),
        cellClass: (r, c) => {
          const cls: string[] = [];
          if (op === 'mul' && r > 0 && c > 0 && table[r][c] === 0) cls.push('zd');
          if (op === 'mul' && table[r][c] === 1) cls.push('one');
          if (op === 'add' && table[r][c] === 0) cls.push('one');
          if (selected === r) cls.push('sel');
          return cls.join(' ');
        },
        rowClass: (r) =>
          [op === 'mul' && r > 0 ? (permRow(r) ? 'perm' : 'nonperm') : '', selected === r ? 'sel' : ''].join(' ').trim(),
        onRow: (r) => {
          selected = r;
          render();
        },
        cls: 'zn',
      }),
    );

    legend.replaceChildren(
      ...(op === 'mul'
        ? [
            h('span', { class: 'swatch one' }),
            ' product is 1 (an inverse pair) ',
            h('span', { class: 'swatch zd' }),
            ' zero divisor: two nonzero numbers with product 0. ✓ marks rows that are permutations. Click a row label for details.',
          ]
        : [h('span', { class: 'swatch one' }), ' sum is 0 (a negative pair). Click a row label for details.']),
    );

    info.replaceChildren(...explain(n, op, selected));
  };

  el.classList.add('widget', 'ff-widget');
  el.replaceChildren(controls, verdict, tableHost, legend, info);
  drawControls();
  render();
}

function clampN(n: number): number {
  return Number.isInteger(n) && n >= 2 && n <= MAX_N ? n : 6;
}

function explain(n: number, op: 'add' | 'mul', a: number | null): HTMLElement[] {
  if (a === null) return [];
  if (op === 'add') {
    const neg = (n - a) % n;
    return [h('p', { text: `−${a} = ${neg}, since ${a} + ${neg} = ${a + neg} ≡ 0 (mod ${n}).` })];
  }
  if (a === 0) return [h('p', { text: '0 × anything is 0, so 0 never has an inverse. Fields only ask for inverses of nonzero elements.' })];
  const inv = znInverse(a, n);
  if (inv === null) {
    const g = gcd(a, n);
    return [
      h('p', {
        text: `${a} shares the factor ${g} with ${n}, so ${a} × ${n / g} = ${a * (n / g)} ≡ 0 (mod ${n}). ` +
          `${a} is a zero divisor and has no inverse: its row never reaches 1.`,
      }),
    ];
  }
  const steps = euclidSteps(a, n);
  const { s, t } = extendedGcd(a, n);
  const list = h('ol', { class: 'ff-steps' });
  for (const st of steps) list.append(h('li', { text: `${st.a} = ${st.q} × ${st.b} + ${st.r}` }));
  return [
    h('p', { text: `${a}⁻¹ = ${inv}, since ${a} × ${inv} = ${a * inv} = ${Math.floor((a * inv) / n)} × ${n} + 1.` }),
    h('p', { text: `Euclid's algorithm on ${n} and ${a} (divide, keep the remainder, repeat):` }),
    list,
    h('p', {
      text: `Running the steps backwards gives ${s} × ${a} + ${t} × ${n} = 1, so ${a} × ${s} ≡ 1 and ${a}⁻¹ ≡ ${s} ≡ ${inv} (mod ${n}).`,
    }),
  ];
}
