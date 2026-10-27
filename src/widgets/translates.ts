import { differenceSetLambda, intersection, normalizeSet, translate, translateIntersections } from '../math/difference';
import { mod } from '../math/numbers';
import { circleSet, svgEl } from '../viz/circleSet';
import { CHANGE_EVENT, type ChangeDetail, latestChange, parseSet, PRESETS } from './differenceWorkbench';
import { setText } from './format';

/** Draw the v × v table of |(D + i) ∩ (D + j)|, with cell (i, j) selected. */
function intersectionTable(m: number[][], sel: [number, number]): SVGSVGElement {
  const v = m.length;
  const cell = v <= 13 ? 28 : 22;
  const head = 22;
  const size = head + v * cell;
  const svg = svgEl('svg', { viewBox: `0 0 ${size} ${size}`, class: 'meet-table', role: 'img' });
  svg.append(svgEl('title', {}, 'How many points D + i and D + j share, for every i and j'));
  for (let t = 0; t < v; t++) {
    const p = head + t * cell + cell / 2;
    svg.append(svgEl('text', { x: p, y: head - 7, class: 'tick' }, String(t)));
    svg.append(svgEl('text', { x: head - 8, y: p + 4, class: 'tick' }, String(t)));
  }
  for (let i = 0; i < v; i++) {
    for (let j = 0; j < v; j++) {
      const selected = i === sel[0] && j === sel[1];
      const g = svgEl('g', {
        class: ['cell', i === j ? 'diag' : 'off', selected ? 'selected' : ''].join(' ').trim(),
        'data-i': i,
        'data-j': j,
      });
      g.append(svgEl('rect', { x: head + j * cell, y: head + i * cell, width: cell, height: cell }));
      g.append(svgEl('text', { x: head + j * cell + cell / 2, y: head + i * cell + cell / 2 + 4 }, String(m[i][j])));
      svg.append(g);
    }
  }
  return svg;
}

function range(label: string, cls: string): [HTMLLabelElement, HTMLInputElement, HTMLOutputElement] {
  const wrap = document.createElement('label');
  wrap.className = 'control range';
  const input = document.createElement('input');
  input.type = 'range';
  input.className = cls;
  input.min = '0';
  const out = document.createElement('output');
  wrap.append(label, input, out);
  return [wrap, input, out];
}

/**
 * `<div data-widget="translates" data-v="7" data-set="0,1,3">`: compare two
 * translates D + i and D + j on the circle, and see how many points every pair
 * of translates shares. With `data-follow`, it tracks the set in a
 * difference workbench on the same page.
 */
export function mount(el: HTMLElement): void {
  let v = Number(el.dataset.v ?? 7);
  let set = normalizeSet(parseSet(el.dataset.set ?? '0,1,3'), v);
  if (el.hasAttribute('data-follow') && latestChange) ({ v, set } = latestChange);
  let i = 0;
  let j = Number(el.dataset.j ?? 1);

  const controls = document.createElement('div');
  controls.className = 'controls';
  let presetSelect: HTMLSelectElement | null = null;
  if (!el.hasAttribute('data-follow')) {
    const pLabel = document.createElement('label');
    pLabel.className = 'control';
    presetSelect = document.createElement('select');
    presetSelect.className = 'preset-select';
    PRESETS.forEach((p, n) => presetSelect!.append(new Option(`D = ${p.label}`, String(n))));
    const match = PRESETS.findIndex((p) => p.v === v && setText(p.set) === setText(set));
    if (match < 0) presetSelect.prepend(new Option(`D = ${setText(set)} mod ${v}`, ''));
    presetSelect.value = match < 0 ? '' : String(match);
    pLabel.append(presetSelect);
    controls.append(pLabel);
  }
  const [iWrap, iInput, iOut] = range('i = ', 'i-range');
  const [jWrap, jInput, jOut] = range('j = ', 'j-range');
  const step = document.createElement('button');
  step.type = 'button';
  step.className = 'step-button';
  step.textContent = 'j + 1';
  controls.append(iWrap, jWrap, step);

  const body = document.createElement('div');
  body.className = 'workbench-body';
  const circleBox = document.createElement('div');
  circleBox.className = 'circle-box';
  const side = document.createElement('div');
  side.className = 'workbench-side';
  const legend = document.createElement('p');
  legend.className = 'legend';
  const shared = document.createElement('p');
  shared.className = 'shared';
  shared.setAttribute('aria-live', 'polite');
  const tableBox = document.createElement('div');
  tableBox.className = 'table-box';
  const tableNote = document.createElement('p');
  tableNote.className = 'table-note';
  side.append(legend, shared, tableBox, tableNote);
  body.append(circleBox, side);

  const render = () => {
    iInput.max = jInput.max = String(v - 1);
    iInput.value = String(i);
    jInput.value = String(j);
    iOut.textContent = String(i);
    jOut.textContent = String(j);
    const a = translate(set, i, v);
    const b = translate(set, j, v);
    const both = intersection(a, b);
    circleBox.replaceChildren(circleSet({ v, set: a, other: b, title: `D + ${i} and D + ${j} mod ${v}` }));
    legend.innerHTML = '';
    const sa = document.createElement('span');
    sa.className = 'key key-a';
    sa.textContent = `D + ${i} = ${setText(a)}`;
    const sb = document.createElement('span');
    sb.className = 'key key-b';
    sb.textContent = `D + ${j} = ${setText(b)}`;
    legend.append(sa, sb);
    shared.textContent =
      i === j
        ? `The same translate: all ${a.length} points shared.`
        : `They share ${both.length} point${both.length === 1 ? '' : 's'}${both.length ? `: ${setText(both)}` : ''}. ` +
          `And j − i = ${j} − ${i} ≡ ${mod(j - i, v)} occurs ${both.length} time${both.length === 1 ? '' : 's'} as a difference of D.`;
    if (v <= 31) {
      const m = translateIntersections(set, v);
      tableBox.replaceChildren(intersectionTable(m, [i, j]));
      tableBox.hidden = false;
    } else {
      tableBox.hidden = true;
    }
    const lambda = set.length >= 2 ? differenceSetLambda(set, v) : null;
    tableNote.textContent =
      lambda !== null
        ? `Every entry off the diagonal is ${lambda}: any two different translates share exactly λ = ${lambda} point${lambda === 1 ? '' : 's'}.`
        : 'The entries off the diagonal are not all equal, so this D is not a difference set.';
    tableNote.classList.toggle('ok', lambda !== null);
  };

  iInput.addEventListener('input', () => {
    i = Number(iInput.value);
    render();
  });
  jInput.addEventListener('input', () => {
    j = Number(jInput.value);
    render();
  });
  step.addEventListener('click', () => {
    j = (j + 1) % v;
    render();
  });
  tableBox.addEventListener('click', (e) => {
    const g = (e.target as Element).closest<SVGGElement>('.cell');
    if (!g) return;
    i = Number(g.dataset.i);
    j = Number(g.dataset.j);
    render();
  });
  presetSelect?.addEventListener('change', () => {
    const p = PRESETS[Number(presetSelect!.value)];
    if (!p) return;
    v = p.v;
    set = p.set;
    i = 0;
    j = 1;
    render();
  });
  if (el.hasAttribute('data-follow')) {
    document.addEventListener(CHANGE_EVENT, (e) => {
      const { detail } = e as CustomEvent<ChangeDetail>;
      v = detail.v;
      set = detail.set;
      i = Math.min(i, v - 1);
      j = Math.min(j, v - 1);
      render();
    });
  }

  el.classList.add('widget', 'translates');
  el.replaceChildren(controls, body);
  render();
}
