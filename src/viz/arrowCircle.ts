// Points evenly spaced on a circle, with optional arrows between them: the
// clock for ℤ/nℤ, the cycle of powers of a field element, and the Frobenius
// permutation.

const NS = 'http://www.w3.org/2000/svg';
let markerCount = 0;

export interface ArrowCircleSpec {
  /** Labels in circle order, starting at the top and going clockwise. */
  labels: string[];
  arrows?: { from: number; to: number; cls?: string }[];
  pointClass?: (i: number) => string;
  /** Text in the middle of the circle. */
  center?: string;
  /** Extra point drawn at the center (e.g. 0 in a multiplicative picture). */
  centerPoint?: { label: string; cls?: string };
  size?: number;
  ariaLabel?: string;
}

function svgEl<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number>): SVGElementTagNameMap[K] {
  const el = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
  return el;
}

export function arrowCircle(spec: ArrowCircleSpec): SVGSVGElement {
  const n = spec.labels.length;
  const size = spec.size ?? 320;
  const c = size / 2;
  const longest = Math.max(1, ...spec.labels.map((l) => l.length));
  const fontSize0 = n > 40 ? 8 : n > 20 ? 10 : 13;
  const labelRoom = Math.max(fontSize0 + 12, Math.min(80, 8 + longest * fontSize0 * 0.6));
  const R = c - labelRoom - 6;
  const dotR = n > 40 ? 3.5 : n > 20 ? 5 : 7;
  const fontSize = fontSize0;
  const id = `ff-arrow-${++markerCount}`;

  const svg = svgEl('svg', { viewBox: `0 0 ${size} ${size}`, width: size, height: size, class: 'arrow-circle', role: 'img' });
  if (spec.ariaLabel) svg.setAttribute('aria-label', spec.ariaLabel);
  const defs = svgEl('defs', {});
  const marker = svgEl('marker', {
    id,
    viewBox: '0 0 10 10',
    refX: 9,
    refY: 5,
    markerWidth: 7,
    markerHeight: 7,
    orient: 'auto-start-reverse',
  });
  marker.append(svgEl('path', { d: 'M0,0 L10,5 L0,10 z', class: 'arrowhead' }));
  defs.append(marker);
  svg.append(defs, svgEl('circle', { cx: c, cy: c, r: R, class: 'rim' }));

  const pos = (i: number, r = R) => {
    const t = (2 * Math.PI * i) / n - Math.PI / 2;
    return [c + r * Math.cos(t), c + r * Math.sin(t)];
  };

  const arrowLayer = svgEl('g', { class: 'arrows' });
  for (const a of spec.arrows ?? []) {
    const [x1, y1] = a.from < 0 ? [c, c] : pos(a.from);
    const [x2, y2] = a.to < 0 ? [c, c] : pos(a.to);
    if (a.from === a.to) {
      // A small loop just outside the point marks a fixed point.
      const [lx, ly] = pos(a.from, R + dotR + 5);
      arrowLayer.append(svgEl('circle', { cx: lx, cy: ly, r: 4, class: `loop ${a.cls ?? ''}`.trim() }));
      continue;
    }
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1;
    const shrink = dotR + 2;
    arrowLayer.append(
      svgEl('line', {
        x1: x1 + (dx / len) * shrink,
        y1: y1 + (dy / len) * shrink,
        x2: x2 - (dx / len) * shrink,
        y2: y2 - (dy / len) * shrink,
        class: `arrow ${a.cls ?? ''}`.trim(),
        'marker-end': `url(#${id})`,
      }),
    );
  }
  svg.append(arrowLayer);

  spec.labels.forEach((label, i) => {
    const [x, y] = pos(i);
    const g = svgEl('g', { class: `pt ${spec.pointClass?.(i) ?? ''}`.trim(), 'data-i': i });
    g.append(svgEl('circle', { cx: x, cy: y, r: dotR }));
    const [lx, ly] = pos(i, R + dotR + 5);
    const cos = Math.cos((2 * Math.PI * i) / n - Math.PI / 2);
    const anchor = cos > 0.25 ? 'start' : cos < -0.25 ? 'end' : 'middle';
    const sin = Math.sin((2 * Math.PI * i) / n - Math.PI / 2);
    const t = svgEl('text', {
      x: lx,
      y: ly + (anchor === 'middle' ? sin * fontSize * 0.5 : 0),
      'font-size': fontSize,
      'dominant-baseline': 'middle',
      'text-anchor': anchor,
    });
    t.textContent = label;
    g.append(t);
    svg.append(g);
  });

  if (spec.centerPoint) {
    const g = svgEl('g', { class: `pt ${spec.centerPoint.cls ?? ''}`.trim(), 'data-i': -1 });
    g.append(svgEl('circle', { cx: c, cy: c, r: dotR }));
    const t = svgEl('text', { x: c, y: c + dotR + fontSize, 'font-size': fontSize, 'text-anchor': 'middle' });
    t.textContent = spec.centerPoint.label;
    g.append(t);
    svg.append(g);
  } else if (spec.center) {
    const t = svgEl('text', { x: c, y: c, 'font-size': 14, 'text-anchor': 'middle', 'dominant-baseline': 'middle', class: 'center' });
    t.textContent = spec.center;
    svg.append(t);
  }
  return svg;
}
