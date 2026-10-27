import { isIrreducible, parsePoly } from '../math/field';
import * as euclid from './euclid';
import * as isomorphism from './fieldIsomorphism';
import * as frobenius from './frobenius';
import * as gfTables from './gfTables';
import * as powers from './powers';
import { type FieldChoice, fieldPicker, h, readField, selectControl } from './ui';
import * as znTables from './znTables';

const MAX = 256;
const MAX_TABLE = 64;

interface State {
  mode: 'zn' | 'gf';
  n: number;
  field: FieldChoice;
  g?: string;
  poly2?: string;
}

/**
 * `<div data-widget="field-calculator">`: the finite field calculator
 * playground. ℤ/vℤ mode (`?v=6`) shows its tables and Euclid's algorithm;
 * GF(p^e) mode (`?p=2&e=3&poly=1,1,0,1`, plus optional `g=` and `poly2=`)
 * shows tables, powers and logs, and the isomorphism finder.
 */
export function mount(el: HTMLElement): void {
  const params = new URLSearchParams(location.search);
  const n = Number(params.get('v') ?? params.get('n'));
  const state: State = {
    mode: params.has('v') || params.has('n') ? 'zn' : 'gf',
    n: Number.isInteger(n) && n >= 2 && n <= 24 ? n : 6,
    field: readField((name) => params.get(name), { p: 2, e: 3 }, MAX),
    g: params.get('g') ?? undefined,
    poly2: params.get('poly2') ?? undefined,
  };

  const top = h('div', { class: 'controls calc-mode' });
  const body = h('div', { class: 'calc-body' });

  const writeUrl = () => {
    const url = new URL(location.href);
    url.search = '';
    if (state.mode === 'zn') url.searchParams.set('v', String(state.n));
    else {
      url.searchParams.set('p', String(state.field.p));
      url.searchParams.set('e', String(state.field.e));
      url.searchParams.set('poly', state.field.poly.join(','));
      if (state.g) url.searchParams.set('g', state.g);
      if (state.poly2) url.searchParams.set('poly2', state.poly2);
    }
    history.replaceState(null, '', url.toString().replaceAll('%2C', ','));
  };

  const child = (mod: { mount(el: HTMLElement): void }, data: Record<string, string>) => {
    const div = h('div');
    for (const [k, v] of Object.entries(data)) div.dataset[k] = v;
    mod.mount(div);
    return div;
  };

  const section = (title: string, ...content: HTMLElement[]) => h('section', { class: 'calc-section' }, h('h2', { text: title }), ...content);

  const render = () => {
    top.replaceChildren(
      selectControl(
        'Mode:',
        [
          { value: 'zn', label: 'ℤ/vℤ (clock arithmetic)' },
          { value: 'gf', label: 'GF(pᵉ) (polynomials mod f)' },
        ],
        state.mode,
        (v) => {
          state.mode = v === 'zn' ? 'zn' : 'gf';
          writeUrl();
          render();
        },
        'calc-mode-select',
      ).wrap,
    );
    if (state.mode === 'zn') {
      const nSel = selectControl(
        'v =',
        Array.from({ length: 23 }, (_, i) => ({ value: String(i + 2), label: String(i + 2) })),
        String(state.n),
        (v) => {
          state.n = Number(v);
          writeUrl();
          render();
        },
        'calc-n',
      );
      top.append(nSel.wrap);
      body.replaceChildren(
        section('Tables', child(znTables, { v: String(state.n), fixed: '' })),
        section('Inverses by the extended Euclidean algorithm', child(euclid, { v: String(state.n), a: String(Math.min(state.n - 1, 2)) })),
      );
      return;
    }
    top.append(
      fieldPicker(
        state.field,
        (f) => {
          state.field = f;
          state.g = undefined;
          state.poly2 = undefined;
          writeUrl();
          render();
        },
        { max: MAX },
      ),
    );
    const { p, e, poly } = state.field;
    const fdata = { p: String(p), e: String(e), poly: poly.join(','), fixed: '' };
    const parts: HTMLElement[] = [];
    if (p ** e <= MAX_TABLE) parts.push(section('Tables', child(gfTables, fdata)));
    else parts.push(section('Tables', h('p', { text: `Tables are shown for fields of up to ${MAX_TABLE} elements.` })));
    if (isIrreducible(poly, p)) {
      parts.push(section('Powers, order, and logs', child(powers, { ...fdata, ...(state.g ? { g: state.g } : {}) })));
      if (p ** e <= MAX_TABLE && e > 1) {
        parts.push(section('Frobenius: x ↦ x^q and its fixed points', child(frobenius, { field: String(p ** e), poly: poly.join(','), fixed: '' })));
      }
      if (p ** e <= MAX_TABLE) {
        const b = parsePoly(state.poly2);
        parts.push(
          section(
            'Isomorphism finder',
            child(isomorphism, { p: String(p), e: String(e), a: poly.join(','), ...(b ? { b: b.join(',') } : {}), fixed: '' }),
          ),
        );
      }
    } else {
      parts.push(section('Powers and isomorphisms', h('p', { text: 'This modulus is reducible, so these remainders do not form a field. Pick an irreducible modulus to see powers, logs, and isomorphisms.' })));
    }
    body.replaceChildren(...parts);
  };

  el.addEventListener('ff-state', (ev) => {
    const d = (ev as CustomEvent<Record<string, string>>).detail;
    if (d.g !== undefined) state.g = d.g;
    if (d.poly2 !== undefined) state.poly2 = d.poly2;
    if (d.poly !== undefined && ev.target !== el) {
      const f = parsePoly(d.poly);
      if (f && f.length === state.field.e + 1) {
        state.field = { ...state.field, poly: f };
        state.g = undefined;
        writeUrl();
        render();
        return;
      }
    }
    writeUrl();
  });

  el.classList.add('widget', 'field-calculator');
  el.replaceChildren(top, body);
  render();
  writeUrl();
}
