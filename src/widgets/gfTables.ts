import { factorPoly, type LabelStyle, PolyRing } from '../math/field';
import { polyDivMod, polyExtGcd, polyFormat } from '../math/poly';
import { emitState, type FieldChoice, fieldPicker, h, opTable, readField, selectControl } from './ui';

const MAX_TABLE = 64;

/**
 * `<div data-widget="gf-tables" data-p="2" data-e="2" data-poly="1,1,1">`:
 * polynomials over GF(p) modulo f, with their addition and multiplication
 * tables. Elements are shown as polynomials or as coefficient digits. A
 * reducible f shows its zero divisors. `data-fixed` hides the field picker;
 * `data-labels="digits"` starts with digit labels; `data-op="add"` starts
 * with the addition table.
 */
export function mount(el: HTMLElement): void {
  let field: FieldChoice = readField((n) => el.dataset[n], { p: 2, e: 2 }, MAX_TABLE);
  let style: LabelStyle = el.dataset.labels === 'digits' ? 'digits' : 'poly';
  let op: 'add' | 'mul' = el.dataset.op === 'add' ? 'add' : 'mul';
  let selected: number | null = null;
  const fixed = el.hasAttribute('data-fixed');

  const picker = fixed
    ? null
    : fieldPicker(
        field,
        (f) => {
          field = f;
          selected = null;
          emitState(el, { p: String(f.p), e: String(f.e), poly: f.poly.join(',') });
          render();
        },
        { max: MAX_TABLE },
      );
  const options = h(
    'div',
    { class: 'controls' },
    selectControl(
      'show elements as',
      [
        { value: 'poly', label: 'polynomials' },
        { value: 'digits', label: 'coefficient digits' },
      ],
      style,
      (v) => {
        style = v === 'digits' ? 'digits' : 'poly';
        render();
      },
      'gf-style',
    ).wrap,
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
      'gf-op',
    ).wrap,
  );
  const verdict = h('p', { class: 'ff-verdict', attrs: { 'aria-live': 'polite' } });
  const elements = h('div', { class: 'gf-elements' });
  const tableHost = h('div');
  const legend = h('p', { class: 'ff-legend' });
  const info = h('div', { class: 'ff-info', attrs: { 'aria-live': 'polite' } });

  const render = () => {
    const R = new PolyRing(field.p, field.poly);
    const f = polyFormat(R.modulus);
    const label = (a: number) => R.label(a, style);
    if (R.isField) {
      verdict.className = 'ff-verdict ok';
      verdict.textContent =
        `f(x) = ${f} is irreducible over GF(${R.p}), so every nonzero element has an inverse: ` +
        `this is a field with ${R.p}${sup(R.k)} = ${R.size} elements, GF(${R.size}).`;
    } else {
      const factors = factorPoly(R.modulus, R.p);
      const g = factors[0];
      const rest = polyDivMod(R.modulus, g, R.p).q;
      verdict.className = 'ff-verdict bad';
      verdict.textContent =
        `f(x) = ${f} = ${factors.map((x) => `(${polyFormat(x)})`).join('')} is reducible, so ` +
        `(${polyFormat(g)}) × (${polyFormat(rest)}) = f(x) ≡ 0 here: zero divisors, and no field.`;
    }

    if (R.size <= 27) {
      elements.replaceChildren(
        h('p', { class: 'ff-legend', text: `The ${R.size} remainders mod f(x), as polynomials and as coefficient digits:` }),
        h(
          'ul',
          { class: 'chips' },
          ...R.elements().map((a) => h('li', { text: `${R.label(a, 'poly', 'x', false)} = ${R.label(a, 'digits')}` })),
        ),
      );
    } else elements.replaceChildren();

    if (R.size > MAX_TABLE) {
      tableHost.replaceChildren(h('p', { text: `Tables are shown for up to ${MAX_TABLE} elements.` }));
      return;
    }
    const zd = new Set(R.zeroDivisors());
    const table = op === 'mul' ? R.mulTable() : R.addTable();
    const heads = R.elements().map((a) => label(a) + (op === 'mul' && a !== 0 ? (zd.has(a) ? ' ✗' : '') : ''));
    tableHost.replaceChildren(
      opTable({
        caption: `${op === 'mul' ? 'Multiplication' : 'Addition'} mod ${f} over GF(${R.p})`,
        corner: op === 'mul' ? '×' : '+',
        rowHeads: heads,
        colHeads: R.elements().map(label),
        cell: (r, c) => label(table[r][c]),
        cellClass: (r, c) => {
          const cls: string[] = [];
          if (op === 'mul' && r > 0 && c > 0 && table[r][c] === 0) cls.push('zd');
          if ((op === 'mul' && table[r][c] === R.one) || (op === 'add' && table[r][c] === 0)) cls.push('one');
          if (selected === r) cls.push('sel');
          return cls.join(' ');
        },
        rowClass: (r) => (selected === r ? 'sel' : ''),
        onRow: (r) => {
          selected = r;
          render();
        },
        cls: `gf ${style}`,
      }),
    );
    legend.replaceChildren(
      ...(op === 'mul'
        ? [
            h('span', { class: 'swatch one' }),
            ' product is 1 ',
            h('span', { class: 'swatch zd' }),
            ' zero divisor (✗ marks elements with no inverse). Click a row label for details.',
          ]
        : [h('span', { class: 'swatch one' }), ' sum is 0. Addition just adds coefficients mod ' + R.p + '.']),
    );
    info.replaceChildren(...explain(R, selected, style));
  };

  el.classList.add('widget', 'ff-widget');
  el.replaceChildren(...[picker, options, verdict, elements, tableHost, legend, info].filter((x) => x !== null));
  render();
}

function sup(n: number): string {
  return '⁰¹²³⁴⁵⁶⁷⁸⁹'[n] ?? `^${n}`;
}

function explain(R: PolyRing, a: number | null, style: LabelStyle): HTMLElement[] {
  if (a === null) return [];
  const name = (x: number) => R.label(x, 'poly', 'x', false);
  const both = (x: number) => (style === 'digits' ? `${R.label(x, 'digits')} (${name(x)})` : name(x));
  if (a === 0) return [h('p', { text: '0 times anything is 0; only nonzero elements need inverses.' })];
  const inv = R.inv(a);
  if (inv === null) {
    const b = R.elements().find((x) => x !== 0 && R.mul(a, x) === 0)!;
    return [
      h('p', {
        text: `${both(a)} shares a factor with f(x), so ${both(a)} × ${both(b)} ≡ 0 (mod f). It is a zero divisor and has no inverse.`,
      }),
    ];
  }
  const { s, t } = polyExtGcd(R.poly(a), R.modulus, R.p);
  return [
    h('p', { text: `The inverse of ${both(a)} is ${both(inv)}: their product leaves remainder 1 when divided by f(x).` }),
    h('p', {
      text:
        `Euclid's algorithm for polynomials gives (${polyFormat(s)}) × (${name(a)}) + (${polyFormat(t)}) × (${polyFormat(R.modulus)}) = 1, ` +
        `and the multiple of f(x) is 0 here.`,
    }),
  ];
}
