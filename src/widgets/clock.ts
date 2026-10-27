import { clockDifference, divMod } from '../math/clock';
import { svgEl } from '../viz/circleSet';

const MIN_V = 2;
const MAX_V = 24;

/** Clock geometry for v points. */
function face(v: number) {
  const r = 90;
  const c = 125;
  const angle = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / v;
  const at = (i: number, radius = r): [number, number] => [
    c + radius * Math.cos(angle(i)),
    c + radius * Math.sin(angle(i)),
  ];
  return { r, c, at };
}

/** Draw the clock face with points 0 … v − 1; `cls(i)` adds classes to point i. */
function clockSvg(v: number, cls: (i: number) => string, interactive: boolean, title: string) {
  const { r, c, at } = face(v);
  const svg = svgEl('svg', { viewBox: '0 0 250 250', class: 'clock', role: 'img' });
  svg.append(svgEl('title', {}, title));
  svg.append(svgEl('circle', { cx: c, cy: c, r, class: 'rim' }));
  const decorations = svgEl('g', { class: 'decorations' });
  svg.append(decorations);
  for (let i = 0; i < v; i++) {
    const [x, y] = at(i);
    const [lx, ly] = at(i, r + 17);
    const g = svgEl('g', { class: `pt ${cls(i)}`.trim(), 'data-point': i });
    if (interactive) {
      g.setAttribute('tabindex', '0');
      g.setAttribute('role', 'button');
      g.setAttribute('aria-label', `Point ${i}`);
      g.append(svgEl('circle', { cx: x, cy: y, r: 13, class: 'hit' }));
    }
    g.append(svgEl('circle', { cx: x, cy: y, r: 6, class: 'dot' }));
    g.append(svgEl('text', { x: lx, y: ly + 4.5, class: 'pt-label' }, String(i)));
    svg.append(g);
  }
  return { svg, decorations, at, c, r };
}

/** An arc drawn clockwise around the rim from point `from`, `steps` points forward, slightly inside the rim. */
function arcPath(v: number, from: number, steps: number, inset: number): string {
  const { c, r } = face(v);
  const rr = r - inset;
  const a0 = -Math.PI / 2 + (from * 2 * Math.PI) / v;
  const a1 = a0 + (steps * 2 * Math.PI) / v;
  const p = (a: number) => `${c + rr * Math.cos(a)} ${c + rr * Math.sin(a)}`;
  if (steps === 0) return '';
  const large = steps * 2 > v ? 1 : 0;
  return `M ${p(a0)} A ${rr} ${rr} 0 ${large} 1 ${p(a1)}`;
}

function numberControl(label: string, cls: string, value: number, min: number, max: number) {
  const wrap = document.createElement('label');
  wrap.className = 'control';
  const input = document.createElement('input');
  input.type = 'number';
  input.className = cls;
  input.min = String(min);
  input.max = String(max);
  input.value = String(value);
  wrap.append(label, input);
  return { wrap, input };
}

function button(text: string, cls: string): HTMLButtonElement {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = cls;
  b.textContent = text;
  return b;
}

let instance = 0;

function arrowMarker(svg: SVGSVGElement, id: string) {
  const defs = svgEl('defs');
  for (const which of ['a', 'b']) {
    const marker = svgEl('marker', {
      id,
      viewBox: '0 0 10 10',
      refX: 8,
      refY: 5,
      markerWidth: 6,
      markerHeight: 6,
      orient: 'auto-start-reverse',
    });
    marker.setAttribute('id', `${id}-${which}`);
    marker.append(svgEl('path', { d: 'M 0 0 L 10 5 L 0 10 z', class: `arrow-head arrow-head-${which}` }));
    defs.append(marker);
  }
  svg.prepend(defs);
}

/**
 * `<div data-widget="clock-mod" data-v="7" data-n="10">`: type or step any
 * integer n and watch it wrap onto the clock, with n = q·v + r.
 */
function mountMod(el: HTMLElement): void {
  let v = Number(el.dataset.v ?? 7);
  let n = Number(el.dataset.n ?? 10);
  const id = `clock-${++instance}`;
  const vc = numberControl('v = ', 'v-input', v, MIN_V, MAX_V);
  const nc = numberControl('n = ', 'n-input', n, -999, 999);
  const minus = button('− 1', 'n-minus');
  const plus = button('+ 1', 'n-plus');
  const range = document.createElement('input');
  range.type = 'range';
  range.className = 'n-range';
  range.min = '-30';
  range.max = '30';
  range.setAttribute('aria-label', 'n');
  const controls = document.createElement('div');
  controls.className = 'controls';
  controls.append(vc.wrap, nc.wrap, minus, plus, range);
  const box = document.createElement('div');
  box.className = 'clock-box';
  const eq = document.createElement('p');
  eq.className = 'clock-equation';
  eq.setAttribute('aria-live', 'polite');

  const render = () => {
    const { q, r } = divMod(n, v);
    nc.input.value = String(n);
    range.value = String(Math.max(-30, Math.min(30, n)));
    const { svg, decorations } = clockSvg(v, (i) => (i === r ? 'in-a' : ''), false, `${n} lands on ${r} mod ${v}`);
    arrowMarker(svg, `${id}-arrow`);
    // Walk |n| steps from 0, clockwise for positive n and counterclockwise for negative n.
    const steps = Math.abs(n);
    const full = Math.floor(steps / v);
    const rest = steps % v;
    for (let lap = 0; lap < Math.min(full, 4); lap++) {
      decorations.append(svgEl('circle', { cx: 125, cy: 125, r: 76 - lap * 8, class: 'lap' }));
    }
    if (rest > 0) {
      const inset = 14 + Math.min(full, 4) * 8;
      const d = n >= 0 ? arcPath(v, 0, rest, inset) : arcPath(v, r, rest, inset);
      decorations.append(
        svgEl('path', {
          d,
          class: 'walk',
          'marker-end': n >= 0 ? `url(#${id}-arrow-a)` : '',
          'marker-start': n < 0 ? `url(#${id}-arrow-a)` : '',
        }),
      );
    }
    box.replaceChildren(svg);
    const qv = `${q < 0 ? `(−${-q})` : q}·${v} + `;
    const nText = n < 0 ? `−${-n}` : String(n);
    eq.innerHTML = '';
    const main = document.createElement('strong');
    main.textContent = `${nText} = ${qv}${r}`;
    eq.append(
      main,
      document.createElement('br'),
      `${nText} ≡ ${r} (mod ${v}): ` +
        (q === 0
          ? `${nText} is already on the clock.`
          : `${n >= 0 ? 'going forward' : 'going backward'} ${Math.abs(n)} step${Math.abs(n) === 1 ? '' : 's'} from 0 ` +
            `goes ${full === 0 ? 'less than once' : full === 1 ? 'once' : `${full} times`} around and lands on ${r}.`),
    );
  };
  vc.input.addEventListener('change', () => {
    const next = Number(vc.input.value);
    if (Number.isInteger(next) && next >= MIN_V && next <= MAX_V) v = next;
    vc.input.value = String(v);
    render();
  });
  nc.input.addEventListener('input', () => {
    const next = Number(nc.input.value);
    if (Number.isInteger(next) && Math.abs(next) <= 999 && nc.input.value !== '') {
      n = next;
      render();
    }
  });
  range.addEventListener('input', () => {
    n = Number(range.value);
    render();
  });
  minus.addEventListener('click', () => {
    n = Math.max(-999, n - 1);
    render();
  });
  plus.addEventListener('click', () => {
    n = Math.min(999, n + 1);
    render();
  });
  el.classList.add('widget', 'clock-widget');
  el.replaceChildren(controls, box, eq);
  render();
}

/**
 * `<div data-widget="clock-difference" data-v="7" data-a="1" data-b="3">`:
 * click two points; see a − b and b − a wrap around the clock.
 */
function mountDifference(el: HTMLElement): void {
  const v = Number(el.dataset.v ?? 7);
  let picks: number[] = [Number(el.dataset.a ?? 1), Number(el.dataset.b ?? 3)];
  const id = `clock-${++instance}`;
  const hint = document.createElement('p');
  hint.className = 'hint';
  hint.textContent = 'Click two points.';
  const box = document.createElement('div');
  box.className = 'clock-box';
  const eq = document.createElement('p');
  eq.className = 'clock-equation';
  eq.setAttribute('aria-live', 'polite');

  const render = () => {
    const [a, b] = picks;
    const { svg, decorations } = clockSvg(
      v,
      (i) => (i === a ? 'in-a' : i === b ? 'in-b' : ''),
      true,
      'Pick two points to see their differences',
    );
    arrowMarker(svg, `${id}-arrow`);
    eq.innerHTML = '';
    if (picks.length === 2) {
      const ab = clockDifference(a, b, v);
      const ba = clockDifference(b, a, v);
      decorations.append(
        svgEl('path', { d: arcPath(v, b, ab, 14), class: 'walk', 'marker-end': `url(#${id}-arrow-a)` }),
      );
      decorations.append(
        svgEl('path', { d: arcPath(v, a, ba, 26), class: 'walk walk-b', 'marker-end': `url(#${id}-arrow-b)` }),
      );
      const line = (x: number, y: number, d: number, cls: string) => {
        const s = document.createElement('span');
        s.className = cls;
        const raw = x - y;
        s.textContent = `${x} − ${y} = ${raw < 0 ? `−${-raw}` : raw}${raw === d ? '' : ` ≡ ${d} (mod ${v})`}`;
        return s;
      };
      eq.append(
        line(a, b, ab, 'key key-a'),
        ': from ',
        String(b),
        ` forward ${ab} step${ab === 1 ? '' : 's'} to ${a}.`,
        document.createElement('br'),
        line(b, a, ba, 'key key-b'),
        ': from ',
        String(a),
        ` forward ${ba} step${ba === 1 ? '' : 's'} to ${b}.`,
        document.createElement('br'),
        `The two differences add up to ${ab} + ${ba} = ${v}, once around the clock.`,
      );
    } else {
      eq.textContent = picks.length === 1 ? `Point ${picks[0]} picked. Click another point.` : 'Click two points.';
    }
    box.replaceChildren(svg);
  };
  const pick = (i: number) => {
    if (picks.length === 2 || picks.includes(i)) picks = [];
    picks.push(i);
    render();
    box.querySelector<SVGGElement>(`[data-point="${i}"]`)?.focus();
  };
  box.addEventListener('click', (e) => {
    const g = (e.target as Element).closest<SVGGElement>('[data-point]');
    if (g) pick(Number(g.dataset.point));
  });
  box.addEventListener('keydown', (e) => {
    const g = (e.target as Element).closest<SVGGElement>('[data-point]');
    if (g && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      pick(Number(g.dataset.point));
    }
  });
  el.classList.add('widget', 'clock-widget');
  el.replaceChildren(hint, box, eq);
  render();
}

export function mount(el: HTMLElement): void {
  if (el.dataset.widget === 'clock-difference') mountDifference(el);
  else mountMod(el);
}
