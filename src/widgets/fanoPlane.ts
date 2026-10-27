import { cyclicPlane, linesThrough, meet } from '../math/cyclicPlane';
import { translate } from '../math/difference';
import { svgEl } from '../viz/circleSet';
import { setText } from './format';

const FANO = cyclicPlane([0, 1, 3], 7);

// The classic drawing: a triangle with vertices 3, 5, 6, side midpoints 2, 4, 1,
// and center 0. With these labels line j is {0, 1, 3} + j mod 7.
const H = 216.5;
const POS: [number, number][] = [];
POS[3] = [150, 25];
POS[5] = [25, 25 + H];
POS[6] = [275, 25 + H];
POS[2] = [(150 + 25) / 2, 25 + H / 2];
POS[4] = [(150 + 275) / 2, 25 + H / 2];
POS[1] = [150, 25 + H];
POS[0] = [150, 25 + (2 * H) / 3];
const CIRCLE_R = H / 3;
/** Endpoints of each straight line; line 1 = {1, 2, 4} is the circle. */
const ENDS: Record<number, [number, number]> = { 0: [3, 1], 2: [3, 5], 3: [3, 6], 4: [5, 4], 5: [5, 6], 6: [6, 2] };
const CIRCLE_LINE = 1;

let instance = 0;

type Selection = { kind: 'points' | 'lines'; items: number[] };

/**
 * `<div data-widget="fano-plane">`: the seven-point plane. Click two points to
 * see the line through them, or two lines to see where they meet; the rotation
 * panel steps i ↦ i + 1 and shows each line landing on another line.
 */
export function mount(el: HTMLElement): void {
  const id = `fano-${++instance}`;
  let sel: Selection = { kind: 'points', items: [] };
  let rotating = false;
  let rot = 0;

  const svg = svgEl('svg', { viewBox: '0 0 300 270', class: 'fano', role: 'group', 'aria-label': 'The Fano plane' });
  const defs = svgEl('defs');
  const marker = svgEl('marker', {
    id: `${id}-arrow`,
    viewBox: '0 0 10 10',
    refX: 9,
    refY: 5,
    markerWidth: 7,
    markerHeight: 7,
    orient: 'auto-start-reverse',
  });
  marker.append(svgEl('path', { d: 'M 0 0 L 10 5 L 0 10 z', class: 'arrow-head' }));
  defs.append(marker);
  svg.append(defs);

  const lineEls: SVGGElement[] = [];
  for (let j = 0; j < 7; j++) {
    const g = svgEl('g', { class: 'fano-line', 'data-line': j, tabindex: 0, role: 'button' });
    g.setAttribute('aria-label', `Line ${j}: ${setText(FANO.lines[j])}`);
    const shape = (cls: string) => {
      if (j === CIRCLE_LINE) {
        return svgEl('circle', { cx: POS[0][0], cy: POS[0][1], r: CIRCLE_R, class: cls });
      }
      const [a, b] = ENDS[j];
      return svgEl('line', { x1: POS[a][0], y1: POS[a][1], x2: POS[b][0], y2: POS[b][1], class: cls });
    };
    g.append(shape('line-hit'), shape('line-stroke'));
    lineEls.push(g);
    svg.append(g);
  }
  const arrows = svgEl('g', { class: 'arrows' });
  svg.append(arrows);
  const pointEls: SVGGElement[] = [];
  for (let p = 0; p < 7; p++) {
    const [x, y] = POS[p];
    const g = svgEl('g', { class: 'fano-point', 'data-point': p, tabindex: 0, role: 'button' });
    g.setAttribute('aria-label', `Point ${p}`);
    g.append(svgEl('circle', { cx: x, cy: y, r: 13, class: 'dot' }));
    g.append(svgEl('text', { x, y: y + 4.5 }, String(p)));
    pointEls.push(g);
    svg.append(g);
  }

  const info = document.createElement('p');
  info.className = 'fano-info';
  info.setAttribute('aria-live', 'polite');

  const list = document.createElement('div');
  list.className = 'line-list';
  const listButtons = FANO.lines.map((line, j) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.dataset.line = String(j);
    b.textContent = `${setText(line)} = D + ${j}`;
    list.append(b);
    return b;
  });

  const controls = document.createElement('div');
  controls.className = 'controls';
  const rotToggle = document.createElement('button');
  rotToggle.type = 'button';
  rotToggle.className = 'rotate-toggle';
  rotToggle.setAttribute('aria-pressed', 'false');
  rotToggle.textContent = 'Rotate: i ↦ i + 1';
  const rotStep = document.createElement('button');
  rotStep.type = 'button';
  rotStep.className = 'rotate-step';
  rotStep.textContent = 'Next line';
  rotStep.hidden = true;
  const clearBtn = document.createElement('button');
  clearBtn.type = 'button';
  clearBtn.className = 'clear-button';
  clearBtn.textContent = 'Clear';
  controls.append(rotToggle, rotStep, clearBtn);

  const render = () => {
    const pts = new Set<number>();
    const lines = new Set<number>();
    const resultPts = new Set<number>();
    const resultLines = new Set<number>();
    let text: string;
    arrows.replaceChildren();
    if (rotating) {
      const from = FANO.lines[rot];
      const to = translate(from, 1, 7);
      const next = (rot + 1) % 7;
      lines.add(rot);
      resultLines.add(next);
      from.forEach((p) => pts.add(p));
      to.forEach((p) => resultPts.add(p));
      for (const p of from) {
        const [x1, y1] = POS[p];
        const [x2, y2] = POS[(p + 1) % 7];
        const len = Math.hypot(x2 - x1, y2 - y1);
        const ux = (x2 - x1) / len;
        const uy = (y2 - y1) / len;
        // Bow each arrow a little so it doesn't hide the lines underneath.
        const mx = (x1 + x2) / 2 - uy * 18;
        const my = (y1 + y2) / 2 + ux * 18;
        arrows.append(
          svgEl('path', {
            d: `M ${x1 + ux * 15} ${y1 + uy * 15} Q ${mx} ${my} ${x2 - ux * 16} ${y2 - uy * 16}`,
            class: 'arrow',
            'marker-end': `url(#${id}-arrow)`,
          }),
        );
      }
      text =
        `Adding 1 to every point sends the line ${setText(from)} to ${setText(to)}, ` +
        `which is again a line. Every line moves to the next one, and after seven steps all are back.`;
    } else if (sel.kind === 'points') {
      sel.items.forEach((p) => pts.add(p));
      if (sel.items.length === 2) {
        const [a, b] = sel.items;
        const [j] = linesThrough(FANO, a, b);
        resultLines.add(j);
        FANO.lines[j].forEach((p) => p !== a && p !== b && resultPts.add(p));
        text = `Points ${a} and ${b} lie on exactly one line: ${setText(FANO.lines[j])} = {0, 1, 3} + ${j}.`;
      } else if (sel.items.length === 1) {
        const through = linesThrough(FANO, sel.items[0]);
        text = `Point ${sel.items[0]} lies on ${through.length} lines. Click a second point.`;
      } else {
        text = 'Click two points to find the line through them, or two lines to find where they meet.';
      }
    } else {
      sel.items.forEach((j) => lines.add(j));
      if (sel.items.length === 2) {
        const [i, j] = sel.items;
        const [p] = meet(FANO, i, j);
        resultPts.add(p);
        text = `The lines ${setText(FANO.lines[i])} and ${setText(FANO.lines[j])} meet in exactly one point: ${p}.`;
      } else if (sel.items.length === 1) {
        text = `The line ${setText(FANO.lines[sel.items[0]])} has 3 points. Click a second line.`;
      } else {
        text = 'Click two points to find the line through them, or two lines to find where they meet.';
      }
    }
    pointEls.forEach((g, p) => {
      g.classList.toggle('selected', pts.has(p));
      g.classList.toggle('result', resultPts.has(p));
      g.setAttribute('aria-pressed', String(pts.has(p)));
    });
    lineEls.forEach((g, j) => {
      g.classList.toggle('selected', lines.has(j));
      g.classList.toggle('result', resultLines.has(j));
      g.setAttribute('aria-pressed', String(lines.has(j)));
    });
    listButtons.forEach((b, j) => {
      b.classList.toggle('selected', lines.has(j));
      b.classList.toggle('result', resultLines.has(j));
    });
    info.textContent = text;
    rotToggle.setAttribute('aria-pressed', String(rotating));
    rotStep.hidden = !rotating;
  };

  const pick = (kind: Selection['kind'], x: number) => {
    rotating = false;
    if (sel.kind !== kind) sel = { kind, items: [] };
    const items = sel.items.includes(x) ? sel.items.filter((y) => y !== x) : [...sel.items, x].slice(-2);
    sel = { kind, items };
    render();
  };

  const activate = (target: Element) => {
    const point = target.closest<SVGGElement>('[data-point]');
    if (point) return pick('points', Number(point.dataset.point));
    const line = target.closest<HTMLElement | SVGGElement>('[data-line]');
    if (line) {
      const j = Number(line.dataset.line);
      if (rotating) {
        rot = j;
        render();
      } else pick('lines', j);
    }
  };
  for (const container of [svg, list]) {
    container.addEventListener('click', (e) => activate(e.target as Element));
  }
  svg.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      activate(e.target as Element);
    }
  });
  rotToggle.addEventListener('click', () => {
    rotating = !rotating;
    sel = { kind: 'points', items: [] };
    render();
  });
  rotStep.addEventListener('click', () => {
    rot = (rot + 1) % 7;
    render();
  });
  clearBtn.addEventListener('click', () => {
    rotating = false;
    sel = { kind: 'points', items: [] };
    render();
  });

  const figure = document.createElement('div');
  figure.className = 'fano-figure';
  figure.append(svg);
  el.classList.add('widget', 'fano-widget');
  el.replaceChildren(controls, figure, info, list);
  render();
}
