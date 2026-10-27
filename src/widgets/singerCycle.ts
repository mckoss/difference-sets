import { translate } from '../math/difference';
import {
  alphaMatrix,
  formatPoint,
  formatVec,
  lineIndex,
  mulAlpha,
  pointIndex,
  singerFrame,
  singerLine,
} from '../math/projective';
import { planeCircle } from '../viz/planeCircle';
import { setText } from './format';
import { cubicText } from './fieldPoints';
import { h, opTable, selectControl } from './ui';

const QS = [2, 3, 4, 5];
const STEP_MS = 650;

/**
 * `<div data-widget="singer-cycle" data-q="3">`: multiplying by α as a
 * symmetry of PG(2, q). Points sit around a circle by Singer number; one
 * line (start: z = 0, the points with no α² term) is drawn as a polygon.
 * Each press multiplies every point of the line by α, which turns the
 * polygon one notch: point i goes to i + 1, the line D + j goes to the line
 * D + j + 1, and after v presses every line has appeared once.
 */
export function mount(el: HTMLElement): void {
  let q = QS.includes(Number(el.dataset.q)) ? Number(el.dataset.q) : 3;
  let j = 0;
  let visited = new Set<number>([0]);
  let timer: number | undefined;
  let playing = false;
  let busy = false;
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const controls = h('div', { class: 'controls' });
  const buttons = h('div', { class: 'controls' });
  const stepBtn = h('button', { class: 'ff-button sc-step', text: 'Multiply by α', attrs: { type: 'button' } });
  const playBtn = h('button', { class: 'ff-button sc-play', text: 'Play', attrs: { type: 'button', 'aria-pressed': 'false' } });
  const resetBtn = h('button', { class: 'ff-button sc-reset', text: 'Reset', attrs: { type: 'button' } });
  buttons.append(stepBtn, playBtn, resetBtn);
  const figure = h('div', { class: 'sc-figure' });
  const status = h('p', { class: 'ff-verdict sc-status', attrs: { 'aria-live': 'polite' } });
  const detail = h('div', { class: 'sc-detail' });
  const chips = h('ul', { class: 'chips sc-chips' });
  let circle = planeCircle(7, '');

  const setup = () => {
    const S = singerFrame(q);
    circle = planeCircle(S.v, `PG(2, ${q}), points numbered 0 to ${S.v - 1} by powers of α`);
    figure.replaceChildren(circle.svg);
    controls.replaceChildren(
      selectControl(
        'q =',
        QS.map((x) => ({ value: String(x), label: String(x) })),
        String(q),
        (val) => {
          stop();
          q = Number(val);
          j = 0;
          visited = new Set([0]);
          setup();
        },
        'sc-q',
      ).wrap,
    );
    render();
  };

  const render = () => {
    const S = singerFrame(q);
    const { F, P, v } = S;
    const D = singerLine(S, lineIndex(P, [0, 0, 1]));
    const line = translate(D, j, v);
    const next = translate(D, j + 1, v);
    // The coordinate line holding these points.
    const coordLine = P.lineSets.findIndex((s) => s.map((pt) => S.pointToSinger[pt]).sort((a, b) => a - b).join() === line.join());
    circle.shape.style.transition = 'none';
    circle.shape.style.transform = '';
    circle.draw({ line, points: line });

    const M = alphaMatrix(F, S.cubic);
    status.className = `ff-verdict sc-status ${visited.size === v ? 'ok' : ''}`;
    status.textContent =
      `Line D + ${j} = ${setText(line)}, with coordinates ${formatPoint(F, P.lines[coordLine])}. ` +
      (visited.size === v
        ? `All ${v} lines have appeared, each exactly once: every line is a translate of D = ${setText(D)}.`
        : `${visited.size} of ${v} lines seen so far.`);

    detail.replaceChildren(
      h('p', {
        class: 'pg-list-head',
        text: `Multiplying by α (${cubicText(F, S.cubic)}) sends each point of this line to the next number`,
      }),
      opTable({
        corner: 'point i',
        rowHeads: line.map(String),
        colHeads: ['coordinates', 'times α', 'point i + 1'],
        cell: (r, c) => {
          const pt = P.points[S.singerToPoint[line[r]]];
          if (c === 0) return formatPoint(F, pt);
          const image = mulAlpha(F, S.cubic, pt);
          if (c === 1) return formatVec(F, image);
          return `${(line[r] + 1) % v} = ${formatPoint(F, P.points[pointIndex(P, image)])}`;
        },
        cls: 'sc-table',
      }),
      h('p', {
        class: 'ff-legend',
        text:
          `As a matrix, α·(x, y, z) = (${F.label(M[0][2])}·z, x + ${F.label(M[1][2])}·z, y + ${F.label(M[2][2])}·z). ` +
          `The new points ${setText(next)} are the line D + ${(j + 1) % v}.`,
      }),
    );

    chips.replaceChildren(
      ...Array.from({ length: v }, (_, t) => {
        const li = h('li', { text: `D + ${t}` });
        if (visited.has(t)) li.classList.add('seen');
        if (t === j) li.classList.add('now');
        return li;
      }),
    );
  };

  const advance = () =>
    new Promise<void>((resolve) => {
      if (busy) return resolve();
      const v = singerFrame(q).v;
      const commit = () => {
        j = (j + 1) % v;
        visited.add(j);
        busy = false;
        render();
        resolve();
      };
      if (reduced()) return commit();
      busy = true;
      const c = circle.center;
      circle.shape.style.transformOrigin = `${c}px ${c}px`;
      circle.shape.style.transition = `transform ${STEP_MS - 150}ms ease-in-out`;
      // Force a style flush so the transition starts from 0.
      void circle.shape.getBoundingClientRect();
      circle.shape.style.transform = `rotate(${360 / v}deg)`;
      window.setTimeout(commit, STEP_MS - 100);
    });

  const stop = () => {
    playing = false;
    window.clearTimeout(timer);
    playBtn.textContent = 'Play';
    playBtn.setAttribute('aria-pressed', 'false');
  };
  const loop = async () => {
    if (!playing) return;
    await advance();
    if (playing) timer = window.setTimeout(loop, 250);
  };

  stepBtn.addEventListener('click', () => {
    stop();
    void advance();
  });
  playBtn.addEventListener('click', () => {
    if (playing) return stop();
    playing = true;
    playBtn.textContent = 'Pause';
    playBtn.setAttribute('aria-pressed', 'true');
    void loop();
  });
  resetBtn.addEventListener('click', () => {
    stop();
    j = 0;
    visited = new Set([0]);
    render();
  });

  el.classList.add('widget', 'ff-widget', 'singer-cycle');
  el.replaceChildren(controls, buttons, figure, status, chips, detail);
  setup();
}
