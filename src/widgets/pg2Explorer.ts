import {
  cross,
  formatPoint,
  formatVec,
  type GF,
  joinLine,
  meetPoint,
  normalize,
  type PG2,
  pg2,
  singerFrame,
  singerLine,
  type Vec,
} from '../math/projective';
import { planeCircle } from '../viz/planeCircle';
import { h, selectControl } from './ui';

const DEFAULT_QS = [2, 3, 4, 5, 7];
const ALL_QS = [2, 3, 4, 5, 7, 8, 9];

type Selection = { kind: 'points' | 'lines'; items: number[] };

/** "1·0 + 2·1 + 1·1 = 3 ≡ 0 (mod 3)": the dot product n · u written out. */
export function dotText(F: GF, n: Vec, u: Vec): string {
  const terms = n.map((a, i) => `${F.label(a)}·${F.label(u[i])}`).join(' + ');
  const value = F.add(F.add(F.mul(n[0], u[0]), F.mul(n[1], u[1])), F.mul(n[2], u[2]));
  if (F.e === 1) {
    const sum = n[0] * u[0] + n[1] * u[1] + n[2] * u[2];
    return sum === value ? `${terms} = ${sum}` : `${terms} = ${sum} ≡ ${value} (mod ${F.p})`;
  }
  return `${terms} = ${F.label(value)}`;
}

const listPoints = (P: PG2, pts: readonly number[]) => pts.map((i) => formatPoint(P.F, P.points[i])).join(', ');

/**
 * `<div data-widget="pg2-explorer" data-q="3" data-views="grid,circle" data-qs="2,3,4" data-url-state>`:
 * the projective plane PG(2, q). The grid view lays out the q² points
 * [1 : y : z] as a square with the q + 1 points at infinity below it; the
 * circle view places points by Singer number, where each line is a
 * translate D + j. Click two points to see the line through them (its
 * coordinates are their cross product, and incidence is a dot product), or
 * two lines to see where they meet.
 */
export function mount(el: HTMLElement): void {
  const useUrl = el.hasAttribute('data-url-state');
  const params = new URLSearchParams(useUrl ? location.search : '');
  const qs = (el.dataset.qs ?? '').split(',').map(Number).filter((x) => ALL_QS.includes(x));
  const choices = qs.length > 0 ? qs : DEFAULT_QS;
  const views = new Set((params.get('view') ?? el.dataset.views ?? 'grid').split(','));
  if (!views.has('grid') && !views.has('circle')) views.add('grid');
  const fromUrl = Number(params.get('q'));
  let q = choices.includes(fromUrl) ? fromUrl : choices.includes(Number(el.dataset.q)) ? Number(el.dataset.q) : choices[0];
  const parseList = (s: string | null) => (s ? s.split(',').map(Number).filter((x) => Number.isInteger(x)) : []);
  let sel: Selection = params.get('lines')
    ? { kind: 'lines', items: parseList(params.get('lines')) }
    : { kind: 'points', items: parseList(params.get('points')) };

  const controls = h('div', { class: 'controls' });
  const verdict = h('p', { class: 'ff-verdict ok pg-verdict' });
  const views$ = h('div', { class: 'pg-views' });
  const info = h('div', { class: 'ff-info pg-info', attrs: { 'aria-live': 'polite' } });
  const lineHead = h('p', { class: 'pg-list-head' });
  const lineList = h('div', { class: 'line-list pg-lines' });

  const writeUrl = () => {
    if (!useUrl) return;
    const url = new URL(location.href);
    url.searchParams.set('q', String(q));
    url.searchParams.delete('points');
    url.searchParams.delete('lines');
    if (sel.items.length > 0) url.searchParams.set(sel.kind, sel.items.join(','));
    history.replaceState(null, '', url.toString().replaceAll('%2C', ','));
  };

  let render = () => {};

  const pick = (kind: Selection['kind'], x: number) => {
    if (sel.kind !== kind) sel = { kind, items: [] };
    const items = sel.items.includes(x) ? sel.items.filter((y) => y !== x) : [...sel.items, x].slice(-2);
    sel = { kind, items };
    render();
  };

  const build = () => {
    const P = pg2(q);
    const F = P.F;
    const S = views.has('circle') ? singerFrame(q) : null;
    sel.items = sel.items.filter((x) => x >= 0 && x < P.v);

    controls.replaceChildren(
      selectControl(
        'q =',
        choices.map((x) => ({ value: String(x), label: String(x) })),
        String(q),
        (val) => {
          q = Number(val);
          sel = { kind: 'points', items: [] };
          build();
        },
        'pg-q',
      ).wrap,
      Object.assign(h('button', { class: 'ff-button pg-clear', text: 'Clear', attrs: { type: 'button' } }), {
        onclick: () => {
          sel = { kind: 'points', items: [] };
          render();
        },
      }),
    );

    // Check both axioms by brute force, so the verdict is computed, not asserted.
    let pairs = 0;
    let good = 0;
    for (let i = 0; i < P.v; i++) {
      for (let j = i + 1; j < P.v; j++) {
        pairs++;
        const shared = P.lineSets[i].filter((x) => P.lineSets[j].includes(x)).length;
        const through = P.pencils[i].filter((x) => P.pencils[j].includes(x)).length;
        if (shared === 1 && through === 1) good++;
      }
    }
    verdict.className = `ff-verdict pg-verdict ${good === pairs ? 'ok' : 'bad'}`;
    verdict.textContent =
      `PG(2, ${q}): ${P.v} points and ${P.v} lines, ${q + 1} points on every line and ${q + 1} lines through every point. ` +
      `Checked all ${pairs} pairs: every two points lie on exactly one line, and every two lines meet in exactly one point.`;

    // Grid view: the q × q square of points [1 : y : z], then the points at infinity.
    const gridButtons = new Map<number, HTMLButtonElement>();
    const pointButton = (i: number) => {
      const b = h('button', { class: 'pg-pt', attrs: { type: 'button', 'data-point': String(i) } });
      b.append(h('span', { class: 'pg-coords', text: formatPoint(F, P.points[i]) }));
      if (S) b.append(h('span', { class: 'pg-num', text: `point ${S.pointToSinger[i]}` }));
      b.addEventListener('click', () => pick('points', i));
      gridButtons.set(i, b);
      return b;
    };
    const parts: HTMLElement[] = [];
    if (views.has('grid')) {
      const grid = h('div', { class: 'pg-grid', attrs: { style: `grid-template-columns: repeat(${q}, auto)` } });
      for (let y = 0; y < q; y++) for (let z = 0; z < q; z++) grid.append(pointButton(y * q + z));
      const inf = h('div', { class: 'pg-infinity' });
      for (let i = q * q; i < P.v; i++) inf.append(pointButton(i));
      parts.push(
        h(
          'div',
          { class: 'pg-grid-view' },
          h('p', { class: 'pg-list-head', text: `The ${q * q} points [1 : y : z] (row y, column z)` }),
          h('div', { class: 'ff-scroll' }, grid),
          h('p', { class: 'pg-list-head', text: `The ${q + 1} points at infinity, with x = 0` }),
          h('div', { class: 'ff-scroll' }, inf),
        ),
      );
    }
    let circle: ReturnType<typeof planeCircle> | null = null;
    if (S) {
      circle = planeCircle(P.v, `PG(2, ${q}) with points numbered by powers of α`, true);
      const activate = (t: Element) => {
        const g = t.closest<SVGGElement>('[data-point]');
        if (g) pick('points', S.singerToPoint[Number(g.dataset.point)]);
      };
      circle.svg.addEventListener('click', (e) => activate(e.target as Element));
      circle.svg.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          activate(e.target as Element);
        }
      });
      parts.push(
        h(
          'div',
          { class: 'pg-circle-view' },
          h('p', { class: 'pg-list-head', text: 'Numbered by powers of α: point i is the point of αⁱ' }),
          circle.svg,
        ),
      );
    }
    views$.replaceChildren(...parts);
    views$.classList.toggle('two', parts.length === 2);

    lineHead.textContent = S
      ? `The ${P.v} lines [a : b : c], each the points with ax + by + cz = 0, and their point numbers`
      : `The ${P.v} lines [a : b : c], each the points with ax + by + cz = 0`;
    const lineButtons = P.lines.map((n, j) => {
      const b = h('button', {
        text: S ? `${formatPoint(F, n)} = {${singerLine(S, j).join(', ')}}` : formatPoint(F, n),
        attrs: { type: 'button', 'data-line': String(j) },
      });
      b.addEventListener('click', () => pick('lines', j));
      return b;
    });
    lineList.replaceChildren(...lineButtons);

    render = () => {
      const pts = new Set<number>();
      const res = new Set<number>();
      const selLines = new Set<number>();
      const resLines = new Set<number>();
      const paras: string[] = [];
      let shown: number | null = null;
      if (sel.kind === 'points') {
        sel.items.forEach((i) => pts.add(i));
        if (sel.items.length === 2) {
          const [a, b] = sel.items;
          const j = joinLine(P, a, b);
          shown = j;
          resLines.add(j);
          P.lineSets[j].forEach((i) => !pts.has(i) && res.add(i));
          const n = P.lines[j];
          const raw = cross(F, P.points[a], P.points[b]);
          paras.push(
            `The line through ${formatPoint(F, P.points[a])} and ${formatPoint(F, P.points[b])} is ${formatPoint(F, n)}: ` +
              `the points [x : y : z] with ${F.label(n[0])}·x + ${F.label(n[1])}·y + ${F.label(n[2])}·z = 0.`,
            `Its coordinates come from the cross product ${formatVec(F, raw)}` +
              (raw.join() === n.join() ? '.' : `, scaled to ${formatPoint(F, normalize(F, raw))}.`),
            `Check: ${dotText(F, n, P.points[a])} and ${dotText(F, n, P.points[b])}.`,
            `It holds ${q + 1} points: ${listPoints(P, P.lineSets[j])}.`,
          );
        } else if (sel.items.length === 1) {
          const a = sel.items[0];
          P.pencils[a].forEach((j) => resLines.add(j));
          paras.push(
            `The point ${formatPoint(F, P.points[a])} lies on ${q + 1} lines: ` +
              `${P.pencils[a].map((j) => formatPoint(F, P.lines[j])).join(', ')}. Click a second point.`,
          );
        }
      } else {
        sel.items.forEach((j) => selLines.add(j));
        if (sel.items.length === 2) {
          const [i, j] = sel.items;
          const m = meetPoint(P, i, j);
          res.add(m);
          paras.push(
            `The lines ${formatPoint(F, P.lines[i])} and ${formatPoint(F, P.lines[j])} meet in exactly one point, ` +
              `${formatPoint(F, P.points[m])} (the cross product of their coordinates, scaled).`,
            `Check: ${dotText(F, P.lines[i], P.points[m])} and ${dotText(F, P.lines[j], P.points[m])}.`,
          );
        } else if (sel.items.length === 1) {
          const j = sel.items[0];
          shown = j;
          P.lineSets[j].forEach((i) => res.add(i));
          paras.push(`The line ${formatPoint(F, P.lines[j])} holds ${q + 1} points: ${listPoints(P, P.lineSets[j])}. Click a second line.`);
        }
      }
      if (paras.length === 0) {
        paras.push('Click two points to find the line through them, or two lines (in the list below) to find where they meet.');
      }
      info.replaceChildren(...paras.map((t) => h('p', { text: t })));
      for (const [i, b] of gridButtons) {
        b.classList.toggle('selected', pts.has(i));
        b.classList.toggle('result', res.has(i));
        b.setAttribute('aria-pressed', String(pts.has(i)));
      }
      lineButtons.forEach((b, j) => {
        b.classList.toggle('selected', selLines.has(j));
        b.classList.toggle('result', resLines.has(j));
      });
      if (circle && S) {
        const toS = (i: number) => S.pointToSinger[i];
        circle.draw({
          line: shown === null ? [] : singerLine(S, shown),
          points: [...pts].map(toS),
          result: [...res].map(toS),
        });
      }
      writeUrl();
    };
    render();
  };

  el.classList.add('widget', 'ff-widget', 'pg-explorer');
  el.replaceChildren(controls, verdict, views$, info, lineHead, lineList);
  build();
}
