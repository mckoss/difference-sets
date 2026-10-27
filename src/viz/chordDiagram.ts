import { mod } from '../math/numbers';

const SVG_NS = 'http://www.w3.org/2000/svg';

function svgEl<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number>,
  text?: string,
): SVGElementTagNameMap[K] {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [name, value] of Object.entries(attrs)) el.setAttribute(name, String(value));
  if (text !== undefined) el.textContent = text;
  return el;
}

/**
 * Draw a planar difference set as points on a circle with a chord between
 * every pair of members, each chord labeled with its two differences.
 * Ported from the notebook's `difference_set_svg`, including its label
 * anti-collision search along each chord.
 */
export function chordDiagram(ds: readonly number[]): SVGSVGElement {
  const k = ds.length;
  const v = k * (k - 1) + 1;
  const members = new Set(ds);

  const r = Math.max(50, (12 * v) / (2 * Math.PI));
  const size = 2 * (r + 25);
  const c = size / 2;
  const pointFont = 13;
  const diffFont = pointFont * 0.75;

  const at = (i: number, radius = r): [number, number] => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / v;
    return [c + radius * Math.cos(angle), c + radius * Math.sin(angle)];
  };

  const svg = svgEl('svg', {
    viewBox: `0 0 ${size} ${size}`,
    width: size,
    height: size,
    class: 'chord-diagram',
    role: 'img',
  });
  svg.append(svgEl('title', {}, `Difference set {${ds.join(', ')}} mod ${v}`));
  svg.append(svgEl('circle', { cx: c, cy: c, r, class: 'rim' }));

  const pairs: [number, number][] = [];
  for (let i = 0; i < k; i++) for (let j = i + 1; j < k; j++) pairs.push([ds[i], ds[j]]);

  // Phase 1: chords.
  for (const [a, b] of pairs) {
    const [x1, y1] = at(a);
    const [x2, y2] = at(b);
    svg.append(svgEl('line', { x1, y1, x2, y2, class: 'chord' }));
  }

  // Phase 2: points, with labels on the members.
  for (let i = 0; i < v; i++) {
    const [x, y] = at(i);
    if (members.has(i)) {
      svg.append(svgEl('circle', { cx: x, cy: y, r: 5, class: 'member' }));
      const [lx, ly] = at(i, r + 18);
      svg.append(
        svgEl('text', { x: lx, y: ly + 4, 'font-size': pointFont, class: 'member-label' }, String(i)),
      );
    } else {
      svg.append(svgEl('circle', { cx: x, cy: y, r: 2.5, class: 'point' }));
    }
  }

  // Phase 3: difference labels on top, nudged along the chord to avoid overlaps.
  const occupied: [number, number][] = [];
  const threshold = diffFont * 1.5;
  for (const [a, b] of pairs) {
    const [x1, y1] = at(a);
    const [x2, y2] = at(b);
    const deg = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
    const textAngle = deg >= -90 && deg <= 90 ? deg : deg + 180;

    let pos: [number, number] = [(x1 + x2) / 2, (y1 + y2) / 2];
    for (const t of [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8]) {
      const tx = x1 + (x2 - x1) * t;
      const ty = y1 + (y2 - y1) * t;
      if (occupied.every(([ox, oy]) => Math.hypot(tx - ox, ty - oy) >= threshold)) {
        pos = [tx, ty];
        break;
      }
    }
    occupied.push(pos);
    const [mx, my] = pos;
    svg.append(
      svgEl(
        'text',
        { x: mx, y: my, 'font-size': diffFont, class: 'diff-label', transform: `rotate(${textAngle}, ${mx}, ${my})` },
        `${mod(b - a, v)},${mod(a - b, v)}`,
      ),
    );
  }

  return svg;
}
