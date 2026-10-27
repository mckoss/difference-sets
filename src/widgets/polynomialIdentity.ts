import { characterPath, identityForm, productCoefficients } from '../math/groupRing';
import { mod } from '../math/numbers';
import { circleSet, svgEl } from '../viz/circleSet';
import { parseSet } from './differenceWorkbench';
import { setText } from './format';

interface Preset {
  label: string;
  v: number;
  set: number[];
}

const PRESETS: Preset[] = [
  { label: '{0, 1, 3} mod 7 (order 2)', v: 7, set: [0, 1, 3] },
  { label: '{0, 1, 2} mod 7 (not a difference set)', v: 7, set: [0, 1, 2] },
  { label: '{0, 1, 3, 9} mod 13 (order 3)', v: 13, set: [0, 1, 3, 9] },
  { label: '{0, 1, 4, 14, 16} mod 21 (order 4)', v: 21, set: [0, 1, 4, 14, 16] },
  { label: '{0, 1, 2, 4, 5, 8, 10} mod 15 (λ = 3)', v: 15, set: [0, 1, 2, 4, 5, 8, 10] },
];

const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const sup = (n: number) => [...String(n)].map((d) => SUP[Number(d)]).join('');
/** x^e as text: "1", "x", "x³". */
const power = (e: number) => (e === 0 ? '1' : e === 1 ? 'x' : `x${sup(e)}`);
/** c·x^e as text, with c omitted when it is 1. */
const term = (c: number, e: number) => (c === 1 ? power(e) : e === 0 ? String(c) : `${c}${power(e)}`);

function polyText(coeffs: readonly number[]): string {
  const terms = coeffs.flatMap((c, e) => (c ? [term(c, e)] : []));
  return terms.length ? terms.join(' + ') : '0';
}

/** The k × k table of x^a · x^(−b) = x^(a−b mod v). */
function productTable(set: readonly number[], v: number): HTMLTableElement {
  const table = document.createElement('table');
  table.className = 'product-table';
  const head = document.createElement('tr');
  head.append(document.createElement('th'));
  for (const b of set) {
    const th = document.createElement('th');
    th.textContent = `x${sup(mod(-b, v))}`.replace(/^x⁰$/, '1');
    th.title = `x to the −${b}, which is x to the ${mod(-b, v)} mod x^${v} − 1`;
    head.append(th);
  }
  table.append(head);
  for (const a of set) {
    const tr = document.createElement('tr');
    const th = document.createElement('th');
    th.textContent = power(a);
    tr.append(th);
    for (const b of set) {
      const e = mod(a - b, v);
      const td = document.createElement('td');
      td.textContent = power(e);
      td.dataset.e = String(e);
      if (e === 0) td.className = 'diag';
      td.tabIndex = 0;
      tr.append(td);
    }
    table.append(tr);
  }
  return table;
}

/** Unit arrows head to tail for D at a j-turn, with the circle of radius √m. */
function arrowsPicture(set: readonly number[], v: number, j: number, m: number | null): SVGSVGElement {
  const { path } = characterPath(set, v, j);
  const k = set.length;
  const extent = Math.max(
    1.5,
    Math.sqrt(m ?? 0) + 0.5,
    ...path.map(([x, y]) => Math.max(Math.abs(x), Math.abs(y)) + 0.5),
  );
  const size = 260;
  const s = size / (2 * extent);
  const X = (x: number) => size / 2 + x * s;
  const Y = (y: number) => size / 2 - y * s;
  const svg = svgEl('svg', { viewBox: `0 0 ${size} ${size}`, class: 'arrows', role: 'img' });
  svg.append(svgEl('title', {}, `The ${k} arrows of D added head to tail at a ${j}-turn`));
  svg.append(svgEl('line', { x1: 0, x2: size, y1: Y(0), y2: Y(0), class: 'axis' }));
  svg.append(svgEl('line', { x1: X(0), x2: X(0), y1: 0, y2: size, class: 'axis' }));
  if (m !== null && m > 0) svg.append(svgEl('circle', { cx: X(0), cy: Y(0), r: Math.sqrt(m) * s, class: 'target-circle' }));
  for (let i = 1; i < path.length; i++) {
    const [x1, y1] = path[i - 1];
    const [x2, y2] = path[i];
    svg.append(svgEl('line', { x1: X(x1), y1: Y(y1), x2: X(x2), y2: Y(y2), class: 'step' }));
    svg.append(svgEl('circle', { cx: X(x2), cy: Y(y2), r: 2.5, class: 'step-head' }));
  }
  const [ex, ey] = path[path.length - 1];
  svg.append(svgEl('line', { x1: X(0), y1: Y(0), x2: X(ex), y2: Y(ey), class: 'total' }));
  svg.append(svgEl('circle', { cx: X(0), cy: Y(0), r: 3, class: 'origin' }));
  return svg;
}

/**
 * `<div data-widget="polynomial-identity" data-v="7" data-set="0,1,3">`: the
 * set D as the polynomial D(x), the product D(x) · D(x⁻¹) worked out term by
 * term mod x^v − 1, and the check that it equals n + (1 + x + … + x^(v−1)).
 * Underneath, x becomes a turn of the circle and D(x) a chain of arrows,
 * whose total always has length √n for a planar difference set.
 */
export function mount(el: HTMLElement): void {
  let v = Number(el.dataset.v ?? 7);
  let set = parseSet(el.dataset.set ?? '0,1,3').map((x) => mod(x, v));
  let j = 1;

  const controls = document.createElement('div');
  controls.className = 'controls';
  const presetLabel = document.createElement('label');
  presetLabel.className = 'control';
  const preset = document.createElement('select');
  preset.className = 'preset-select';
  PRESETS.forEach((p, i) => preset.append(new Option(p.label, String(i))));
  presetLabel.append('Set ', preset);
  controls.append(presetLabel);

  const hint = document.createElement('p');
  hint.className = 'hint';
  hint.textContent = 'Click points on the circle to add or remove them.';
  const circleBox = document.createElement('div');
  circleBox.className = 'circle-box';
  const top = document.createElement('div');
  top.className = 'identity-top';
  const polys = document.createElement('div');
  polys.className = 'identity-polys';
  top.append(circleBox, polys);

  const tableHeading = document.createElement('p');
  tableHeading.className = 'widget-heading';
  tableHeading.textContent = 'Multiply every term by every term';
  const tableBox = document.createElement('div');
  tableBox.className = 'table-scroll';
  const collected = document.createElement('p');
  collected.className = 'identity-collected';
  const verdict = document.createElement('p');
  verdict.className = 'identity-verdict table-note';
  verdict.setAttribute('aria-live', 'polite');
  const atOne = document.createElement('p');
  atOne.className = 'identity-at-one';

  const arrowHeading = document.createElement('p');
  arrowHeading.className = 'widget-heading';
  arrowHeading.textContent = 'Replace x by a turn';
  const turnLabel = document.createElement('label');
  turnLabel.className = 'control range';
  const turn = document.createElement('input');
  turn.type = 'range';
  turn.min = '1';
  turn.className = 'turn-input';
  const turnOut = document.createElement('output');
  turnLabel.append('turn j = ', turn, turnOut);
  const arrowBody = document.createElement('div');
  arrowBody.className = 'identity-arrows';
  const arrowBox = document.createElement('div');
  const arrowNote = document.createElement('p');
  arrowNote.className = 'arrow-note';
  arrowBody.append(arrowBox, arrowNote);

  const render = () => {
    set = [...new Set(set)].sort((a, b) => a - b);
    const k = set.length;
    const svg = circleSet({ v, set, interactive: true, title: `The set ${setText(set)} mod ${v}` });
    circleBox.replaceChildren(svg);

    const coeffs = productCoefficients(set, v);
    const form = k >= 2 ? identityForm(set, v) : null;
    const dCoeffs = new Array<number>(v).fill(0);
    for (const a of set) dCoeffs[a] = 1;
    const invCoeffs = new Array<number>(v).fill(0);
    for (const a of set) invCoeffs[mod(-a, v)] = 1;
    const inverseTerms = set.map((a) => (a === 0 ? '1' : `x⁻${sup(a)}`)).join(' + ');
    polys.innerHTML = '';
    const p1 = document.createElement('p');
    p1.className = 'poly-line';
    p1.textContent = `D(x) = ${polyText(dCoeffs)}`;
    const p2 = document.createElement('p');
    p2.className = 'poly-line';
    p2.textContent = `D(x⁻¹) = ${inverseTerms || '0'} = ${polyText(invCoeffs)}`;
    const p3 = document.createElement('p');
    p3.className = 'hint';
    p3.textContent = `Working mod x${sup(v)} − 1 means x${sup(v)} counts as 1, so x⁻¹ is x${sup(v - 1)}, x⁻² is x${sup(v - 2)}, and so on: exponents wrap around the clock.`;
    polys.append(p1, p2, p3);

    tableBox.replaceChildren(k ? productTable(set, v) : document.createTextNode('Pick some points.'));
    collected.textContent = `Collect the ${k * k} terms: D(x) · D(x⁻¹) = ${polyText(coeffs)}`;

    const ones = Array.from({ length: v }, (_, e) => power(e));
    const allPowers = v <= 8 ? ones.join(' + ') : `${ones.slice(0, 3).join(' + ')} + … + ${power(v - 1)}`;
    if (form) {
      const { m, lambda } = form;
      verdict.className = 'identity-verdict table-note ok';
      verdict.textContent =
        `= ${m} + ${lambda === 1 ? '' : `${lambda}·`}(${allPowers}). Every power of x from x to ${power(v - 1)} appears ` +
        `exactly λ = ${lambda} time${lambda === 1 ? '' : 's'}, so D is a (${v}, ${k}, ${lambda}) difference set` +
        (lambda === 1 ? ` of order n = ${m}.` : '.');
    } else {
      const missing = coeffs.slice(1).flatMap((c, i) => (c === 0 ? [power(i + 1)] : []));
      const extra = coeffs.slice(1).flatMap((c, i) => (c > 1 ? [power(i + 1)] : []));
      verdict.className = 'identity-verdict table-note bad';
      verdict.textContent =
        k < 2
          ? 'Pick at least two points.'
          : `Not of the form m + λ(${allPowers}): the powers x to ${power(v - 1)} don't all appear equally often.` +
            (missing.length ? ` Missing: ${missing.join(', ')}.` : '') +
            (extra.length ? ` More than once: ${extra.join(', ')}.` : '');
    }
    atOne.textContent =
      `Put x = 1: every power of x becomes 1, so the left side is D(1)² = ${k}² = ${k * k}` +
      (form ? `, and the right side is ${form.m} + ${form.lambda}·${v} = ${form.m + form.lambda * v}.` : '.');

    turn.max = String(v - 1);
    j = Math.min(Math.max(1, j), v - 1);
    turn.value = String(j);
    turnOut.textContent = String(j);
    const { length } = characterPath(set, v, j);
    arrowBox.replaceChildren(arrowsPicture(set, v, j, form?.m ?? null));
    arrowNote.textContent =
      `Each member d becomes an arrow of length 1 pointing ${j}·d/${v} of a full turn around. Added head to tail, ` +
      `the ${k} arrows end at distance ${length.toFixed(3)} from the start` +
      (form
        ? ` = √${form.m} (the dashed circle), whatever j is.`
        : '. For a difference set this distance would be the same for every turn j.');
  };

  preset.addEventListener('change', () => {
    const p = PRESETS[Number(preset.value)];
    v = p.v;
    set = [...p.set];
    render();
  });
  circleBox.addEventListener('click', (e) => {
    const g = (e.target as Element).closest<SVGGElement>('[data-point]');
    if (!g) return;
    const i = Number(g.dataset.point);
    set = set.includes(i) ? set.filter((x) => x !== i) : [...set, i];
    render();
    circleBox.querySelector<SVGGElement>(`[data-point="${i}"]`)?.focus();
  });
  circleBox.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const g = (e.target as Element).closest<SVGGElement>('[data-point]');
    if (!g) return;
    e.preventDefault();
    g.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  turn.addEventListener('input', () => {
    j = Number(turn.value);
    render();
  });
  // Point at one cell to light up every cell with the same power.
  const light = (e: Event) => {
    const td = (e.target as Element).closest<HTMLElement>('td[data-e]');
    for (const c of tableBox.querySelectorAll<HTMLElement>('td[data-e]')) {
      c.classList.toggle('same', !!td && c.dataset.e === td.dataset.e);
    }
  };
  tableBox.addEventListener('mouseover', light);
  tableBox.addEventListener('focusin', light);

  el.classList.add('widget', 'polynomial-identity');
  el.replaceChildren(controls, hint, top, tableHeading, tableBox, collected, verdict, atOne, arrowHeading, turnLabel, arrowBody);
  const match = PRESETS.findIndex((p) => p.v === v && p.set.join() === set.join());
  preset.value = String(Math.max(0, match));
  render();
}
