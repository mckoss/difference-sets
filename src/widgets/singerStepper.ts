import { traceLine, traceSteps } from '../math/construction';
import { differenceCounts, pairsWithDifference, translate } from '../math/difference';
import { superscript } from '../math/poly';
import { formatPoint, lineIndex, normalize, singerFrame, singerLine } from '../math/projective';
import { binomial } from '../math/search';
import { chordDiagram } from '../viz/chordDiagram';
import { alphaPoly, cubicText } from './fieldPoints';
import { formatCount, setText } from './format';
import { emitState, h, opTable, selectControl } from './ui';

const ALL_QS = [2, 3, 4, 5, 7, 8, 9, 11, 13];

const pow = (n: number) => (n === 0 ? '1' : n === 1 ? 'α' : `α${superscript(n)}`);

/**
 * `<div data-widget="singer-stepper" data-q="2" [data-qs="2,3,4"] [data-url-state]>`:
 * Singer's construction one exponent at a time. For i = 0, 1, …, v − 1 it
 * shows αⁱ, its conjugates α^(iq) and α^(iq²), their sum Tr(αⁱ), and whether
 * i joins D. The chord diagram grows as members join; at the end the widget
 * checks every nonzero difference and sets the cost beside a brute-force
 * search. With `data-url-state`, q and the step count live in `?q=&i=`.
 */
export function mount(el: HTMLElement): void {
  const qs = (el.dataset.qs ?? '')
    .split(',')
    .map(Number)
    .filter((q) => ALL_QS.includes(q));
  const QS = qs.length ? qs : ALL_QS;
  const useUrl = el.hasAttribute('data-url-state');
  const params = new URLSearchParams(useUrl ? location.search : '');
  const urlQ = Number(params.get('q'));
  let q = QS.includes(urlQ) ? urlQ : QS.includes(Number(el.dataset.q)) ? Number(el.dataset.q) : QS[0];
  let done = Math.max(0, Math.floor(Number(params.get('i') ?? 0)) || 0);
  let timer: number | undefined;
  let playing = false;

  const controls = h('div', { class: 'controls' });
  const buttons = h('div', { class: 'controls' });
  const nextBtn = h('button', { class: 'ff-button ss-next', text: 'Next i', attrs: { type: 'button' } });
  const playBtn = h('button', { class: 'ff-button ss-play', text: 'Play', attrs: { type: 'button', 'aria-pressed': 'false' } });
  const finishBtn = h('button', { class: 'ff-button ss-finish', text: 'Finish', attrs: { type: 'button' } });
  const resetBtn = h('button', { class: 'ff-button ss-reset', text: 'Reset', attrs: { type: 'button' } });
  buttons.append(nextBtn, playBtn, finishBtn, resetBtn);
  const rule = h('p', { class: 'ff-verdict ss-rule' });
  const current = h('div', { class: 'ff-info ss-current', attrs: { 'aria-live': 'polite' } });
  const layout = h('div', { class: 'ss-layout' });
  const figure = h('figure', { class: 'ss-figure' });
  const log = h('div', { class: 'ss-log' });
  layout.append(figure, log);
  const result = h('div', { class: 'ss-result' });

  const syncUrl = () => {
    emitState(el, { q: String(q), i: String(done) });
    if (!useUrl) return;
    const url = new URL(location.href);
    url.searchParams.set('q', String(q));
    url.searchParams.set('i', String(done));
    history.replaceState(null, '', url);
  };

  const render = () => {
    const S = singerFrame(q);
    const { F, v } = S;
    const N = q ** 3 - 1;
    const steps = traceSteps(q);
    done = Math.min(done, v);
    const D = steps.slice(0, done).filter((s) => s.inD).map((s) => s.i);

    rule.textContent =
      `GF(${q ** 3}) is c₀ + c₁α + c₂α² with coefficients in GF(${q}), using ${cubicText(F, S.cubic)}. ` +
      `For each i from 0 to v − 1 = ${v - 1}, add up αⁱ, α^(iq), and α^(iq²): that sum is the trace Tr(αⁱ). ` +
      `Keep i when it is 0. (Exponents wrap around at ${q}³ − 1 = ${N}.)`;

    if (done === 0) {
      current.replaceChildren(h('p', { text: `Press Next i to start with i = 0, where α⁰ = 1.` }));
    } else {
      const s = steps[done - 1];
      const { i } = s;
      const [x, xq, xq2] = s.conjugates;
      const e1 = (i * q) % N;
      const e2 = (i * q * q) % N;
      const line = (lhs: string, ...rhs: string[]) => {
        // Drop repeats such as "α² = α²" when a power needs no reducing.
        const parts = rhs.filter((r, k) => r !== (k === 0 ? lhs : rhs[k - 1]));
        return h('li', {}, h('span', { class: 'ss-lhs', text: lhs }), parts.length ? ` = ${parts.join(' = ')}` : '');
      };
      current.replaceChildren(
        h('p', { class: 'pg-list-head', text: `Step i = ${i}` }),
        h(
          'ul',
          { class: 'ss-sum' },
          line(pow(i), alphaPoly(F, x)),
          line(`α^(${i}·${q})`, pow(e1), alphaPoly(F, xq)),
          line(`α^(${i}·${q}²)`, pow(e2), alphaPoly(F, xq2)),
          line(`Tr(${pow(i)})`, F.label(s.trace)),
        ),
        h('p', {
          class: `ff-verdict ss-verdict ${s.inD ? 'ok' : ''}`,
          text: s.inD
            ? `Tr(${pow(i)}) = 0, so ${i} joins D.`
            : `Tr(${pow(i)}) = ${F.label(s.trace)}, not 0, so ${i} is not in D.`,
        }),
      );
    }

    const svg = chordDiagram(D, v);
    svg.classList.add('ss-diagram');
    // Small clocks draw tiny; let them grow a little, and big ones shrink to fit.
    svg.style.width = `${Math.max(Number(svg.getAttribute('width')), 220)}px`;
    figure.replaceChildren(
      svg,
      h('figcaption', { text: `D so far: ${setText(D)}, after checking ${done} of ${v} exponents` }),
    );

    const table = opTable({
      corner: 'i',
      rowHeads: steps.slice(0, done).map((s) => String(s.i)),
      colHeads: ['αⁱ', 'Tr(αⁱ)', 'in D?'],
      cell: (r, c) => {
        const s = steps[r];
        if (c === 0) return alphaPoly(F, s.conjugates[0]);
        if (c === 1) return F.label(s.trace);
        return s.inD ? 'yes' : '';
      },
      rowClass: (r) => `${steps[r].inD ? 'ss-member' : ''} ${r === done - 1 ? 'ss-latest' : ''}`.trim(),
      cls: 'ss-table',
    });
    log.replaceChildren(h('p', { class: 'pg-list-head', text: `${done} of ${v} steps` }), table);
    table.scrollTop = table.scrollHeight;

    if (done < v) {
      result.replaceChildren();
    } else {
      const counts = differenceCounts(D, v);
      const ok = D.length === q + 1 && counts.slice(1).every((c) => c === 1);
      const Z = singerLine(S, lineIndex(S.P, [0, 0, 1]));
      const offset = Array.from({ length: v }, (_, j) => j).find((j) => translate(Z, j, v).join() === D.join());
      const L = traceLine(S);
      const mults = 3 * v;
      result.replaceChildren(
        h('p', {
          class: `ff-verdict ss-done ${ok ? 'ok' : 'bad'}`,
          text: ok
            ? `D = ${setText(D)} is a (${v}, ${q + 1}, 1) difference set: each of the ${v - 1} nonzero differences occurs exactly once.`
            : `D = ${setText(D)} is not a planar difference set.`,
        }),
        h('p', {
          class: 'ss-line',
          text:
            `The trace-zero points are the line [Tr(1) : Tr(α) : Tr(α²)] = ${formatPoint(F, L)}` +
            (formatPoint(F, L) === formatPoint(F, normalize(F, L)) ? '. ' : `, which is ${formatPoint(F, normalize(F, L))}. `) +
            (offset === undefined
              ? ''
              : offset === 0
                ? `It is the line z = 0 from Lesson 13, ${setText(Z)}.`
                : `It is the line z = 0 from Lesson 13, ${setText(Z)}, turned ${offset} notches: D = ${setText(Z)} + ${offset}.`),
        }),
        h('p', { class: 'pg-list-head', text: 'Every difference d = a − b (mod ' + v + '), with a and b in D' }),
        h(
          'ul',
          { class: 'chips ss-diffs' },
          ...Array.from({ length: v - 1 }, (_, k) => {
            const d = k + 1;
            const [a, b] = pairsWithDifference(D, d, v)[0] ?? [NaN, NaN];
            return h('li', { text: `${d} = ${a} − ${b}` });
          }),
        ),
        h('p', {
          class: 'ff-legend ss-cost',
          text:
            `Cost: ${v} steps, each multiplying three running powers by α, α^q, and α^(q²): ${mults} field multiplications. ` +
            `A brute-force search would try up to C(${v}, ${q + 1}) = ${formatCount(binomial(v, q + 1))} sets of ${q + 1} points.`,
        }),
      );
    }

    nextBtn.disabled = done >= v;
    finishBtn.disabled = done >= v;
    if (done >= v) stop();
  };

  const stop = () => {
    playing = false;
    window.clearTimeout(timer);
    playBtn.textContent = 'Play';
    playBtn.setAttribute('aria-pressed', 'false');
  };
  const setDone = (n: number) => {
    done = n;
    render();
    syncUrl();
  };
  const loop = () => {
    if (!playing) return;
    const v = singerFrame(q).v;
    if (done >= v) return stop();
    setDone(done + 1);
    if (playing) timer = window.setTimeout(loop, Math.max(40, Math.min(450, 9000 / v)));
  };

  nextBtn.addEventListener('click', () => {
    stop();
    setDone(done + 1);
  });
  playBtn.addEventListener('click', () => {
    if (playing) return stop();
    if (done >= singerFrame(q).v) done = 0;
    playing = true;
    playBtn.textContent = 'Pause';
    playBtn.setAttribute('aria-pressed', 'true');
    loop();
  });
  finishBtn.addEventListener('click', () => {
    stop();
    setDone(singerFrame(q).v);
  });
  resetBtn.addEventListener('click', () => {
    stop();
    setDone(0);
  });

  controls.append(
    selectControl(
      'q =',
      QS.map((x) => ({ value: String(x), label: String(x) })),
      String(q),
      (val) => {
        stop();
        q = Number(val);
        setDone(0);
      },
      'ss-q',
    ).wrap,
  );

  el.classList.add('widget', 'ff-widget', 'singer-stepper');
  el.replaceChildren(controls, buttons, rule, current, layout, result);
  render();
}
