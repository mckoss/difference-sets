// Small DOM helpers shared by the finite field widgets.

import { firstPrimitivePoly, monicPolys, parsePoly, polyKind } from '../math/field';
import { type Poly, polyFormat } from '../math/poly';

type Child = Node | string | null | undefined | false;

export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: { class?: string; text?: string; attrs?: Record<string, string> } = {},
  ...children: Child[]
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  if (props.class) el.className = props.class;
  if (props.text !== undefined) el.textContent = props.text;
  for (const [k, v] of Object.entries(props.attrs ?? {})) el.setAttribute(k, v);
  for (const c of children) if (c) el.append(c);
  return el;
}

export interface Choice {
  value: string;
  label: string;
  group?: string;
}

/** A labeled <select>. Options with a `group` are placed in optgroups. */
export function selectControl(
  label: string,
  choices: Choice[],
  value: string,
  onChange: (value: string) => void,
  cls = '',
): { wrap: HTMLLabelElement; select: HTMLSelectElement } {
  const select = h('select', { class: cls });
  const groups = new Map<string, HTMLOptGroupElement>();
  for (const c of choices) {
    const opt = new Option(c.label, c.value);
    if (c.group) {
      let g = groups.get(c.group);
      if (!g) {
        g = h('optgroup', { attrs: { label: c.group } });
        groups.set(c.group, g);
        select.append(g);
      }
      g.append(opt);
    } else {
      select.append(opt);
    }
  }
  select.value = value;
  select.addEventListener('change', () => onChange(select.value));
  const wrap = h('label', { class: 'control' }, `${label} `, select);
  return { wrap, select };
}

export function button(text: string, onClick: () => void, cls = ''): HTMLButtonElement {
  const b = h('button', { class: `ff-button ${cls}`.trim(), text, attrs: { type: 'button' } });
  b.addEventListener('click', onClick);
  return b;
}

export interface TableSpec {
  caption?: string;
  corner: string;
  rowHeads: string[];
  colHeads: string[];
  cell: (r: number, c: number) => string;
  cellClass?: (r: number, c: number) => string;
  rowClass?: (r: number) => string;
  colClass?: (c: number) => string;
  /** Called when a row header is clicked. */
  onRow?: (r: number) => void;
  cls?: string;
}

/** An operation table inside its own horizontal scroller, with sticky headers. */
export function opTable(spec: TableSpec): HTMLElement {
  const table = h('table', { class: `ff-table ${spec.cls ?? ''}`.trim() });
  if (spec.caption) table.append(h('caption', { text: spec.caption }));
  const head = h('tr', {}, h('th', { class: 'corner', text: spec.corner, attrs: { scope: 'col' } }));
  spec.colHeads.forEach((t, c) => head.append(h('th', { class: spec.colClass?.(c) ?? '', text: t, attrs: { scope: 'col' } })));
  table.append(h('thead', {}, head));
  const body = h('tbody');
  spec.rowHeads.forEach((t, r) => {
    const tr = h('tr', { class: spec.rowClass?.(r) ?? '' });
    const th = h('th', { text: t, attrs: { scope: 'row' } });
    if (spec.onRow) {
      th.tabIndex = 0;
      th.classList.add('clickable');
      th.addEventListener('click', () => spec.onRow!(r));
      th.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          spec.onRow!(r);
        }
      });
    }
    tr.append(th);
    spec.colHeads.forEach((_, c) => tr.append(h('td', { class: spec.cellClass?.(r, c) ?? '', text: spec.cell(r, c) })));
    body.append(tr);
  });
  table.append(body);
  return h('div', { class: 'ff-scroll' }, table);
}

// ---------------------------------------------------------------------------
// Field selection shared by the GF(p^k) widgets

export const PRIMES = [2, 3, 5, 7];

/** A field choice: q = p^e elements, built modulo a monic poly of degree e over GF(p). */
export interface FieldChoice {
  p: number;
  e: number;
  poly: Poly;
}

/** Largest field size the pickers offer. */
export const MAX_FIELD = 729;

export function eOptions(p: number, max = MAX_FIELD): number[] {
  const es: number[] = [];
  for (let e = 1; p ** e <= max; e++) es.push(e);
  return es;
}

/** Read p, k, and a modulus from data attributes (or URL params), falling back to a primitive polynomial. */
export function readField(
  get: (name: string) => string | null | undefined,
  defaults: { p: number; e: number },
  max = MAX_FIELD,
): FieldChoice {
  let p = Number(get('p'));
  if (!PRIMES.includes(p)) p = defaults.p;
  let e = Number(get('e') ?? get('k'));
  const es = eOptions(p, max);
  if (!es.includes(e)) e = es.includes(defaults.e) ? defaults.e : es[es.length - 1];
  const parsed = parsePoly(get('poly'));
  const poly =
    parsed && parsed.length === e + 1 && parsed[e] === 1 && parsed.every((c) => c < p) ? parsed : firstPrimitivePoly(p, e);
  return { p, e, poly };
}

const KIND_GROUP = { primitive: 'Primitive', irreducible: 'Irreducible, not primitive', reducible: 'Reducible' };

export function modulusChoices(p: number, e: number, onlyIrreducible = false): Choice[] {
  const order = ['primitive', 'irreducible', 'reducible'] as const;
  const all = monicPolys(p, e).map((f) => ({ f, kind: polyKind(f, p) }));
  return order
    .filter((kind) => !onlyIrreducible || kind !== 'reducible')
    .flatMap((kind) =>
      all
        .filter((x) => x.kind === kind)
        .map((x) => ({ value: x.f.join(','), label: polyFormat(x.f), group: KIND_GROUP[kind] })),
    );
}

/** p, e, and modulus selectors. Changing p or e picks the first primitive polynomial. */
export function fieldPicker(
  initial: FieldChoice,
  onChange: (f: FieldChoice) => void,
  opts: { max?: number; onlyIrreducible?: boolean; modulusLabel?: string } = {},
): HTMLElement {
  const wrap = h('div', { class: 'controls' });
  let state = { ...initial };
  const draw = () => {
    const pSel = selectControl(
      'p =',
      PRIMES.map((p) => ({ value: String(p), label: String(p) })),
      String(state.p),
      (v) => {
        const p = Number(v);
        const es = eOptions(p, opts.max);
        const e = es.includes(state.e) ? state.e : es[es.length - 1];
        set({ p, e, poly: firstPrimitivePoly(p, e) });
      },
      'ff-p',
    );
    const eSel = selectControl(
      'e =',
      eOptions(state.p, opts.max).map((e) => ({ value: String(e), label: String(e) })),
      String(state.e),
      (v) => set({ p: state.p, e: Number(v), poly: firstPrimitivePoly(state.p, Number(v)) }),
      'ff-e',
    );
    const fSel = selectControl(
      opts.modulusLabel ?? 'modulus f(x) =',
      modulusChoices(state.p, state.e, opts.onlyIrreducible),
      state.poly.join(','),
      (v) => set({ ...state, poly: v.split(',').map(Number) }),
      'ff-poly',
    );
    wrap.replaceChildren(pSel.wrap, eSel.wrap, fSel.wrap);
  };
  const set = (f: FieldChoice) => {
    state = f;
    draw();
    onChange(f);
  };
  draw();
  return wrap;
}

/** Tell an enclosing playground that this widget's shareable state changed. */
export function emitState(el: HTMLElement, state: Record<string, string>): void {
  el.dispatchEvent(new CustomEvent('ff-state', { detail: state, bubbles: true }));
}
