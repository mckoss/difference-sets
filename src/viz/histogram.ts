// A bar chart of how often each nonzero difference occurs, with the λ a
// difference set would need drawn as a dashed line.

import type { DifferenceReport } from '../math/difference';
import { svgEl } from './circleSet';

export function differenceHistogram(report: DifferenceReport): SVGSVGElement {
  const { v, counts, target } = report;
  const n = v - 1;
  const step = n > 30 ? 10 : n > 12 ? 18 : 30;
  const barW = step - (step > 20 ? 6 : 3);
  const left = 22;
  const top = 8;
  const plotH = 90;
  const maxCount = Math.max(1, target ?? 0, ...counts);
  const unit = plotH / maxCount;
  const width = Math.max(240, left + n * step + 6);
  const height = top + plotH + 22;
  const base = top + plotH;

  const svg = svgEl('svg', {
    viewBox: `0 0 ${width} ${height}`,
    width,
    class: 'histogram',
    role: 'img',
  });
  svg.append(svgEl('title', {}, 'How often each difference occurs'));
  // y-axis ticks at whole counts (at most 5 of them).
  const tickStep = Math.ceil(maxCount / 4);
  for (let t = 0; t <= maxCount; t += tickStep) {
    const y = base - t * unit;
    svg.append(svgEl('line', { x1: left - 3, x2: width, y1: y, y2: y, class: 'grid' }));
    svg.append(svgEl('text', { x: left - 6, y: y + 3.5, class: 'tick y-tick' }, String(t)));
  }
  for (let d = 1; d <= n; d++) {
    const x = left + (d - 1) * step + 2;
    const count = counts[d];
    const state =
      target === null ? (count === 0 ? 'few' : 'neutral') : count < target ? 'few' : count > target ? 'many' : 'ok';
    const h = Math.max(count * unit, count === 0 ? 0 : 1);
    const g = svgEl('g', { class: `bar ${state}`, 'data-d': d, tabindex: 0 });
    g.append(svgEl('title', {}, `difference ${d}: ${count} time${count === 1 ? '' : 's'}`));
    g.append(svgEl('rect', { x: x - 1, y: top, width: barW + 2, height: plotH + 18, class: 'bar-hit' }));
    g.append(svgEl('rect', { x, y: base - h, width: barW, height: h, class: 'bar-fill' }));
    if (count === 0) g.append(svgEl('line', { x1: x, x2: x + barW, y1: base, y2: base, class: 'bar-zero' }));
    const showLabel = n <= 30 || d % 5 === 0 || d === 1;
    if (showLabel) g.append(svgEl('text', { x: x + barW / 2, y: base + 14, class: 'tick x-tick' }, String(d)));
    svg.append(g);
  }
  if (target !== null && target > 0) {
    const y = base - target * unit;
    svg.append(svgEl('line', { x1: left, x2: width, y1: y, y2: y, class: 'target' }));
  }
  return svg;
}
