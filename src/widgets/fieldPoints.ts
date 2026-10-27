import { formatPoint, formatVec, type GF, singerFrame, type Vec } from '../math/projective';
import { superscript } from '../math/poly';
import { h, opTable, selectControl } from './ui';

const QS = [2, 3, 4, 5];

/** c₀ + c₁α + c₂α², highest power first: "2α² + α + 1". */
export function alphaPoly(F: GF, u: readonly number[]): string {
  const terms: string[] = [];
  for (let d = 2; d >= 0; d--) {
    const c = u[d];
    if (c === 0) continue;
    const coef = d > 0 && c === 1 ? '' : F.label(c);
    terms.push(`${coef}${d === 0 ? '' : d === 1 ? 'α' : 'α²'}`);
  }
  return terms.length ? terms.join(' + ') : '0';
}

/** "α³ = α + 2" for the stored cubic [a, b, c]. */
export function cubicText(F: GF, cubic: Vec): string {
  return `α³ = ${alphaPoly(F, [cubic[2], cubic[1], cubic[0]])}`;
}

const pow = (i: number) => (i === 1 ? 'α' : `α${superscript(i)}`);

/**
 * `<div data-widget="field-points" data-q="3">`: GF(q³) as vectors over
 * GF(q). Step through the powers αⁱ: each is a vector (c₀, c₁, c₂), and its
 * projective point is the same for i, i + v, i + 2v, …, because those
 * powers differ by the scalars α^v, α^(2v), … of GF(q). So point i mod v is
 * well defined, and the table numbers every point of PG(2, q).
 */
export function mount(el: HTMLElement): void {
  let q = QS.includes(Number(el.dataset.q)) ? Number(el.dataset.q) : 3;
  let i = 4;

  const controls = h('div', { class: 'controls' });
  const rule = h('p', { class: 'ff-verdict ok fp-rule' });
  const current = h('div', { class: 'ff-info fp-current', attrs: { 'aria-live': 'polite' } });
  const same = h('div', { class: 'fp-same' });
  const table = h('div', { class: 'fp-table' });

  const render = () => {
    const S = singerFrame(q);
    const { F, v } = S;
    const N = q ** 3 - 1;
    i = ((i % N) + N) % N;
    const r = i % v;
    const u = S.powers[i];
    const pt = S.P.points[S.singerToPoint[r]];

    const input = h('input', {
      class: 'fp-i',
      attrs: { type: 'number', min: '0', max: String(N - 1), value: String(i), 'aria-label': 'exponent i' },
    });
    input.addEventListener('change', () => {
      const x = Number(input.value);
      if (Number.isInteger(x)) {
        i = x;
        render();
      }
    });
    const step = (d: number) =>
      Object.assign(h('button', { class: `ff-button fp-${d > 0 ? 'next' : 'prev'}`, text: d > 0 ? 'i + 1' : 'i − 1', attrs: { type: 'button' } }), {
        onclick: () => {
          i += d;
          render();
        },
      });
    controls.replaceChildren(
      selectControl(
        'q =',
        QS.map((x) => ({ value: String(x), label: String(x) })),
        String(q),
        (val) => {
          q = Number(val);
          render();
        },
        'fp-q',
      ).wrap,
      h('label', { class: 'control' }, 'i = ', input),
      step(-1),
      step(1),
    );

    rule.textContent =
      `GF(${q ** 3}) is built as c₀ + c₁α + c₂α² with coefficients in GF(${q}), using ${cubicText(F, S.cubic)}. ` +
      `Here v = ${q}² + ${q} + 1 = ${v} and α has order ${q}³ − 1 = ${N} = ${q - 1} × ${v}.`;

    current.replaceChildren(
      h('p', {}, h('strong', { text: `${pow(i)} = ${alphaPoly(F, u)}` }), ` is the vector ${formatVec(F, u)}.`),
      h('p', {
        text:
          `Its point is ${formatPoint(F, pt)}, the line through 0 and ${formatVec(F, u)}. ` +
          `It gets the number ${i} mod ${v} = ${r}: point ${r}.`,
      }),
    );

    // The q − 1 powers on the same line through 0.
    const rows = Array.from({ length: q - 1 }, (_, j) => r + j * v);
    same.replaceChildren(
      h('p', {
        class: 'pg-list-head',
        text: `The ${q - 1} powers of α that name point ${r}: multiply by ${pow(v)}, a number in GF(${q}), to get the next`,
      }),
      opTable({
        corner: 'power',
        rowHeads: rows.map(pow),
        colHeads: [`= scalar × ${pow(r)}`, 'vector', 'point'],
        cell: (row, col) => {
          const k = rows[row];
          if (col === 0) return `${F.label(S.powers[k - r][0])} × ${pow(r)}`;
          if (col === 1) return formatVec(F, S.powers[k]);
          return formatPoint(F, pt);
        },
        rowClass: (row) => (rows[row] === i ? 'fp-here' : ''),
        cls: 'fp-same-table',
      }),
    );

    table.replaceChildren(
      h('p', { class: 'pg-list-head', text: `All ${v} points of PG(2, ${q}), numbered by the first power of α that names each` }),
      opTable({
        corner: 'i',
        rowHeads: Array.from({ length: v }, (_, k) => String(k)),
        colHeads: ['αⁱ', 'vector', 'point'],
        cell: (row, col) => {
          const w = S.powers[row];
          if (col === 0) return alphaPoly(F, w);
          if (col === 1) return formatVec(F, w);
          return formatPoint(F, S.P.points[S.singerToPoint[row]]);
        },
        rowClass: (row) => (row === r ? 'fp-here' : ''),
        onRow: (row) => {
          i = row;
          render();
        },
        cls: 'fp-all-table',
      }),
    );
  };

  el.classList.add('widget', 'ff-widget', 'field-points');
  el.replaceChildren(controls, rule, current, same, table);
  render();
}
