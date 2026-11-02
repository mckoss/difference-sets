import {
  agreements,
  BENT_PRESETS,
  bestAffineRule,
  bits,
  isBent,
  randomFunction,
  ruleName,
  support,
  xorDifferenceCounts,
  xorDifferenceSetLambda,
} from '../math/bent';
import { mulberry32 } from '../math/random';
import { svgEl } from '../viz/circleSet';

const N = 4;
const SIZE = 1 << N;

/** An `<option>` (built by hand; `new Option` is missing in some test DOMs). */
function option(text: string, value: string): HTMLOptionElement {
  const o = document.createElement('option');
  o.textContent = text;
  o.value = value;
  return o;
}

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls = '', text?: string): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

/** The 4 × 4 grid of inputs: rows are x1x2, columns x3x4. Each cell is a toggle button. */
function inputGrid(f: readonly number[]): HTMLTableElement {
  const table = el('table', 'bent-grid');
  table.append(el('caption', '', 'The 16 inputs x1x2x3x4 (rows: x1x2, columns: x3x4). Shaded: f = 1.'));
  const head = el('tr');
  head.append(el('th', 'corner'));
  for (let c = 0; c < 4; c++) head.append(el('th', '', bits(c, 2)));
  table.append(el('thead'));
  table.tHead!.append(head);
  const body = el('tbody');
  for (let r = 0; r < 4; r++) {
    const tr = el('tr');
    const th = el('th', '', bits(r, 2));
    th.scope = 'row';
    tr.append(th);
    for (let c = 0; c < 4; c++) {
      const x = r * 4 + c;
      const b = el('button', `bent-cell${f[x] ? ' on' : ''}`);
      b.type = 'button';
      b.dataset.x = String(x);
      b.setAttribute('aria-pressed', String(f[x] === 1));
      b.setAttribute('aria-label', `Input ${bits(x, N)}: f = ${f[x]}`);
      b.append(el('span', 'cell-bits', bits(x, N)), el('span', 'cell-f', `f = ${f[x]}`));
      const td = el('td');
      td.append(b);
      tr.append(td);
    }
    body.append(tr);
  }
  table.append(body);
  return table;
}

/** Bars for |D ∩ (D ⊕ a)|, for a = 0001 … 1111. */
function overlapChart(counts: readonly number[], k: number): SVGSVGElement {
  const step = 24;
  const left = 22;
  const top = 8;
  const plot = 120;
  const max = Math.max(8, k);
  const unit = plot / max;
  const width = left + (SIZE - 1) * step + 6;
  const svg = svgEl('svg', { viewBox: `0 0 ${width} ${top + plot + 46}`, class: 'xor-overlap', role: 'img' });
  svg.append(
    svgEl('title', {}, `Overlap of D with D ⊕ a for each nonzero a: ${counts.slice(1).join(', ')}`),
  );
  for (const y of [0, max / 2, max]) {
    const py = top + plot - y * unit;
    svg.append(svgEl('line', { x1: left, x2: width, y1: py, y2: py, class: 'grid-line' }));
    svg.append(svgEl('text', { x: left - 5, y: py + 4, class: 'axis' }, String(y)));
  }
  for (let a = 1; a < SIZE; a++) {
    const x = left + (a - 1) * step;
    const g = svgEl('g', { class: 'overlap', 'data-a': a });
    const hgt = counts[a] * unit;
    g.append(svgEl('rect', { x: x + 3, y: top + plot - hgt, width: step - 6, height: hgt }));
    g.append(svgEl('text', { x: x + step / 2, y: top + plot - hgt - 4, class: 'value' }, String(counts[a])));
    const lx = x + step / 2;
    const ly = top + plot + 8;
    g.append(svgEl('text', { x: lx, y: ly, class: 'tick', transform: `rotate(90 ${lx} ${ly})` }, bits(a, N)));
    svg.append(g);
  }
  return svg;
}

/** One row per linear rule a·x: how many of the 16 inputs it matches f on. */
function ruleList(f: readonly number[], best: number): HTMLOListElement {
  const list = el('ol', 'rule-list');
  agreements(f).forEach((m, a) => {
    const li = el('li', Math.abs(m - SIZE / 2) > 2 ? 'close' : 'far');
    if (a === best) li.classList.add('best');
    li.dataset.a = String(a);
    li.dataset.matches = String(m);
    const bar = el('span', 'rule-bar');
    const fill = el('span', 'rule-fill');
    fill.style.width = `${(100 * m) / SIZE}%`;
    bar.append(fill, el('span', 'rule-mid'));
    li.append(el('span', 'rule-name', a === 0 ? '0 (always 0)' : ruleName(a, N)), bar, el('span', 'rule-count', `${m} of ${SIZE}`));
    list.append(li);
  });
  return list;
}

/**
 * `<div data-widget="bent-function" data-preset="x1x2+x3x4">`: a Boolean
 * function on 4 bits, edited by clicking its 16 inputs. Shows how much the
 * set D where f = 1 overlaps each XOR-shift D ⊕ a, how often each linear rule
 * a·x matches f, and whether f is bent.
 */
export function mount(root: HTMLElement): void {
  const start = BENT_PRESETS.find((p) => p.id === root.dataset.preset) ?? BENT_PRESETS[0];
  let f = [...start.f];
  let seed = Number(root.dataset.seed ?? 1) || 1;

  const controls = el('div', 'controls');
  const presetSelect = el('select', 'preset-select');
  presetSelect.setAttribute('aria-label', 'Function');
  for (const p of BENT_PRESETS) presetSelect.append(option(`f = ${p.label}`, p.id));
  presetSelect.append(option('Your own (click the inputs)', 'custom'));
  presetSelect.value = start.id;
  const randomButton = el('button', 'random-button', 'Random');
  randomButton.type = 'button';
  controls.append(presetSelect, randomButton);

  const box = el('div', 'bent-box');
  const grid = el('div', 'bent-grid-wrap');
  const info = el('p', 'bent-info');
  info.setAttribute('aria-live', 'polite');
  const overlapHead = el('h4', '', 'How much D overlaps each shift D ⊕ a');
  const overlap = el('div', 'overlap-figure');
  const overlapNote = el('p', 'table-note overlap-note');
  const ruleHead = el('h4', '', 'How many inputs each linear rule a·x gets right');
  const rules = el('div', 'rule-figure');
  const verdict = el('p', 'verdict');
  verdict.setAttribute('aria-live', 'polite');
  box.append(grid, info, overlapHead, overlap, overlapNote, ruleHead, rules, verdict);

  const render = (focusX?: number) => {
    const D = support(f);
    const k = D.length;
    grid.replaceChildren(inputGrid(f));
    info.textContent = `D = {${D.map((x) => bits(x, N)).join(', ')}} has k = ${k} of the ${SIZE} inputs.`;

    const counts = xorDifferenceCounts(D, N);
    const lambda = xorDifferenceSetLambda(D, N);
    overlap.replaceChildren(overlapChart(counts, k));
    const nontrivial = k >= 2 && k <= SIZE - 2;
    overlapNote.classList.toggle('ok', lambda !== null && nontrivial);
    const nonzero = counts.slice(1);
    overlapNote.textContent =
      lambda !== null && nontrivial
        ? `Every shift overlaps D in exactly ${lambda} inputs: D is a (${SIZE}, ${k}, ${lambda}) difference set under XOR.`
        : lambda !== null
          ? `Every shift overlaps D in ${lambda} inputs, but only because D is ${k <= 1 ? 'almost empty' : 'almost everything'}.`
          : `Overlaps range from ${Math.min(...nonzero)} to ${Math.max(...nonzero)}: not a difference set.`;

    const best = bestAffineRule(f);
    rules.replaceChildren(ruleList(f, best.a));
    const bent = isBent(f);
    verdict.className = `verdict ${bent ? 'ok' : 'bad'}`;
    verdict.textContent = bent
      ? `Bent: every linear rule is wrong on at least ${SIZE - best.matches} of ${SIZE} inputs.`
      : `${best.a === 0 ? `The constant rule ${best.name}` : `Rule ${best.name}`} matches f on ${best.matches} of ${SIZE} inputs — a linear attack would use it.`;
    if (focusX !== undefined) grid.querySelector<HTMLButtonElement>(`[data-x="${focusX}"]`)?.focus();
  };

  grid.addEventListener('click', (e) => {
    const b = (e.target as Element).closest<HTMLButtonElement>('[data-x]');
    if (!b) return;
    const x = Number(b.dataset.x);
    f[x] ^= 1;
    presetSelect.value = 'custom';
    render(x);
  });
  presetSelect.addEventListener('change', () => {
    const p = BENT_PRESETS.find((q) => q.id === presetSelect.value);
    if (!p) return;
    f = [...p.f];
    render();
  });
  randomButton.addEventListener('click', () => {
    f = randomFunction(N, mulberry32(seed++));
    presetSelect.value = 'custom';
    render();
  });

  root.classList.add('widget', 'bent-function');
  root.replaceChildren(controls, box);
  render();
}
