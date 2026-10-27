// The points of PG(2, q) around a circle by Singer number, with one line
// drawn as the polygon through its points. Under the Singer numbering every
// line is a translate D + j, so stepping the line is a turn of the polygon.

import { svgEl } from './circleSet';

export interface PlaneCircle {
  svg: SVGSVGElement;
  /** The polygon group, which a widget may rotate. */
  shape: SVGGElement;
  /** Draw `line` (point numbers) as the polygon; `points` get the selected style, `result` the result style. */
  draw(opts: { line?: readonly number[]; points?: readonly number[]; result?: readonly number[] }): void;
  center: number;
}

export function planeCircle(v: number, title: string, interactive = false): PlaneCircle {
  const r = Math.max(80, (16 * v) / (2 * Math.PI));
  const pad = 26;
  const size = 2 * (r + pad);
  const c = size / 2;
  const at = (i: number, radius = r): [number, number] => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / v;
    return [c + radius * Math.cos(angle), c + radius * Math.sin(angle)];
  };
  const svg = svgEl('svg', { viewBox: `0 0 ${size} ${size}`, class: 'plane-circle', role: interactive ? 'group' : 'img' });
  svg.setAttribute('aria-label', title);
  // Keep labels near the page's text size: small planes shouldn't blow up to fill the column.
  svg.style.maxWidth = `${Math.round(size * 1.6)}px`;
  svg.append(svgEl('circle', { cx: c, cy: c, r, class: 'rim' }));
  const shape = svgEl('g', { class: 'line-shape' });
  const polygon = svgEl('polygon', { points: '', class: 'line-poly' });
  shape.append(polygon);
  svg.append(shape);
  const font = v > 40 ? 9 : 11;
  const pts: SVGGElement[] = [];
  for (let i = 0; i < v; i++) {
    const [x, y] = at(i);
    const [lx, ly] = at(i, r + 15);
    const g = svgEl('g', { class: 'pt', 'data-point': i });
    if (interactive) {
      g.setAttribute('tabindex', '0');
      g.setAttribute('role', 'button');
      g.setAttribute('aria-label', `Point ${i}`);
      g.append(svgEl('circle', { cx: x, cy: y, r: Math.max(8, Math.min(14, (Math.PI * r) / v)), class: 'hit' }));
    }
    g.append(svgEl('circle', { cx: x, cy: y, r: 3.5, class: 'dot' }));
    g.append(svgEl('text', { x: lx, y: ly + font / 3, 'font-size': font, class: 'pt-label' }, String(i)));
    pts.push(g);
    svg.append(g);
  }
  return {
    svg,
    shape,
    center: c,
    draw({ line = [], points = [], result = [] }) {
      const sorted = [...line].sort((a, b) => a - b);
      polygon.setAttribute('points', sorted.map((i) => at(i).join(',')).join(' '));
      const onLine = new Set(line);
      const sel = new Set(points);
      const res = new Set(result);
      pts.forEach((g, i) => {
        g.classList.toggle('on-line', onLine.has(i));
        g.classList.toggle('selected', sel.has(i));
        g.classList.toggle('result', res.has(i));
        if (interactive) g.setAttribute('aria-pressed', String(sel.has(i)));
      });
    },
  };
}
