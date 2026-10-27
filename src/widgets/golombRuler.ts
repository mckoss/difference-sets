import { mod } from '../math/numbers';
import { bestCut, gaps, linearDistanceCounts, rulerLength, unwind } from '../math/ruler';
import { singerSet } from '../math/singer';
import { svgEl } from '../viz/circleSet';
import { setText } from './format';

interface RulerPreset {
  v: number;
  set: number[];
}

const PRESETS: RulerPreset[] = [
  { v: 7, set: [0, 1, 3] },
  { v: 13, set: [0, 1, 3, 9] },
  { v: 21, set: [0, 1, 4, 14, 16] },
  { v: 31, set: singerSet(5) },
];

/** An `<option>` (built by hand; `new Option` is missing in some test DOMs). */
function option(text: string, value: string): HTMLOptionElement {
  const o = document.createElement('option');
  o.textContent = text;
  o.value = value;
  return o;
}

function button(text: string, cls: string): HTMLButtonElement {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = cls;
  b.textContent = text;
  return b;
}

/** Make an SVG group act as a toggle button. */
function asButton(g: SVGGElement, label: string, pressed: boolean): void {
  g.setAttribute('role', 'button');
  g.setAttribute('tabindex', '0');
  g.setAttribute('aria-label', label);
  g.setAttribute('aria-pressed', String(pressed));
}

/** A clockwise arc from mark a to mark b at radius r, as an SVG path. */
function arcPath(cx: number, cy: number, r: number, a: number, b: number, v: number): string {
  const ang = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / v;
  const steps = mod(b - a, v);
  const [x1, y1] = [cx + r * Math.cos(ang(a)), cy + r * Math.sin(ang(a))];
  const [x2, y2] = [cx + r * Math.cos(ang(b)), cy + r * Math.sin(ang(b))];
  return `M ${x1} ${y1} A ${r} ${r} 0 ${steps > v / 2 ? 1 : 0} 1 ${x2} ${y2}`;
}

/** The circular ruler: v ticks, the marks of D, and the two arcs between the selected marks. */
function circleRuler(v: number, set: readonly number[], sel: number[]): SVGSVGElement {
  const r = Math.max(84, (16 * v) / (2 * Math.PI));
  const pad = 34;
  const size = 2 * (r + pad);
  const c = size / 2;
  const ang = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / v;
  const at = (i: number, rad: number): [number, number] => [c + rad * Math.cos(ang(i)), c + rad * Math.sin(ang(i))];
  const svg = svgEl('svg', { viewBox: `0 0 ${size} ${size}`, class: 'ruler-circle', role: 'group' });
  svg.append(svgEl('title', {}, `A circular ruler with ${v} steps and marks at ${setText(set)}`));
  svg.append(svgEl('circle', { cx: c, cy: c, r, class: 'rim' }));
  for (let i = 0; i < v; i++) {
    const [x1, y1] = at(i, r - 4);
    const [x2, y2] = at(i, r + 4);
    svg.append(svgEl('line', { x1, y1, x2, y2, class: 'tick-mark' }));
  }
  if (sel.length === 2) {
    // The two marks split the circle into two arcs: d steps clockwise from a
    // to b, and v − d steps on from b back to a.
    const [a, b] = sel;
    const d = mod(b - a, v);
    for (const [from, to, cls, len] of [
      [a, b, 'arc-a', d],
      [b, a, 'arc-b', v - d],
    ] as const) {
      svg.append(svgEl('path', { d: arcPath(c, c, r - 11, from, to, v), class: `arc ${cls}` }));
      const [lx, ly] = at(from + mod(to - from, v) / 2, r - 30);
      svg.append(svgEl('text', { x: lx, y: ly + 5, class: `arc-label ${cls}` }, String(len)));
    }
  }
  for (const x of set) {
    const g = svgEl('g', { class: `mark${sel.includes(x) ? ' selected' : ''}`, 'data-mark': x });
    asButton(g, `Mark ${x}`, sel.includes(x));
    const [px, py] = at(x, r);
    g.append(svgEl('circle', { cx: px, cy: py, r: 13, class: 'hit' }));
    g.append(svgEl('circle', { cx: px, cy: py, r: 7, class: 'dot' }));
    const [tx, ty] = at(x, r + 20);
    g.append(svgEl('text', { x: tx, y: ty + 4, class: 'mark-label' }, String(x)));
    svg.append(g);
  }
  return svg;
}

/** The straight ruler after cutting: antennas at the marks, and a tick for every step. */
function straightRuler(marks: readonly number[], origin: readonly number[], sel: number[]): SVGSVGElement {
  const L = rulerLength(marks);
  const unit = Math.min(36, 560 / Math.max(L, 1));
  const left = 16;
  const width = left * 2 + L * unit;
  const base = 62;
  const svg = svgEl('svg', { viewBox: `0 0 ${width} ${base + 26}`, class: 'ruler-line', role: 'group', style: `max-width: ${Math.round(width * 1.4)}px` });
  svg.append(svgEl('title', {}, `A straight array of antennas at ${setText(marks)}`));
  svg.append(svgEl('line', { x1: left, x2: left + L * unit, y1: base, y2: base, class: 'baseline' }));
  for (let i = 0; i <= L; i++) {
    const x = left + i * unit;
    svg.append(svgEl('line', { x1: x, x2: x, y1: base - 3, y2: base + 3, class: 'tick-mark' }));
  }
  marks.forEach((m, i) => {
    const x = left + m * unit;
    const isSel = sel.includes(origin[i]);
    const g = svgEl('g', { class: `antenna${isSel ? ' selected' : ''}`, 'data-mark': origin[i] });
    asButton(g, `Antenna at ${m} (mark ${origin[i]} on the circle)`, isSel);
    g.append(svgEl('rect', { x: x - 11, y: 10, width: 22, height: base - 6, class: 'hit' }));
    g.append(svgEl('line', { x1: x, x2: x, y1: 26, y2: base, class: 'mast' }));
    g.append(svgEl('path', { d: `M ${x - 9} 14 L ${x} 28 L ${x + 9} 14 Z`, class: 'dish' }));
    g.append(svgEl('text', { x, y: base + 18, class: 'mark-label' }, String(m)));
    svg.append(g);
  });
  return svg;
}

/** Bars for how many antenna pairs sit d apart, for d = 1 … length. */
function coarray(counts: readonly number[], hot: number | null): SVGSVGElement {
  const n = counts.length - 1;
  const step = Math.min(28, Math.max(12, 560 / n));
  const left = 6;
  const width = left * 2 + n * step;
  const plot = 40;
  const svg = svgEl('svg', { viewBox: `0 0 ${width} ${plot + 34}`, class: 'coarray', role: 'img', style: `max-width: ${Math.round(width * 1.4)}px` });
  const missing = counts.flatMap((c, d) => (d > 0 && c === 0 ? [d] : []));
  svg.append(
    svgEl(
      'title',
      {},
      `Spacings 1 to ${n}: each used at most once${missing.length ? `; missing ${missing.join(', ')}` : ''}`,
    ),
  );
  for (let d = 1; d <= n; d++) {
    const x = left + (d - 1) * step;
    const c = counts[d];
    const cls = c === 0 ? 'missing' : c > 1 ? 'repeat' : 'once';
    const g = svgEl('g', { class: `spacing ${cls}${hot === d ? ' hot' : ''}`, 'data-d': d });
    if (c > 0) g.append(svgEl('rect', { x: x + 2, y: plot - 30 * c + 6, width: step - 4, height: 30 * c - 6 }));
    else g.append(svgEl('text', { x: x + step / 2, y: plot - 4, class: 'missing-x' }, '×'));
    g.append(svgEl('text', { x: x + step / 2, y: plot + 14, class: 'tick' }, String(d)));
    svg.append(g);
  }
  return svg;
}

/**
 * `<div data-widget="golomb-ruler" data-v="13">`: a circular ruler with marks
 * at a planar Singer set. Click two marks to see the distance each way round,
 * with a tally of every distance; "Unwind" cuts the circle open into a
 * straight antenna array and shows which spacings it measures.
 */
export function mount(el: HTMLElement): void {
  let preset = Math.max(
    0,
    PRESETS.findIndex((p) => p.v === Number(el.dataset.v ?? 13)),
  );
  let unwound = el.dataset.view === 'unwound';
  let sel: number[] = [];
  let cutAfter = bestCut(PRESETS[preset].set, PRESETS[preset].v).from;

  const controls = document.createElement('div');
  controls.className = 'controls';
  const presetSelect = document.createElement('select');
  presetSelect.className = 'preset-select';
  presetSelect.setAttribute('aria-label', 'Ruler');
  PRESETS.forEach((p, i) => presetSelect.append(option(`${setText(p.set)} mod ${p.v}`, String(i))));
  presetSelect.value = String(preset);
  const circleButton = button('Circle', 'view-circle');
  const unwindButton = button('Unwind', 'view-unwind');
  const group = document.createElement('span');
  group.className = 'button-group';
  group.setAttribute('role', 'group');
  group.setAttribute('aria-label', 'View');
  group.append(circleButton, unwindButton);
  const cutLabel = document.createElement('label');
  cutLabel.className = 'control cut-control';
  const cutSelect = document.createElement('select');
  cutSelect.className = 'cut-select';
  cutLabel.append('Cut ', cutSelect);
  controls.append(presetSelect, group, cutLabel);

  const box = document.createElement('div');
  box.className = 'ruler-box';
  const figure = document.createElement('div');
  figure.className = 'ruler-figure';
  const info = document.createElement('p');
  info.className = 'ruler-info';
  info.setAttribute('aria-live', 'polite');
  const tally = document.createElement('div');
  tally.className = 'distance-tally';
  const note = document.createElement('p');
  note.className = 'table-note';
  box.append(figure, info, tally, note);

  const render = () => {
    const { v, set } = PRESETS[preset];
    const k = set.length;
    circleButton.setAttribute('aria-pressed', String(!unwound));
    unwindButton.setAttribute('aria-pressed', String(unwound));
    cutLabel.hidden = !unwound;
    const best = bestCut(set, v);
    cutSelect.replaceChildren(
      ...gaps(set, v).map(
        (g) =>
          option(
            `between ${g.from} and ${g.to}: length ${v - g.length}${g.from === best.from ? ' (shortest)' : ''}`,
            String(g.from),
          ),
      ),
    );
    cutSelect.value = String(cutAfter);

    const [a, b] = sel;
    const d = sel.length === 2 ? mod(b - a, v) : null;
    if (!unwound) {
      figure.replaceChildren(circleRuler(v, set, sel));
      info.textContent =
        sel.length === 2
          ? `From ${a} to ${b} is ${d} step${d === 1 ? '' : 's'} clockwise, and ${v - d!} the other way round.`
          : sel.length === 1
            ? `Now click a second mark.`
            : `Click two marks to measure the distance between them, both ways round.`;
      tally.replaceChildren();
      tally.hidden = false;
      const counts = new Array<number[][]>(v).fill([]).map(() => [] as number[][]);
      for (const x of set) for (const y of set) if (x !== y) counts[mod(y - x, v)].push([y, x]);
      for (let dist = 1; dist < v; dist++) {
        const cell = document.createElement('span');
        const n = counts[dist].length;
        cell.className = `tally-cell${n === 1 ? ' once' : n === 0 ? ' missing' : ' repeat'}`;
        if (d !== null && dist === d) cell.classList.add('hot-a');
        if (d !== null && dist === v - d) cell.classList.add('hot-b');
        cell.dataset.d = String(dist);
        const big = document.createElement('strong');
        big.textContent = String(dist);
        const small = document.createElement('small');
        small.textContent = counts[dist].map(([y, x]) => `${y}−${x}`).join(' ') || '—';
        cell.append(big, small);
        tally.append(cell);
      }
      note.className = 'table-note ok';
      note.textContent = `${k} marks make ${k} × ${k - 1} = ${k * (k - 1)} ordered pairs, and there are exactly ${v - 1} distances from 1 to ${v - 1}. Each distance appears once: no repeats and no gaps.`;
    } else {
      const marks = unwind(set, v, cutAfter);
      const gap = gaps(set, v).find((g) => g.from === cutAfter)!;
      const origin = marks.map((m) => mod(m + gap.to, v));
      const counts = linearDistanceCounts(marks);
      const L = rulerLength(marks);
      const spacing = sel.length === 2 ? Math.abs(marks[origin.indexOf(a)] - marks[origin.indexOf(b)]) : null;
      figure.replaceChildren(straightRuler(marks, origin, sel), coarray(counts, spacing));
      info.textContent =
        spacing !== null
          ? `These two antennas are ${spacing} apart. On the circle that was ${d} one way and ${v - d!} the other: cutting keeps one of the two.`
          : `Cut between ${gap.from} and ${gap.to} and straighten: the marks become antennas at ${setText(marks)}. Click two antennas to see their spacing.`;
      tally.hidden = true;
      const missing = counts.flatMap((c, dd) => (dd > 0 && c === 0 ? [dd] : []));
      const repeats = counts.flatMap((c, dd) => (dd > 0 && c > 1 ? [dd] : []));
      const pairs = (k * (k - 1)) / 2;
      note.className = `table-note${repeats.length ? '' : ' ok'}`;
      note.textContent =
        `${pairs} pairs of antennas, ${pairs - repeats.length} different spacings${repeats.length ? ` (repeated: ${repeats.join(', ')})` : ', none repeated'}. ` +
        `The array is ${L} long, so ${missing.length ? `${missing.length === 1 ? 'spacing' : 'spacings'} ${missing.join(', ')} ${missing.length === 1 ? 'is' : 'are'} missing.` : 'every spacing from 1 to the full length is measured.'}`;
    }
  };

  const toggle = (x: number) => {
    if (sel.includes(x)) sel = sel.filter((y) => y !== x);
    else sel = sel.length >= 2 ? [x] : [...sel, x];
    render();
  };
  const pick = (e: Event) => {
    const g = (e.target as Element).closest<SVGGElement>('[data-mark]');
    if (g) toggle(Number(g.dataset.mark));
  };
  figure.addEventListener('click', pick);
  figure.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const g = (e.target as Element).closest<SVGGElement>('[data-mark]');
    if (!g) return;
    e.preventDefault();
    const x = Number(g.dataset.mark);
    toggle(x);
    figure.querySelector<SVGGElement>(`[data-mark="${x}"]`)?.focus();
  });
  presetSelect.addEventListener('change', () => {
    preset = Number(presetSelect.value);
    sel = [];
    cutAfter = bestCut(PRESETS[preset].set, PRESETS[preset].v).from;
    render();
  });
  circleButton.addEventListener('click', () => {
    unwound = false;
    render();
  });
  unwindButton.addEventListener('click', () => {
    unwound = true;
    render();
  });
  cutSelect.addEventListener('change', () => {
    cutAfter = Number(cutSelect.value);
    render();
  });

  el.classList.add('widget', 'golomb-ruler');
  el.replaceChildren(controls, box);
  render();
}
