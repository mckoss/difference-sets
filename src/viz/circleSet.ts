// Points 0 … v − 1 around a circle with chords between the members of one
// or two sets. Unlike `chordDiagram` (the notebook port, which assumes a
// planar set), this works for any v and any subset, and every point is a
// labeled target that a widget can make clickable.

import { mod } from '../math/numbers';

const SVG_NS = 'http://www.w3.org/2000/svg';

export function svgEl<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number> = {},
  text?: string,
): SVGElementTagNameMap[K] {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [name, value] of Object.entries(attrs)) el.setAttribute(name, String(value));
  if (text !== undefined) el.textContent = text;
  return el;
}

export interface CircleSetOptions {
  v: number;
  /** The main set: red points, blue chords. */
  set: readonly number[];
  /** An optional second set (e.g. a translate): its own color, with shared points ringed. */
  other?: readonly number[];
  /** Make points focusable buttons. */
  interactive?: boolean;
  title: string;
}

/** Radius of the circle for v points, so neighbors stay about 14 units apart. */
const radiusFor = (v: number) => Math.max(70, (14 * v) / (2 * Math.PI));

export function circleSet({ v, set, other, interactive = false, title }: CircleSetOptions): SVGSVGElement {
  const r = radiusFor(v);
  const pad = 24;
  const size = 2 * (r + pad);
  const c = size / 2;
  const at = (i: number, radius = r): [number, number] => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / v;
    return [c + radius * Math.cos(angle), c + radius * Math.sin(angle)];
  };
  const inA = new Set(set);
  const inB = new Set(other ?? []);

  const svg = svgEl('svg', { viewBox: `0 0 ${size} ${size}`, class: 'circle-set', role: 'img' });
  svg.append(svgEl('title', {}, title));
  svg.append(svgEl('circle', { cx: c, cy: c, r, class: 'rim' }));

  const chords = (members: readonly number[], cls: string) => {
    for (let i = 0; i < members.length; i++) {
      for (let j = i + 1; j < members.length; j++) {
        const a = members[i];
        const b = members[j];
        const [x1, y1] = at(a);
        const [x2, y2] = at(b);
        svg.append(
          svgEl('line', {
            x1,
            y1,
            x2,
            y2,
            class: cls,
            'data-diffs': `${mod(a - b, v)} ${mod(b - a, v)}`,
          }),
        );
      }
    }
  };
  if (other) chords(other, 'chord chord-b');
  chords(set, 'chord chord-a');

  const font = v > 40 ? 9 : 11;
  for (let i = 0; i < v; i++) {
    const [x, y] = at(i);
    const [lx, ly] = at(i, r + 16);
    const a = inA.has(i);
    const b = inB.has(i);
    const cls = ['pt', a && 'in-a', b && 'in-b', a && b && 'in-both'].filter(Boolean).join(' ');
    const g = svgEl('g', { class: cls, 'data-point': i });
    if (interactive) {
      g.setAttribute('tabindex', '0');
      g.setAttribute('role', 'button');
      g.setAttribute('aria-pressed', String(a));
      g.setAttribute('aria-label', `Point ${i}`);
      // A generous invisible hit target for fingers.
      g.append(svgEl('circle', { cx: x, cy: y, r: Math.max(9, Math.min(14, (Math.PI * r) / v)), class: 'hit' }));
    }
    if (a && b) g.append(svgEl('circle', { cx: x, cy: y, r: 9, class: 'ring' }));
    g.append(svgEl('circle', { cx: x, cy: y, r: a || b ? 5 : 3, class: 'dot' }));
    g.append(svgEl('text', { x: lx, y: ly + font / 3, 'font-size': font, class: 'pt-label' }, String(i)));
    svg.append(g);
  }
  return svg;
}

/** Highlight the chords whose difference is d (or none when d is null). */
export function highlightDifference(svg: SVGSVGElement, d: number | null): void {
  for (const line of svg.querySelectorAll<SVGLineElement>('line.chord-a')) {
    const diffs = (line.dataset.diffs ?? '').split(' ').map(Number);
    line.classList.toggle('hot', d !== null && diffs.includes(d));
  }
}
