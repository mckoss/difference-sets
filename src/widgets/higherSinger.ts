import { differenceCounts } from '../math/difference';
import { autocorrelation, plusMinus, plusMinusOffPeak } from '../math/sequences';
import { mSequence, singerParams, singerSetPG } from '../math/singerPG';
import { svgEl } from '../viz/circleSet';

/** Largest v the widget draws. */
const MAX_V = 520;
const Q_CHOICES = [2, 3, 4, 5];

const sup = (n: number) => [...String(n)].map((d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(d)]).join('');

function mChoices(q: number): number[] {
  const out: number[] = [];
  for (let m = 2; singerParams(q, m).v <= MAX_V; m++) out.push(m);
  return out;
}

/** The v residues as a strip of cells, members of D filled. */
function strip(v: number, set: readonly number[]): SVGSVGElement {
  const cols = v <= 31 ? v : v <= 127 ? Math.ceil(v / Math.ceil(v / 32)) : 32;
  const rows = Math.ceil(v / cols);
  const cell = 18;
  const labels = v <= 127;
  const rowH = cell + (labels ? 12 : 3);
  const w = cols * cell;
  const svg = svgEl('svg', { viewBox: `0 0 ${w} ${rows * rowH}`, class: 'singer-strip', role: 'img' });
  svg.append(svgEl('title', {}, `The ${v} points, with the ${set.length} members of D filled in`));
  const inD = new Set(set);
  for (let i = 0; i < v; i++) {
    const x = (i % cols) * cell;
    const y = Math.floor(i / cols) * rowH;
    const g = svgEl('g', { class: inD.has(i) ? 'cell in' : 'cell' });
    g.append(svgEl('rect', { x: x + 1, y: y + 1, width: cell - 2, height: cell - 2, rx: 3 }));
    if (labels) g.append(svgEl('text', { x: x + cell / 2, y: y + cell + 9 }, String(i)));
    svg.append(g);
  }
  return svg;
}

/** Bars for values[from…], drawn against a zero line, with the first bar optionally highlighted. */
function bars(values: readonly number[], from: number, label: string, peakFirst = false): SVGSVGElement {
  const n = values.length - from;
  const w = 600;
  const h = 120;
  const top = 14;
  const bottom = 18;
  const max = Math.max(1, ...values.map(Math.abs));
  const min = Math.min(0, ...values);
  const scale = (h - top - bottom) / (max - min);
  const zero = top + max * scale;
  const step = w / n;
  const svg = svgEl('svg', { viewBox: `0 0 ${w} ${h}`, class: 'singer-bars', role: 'img', preserveAspectRatio: 'none' });
  svg.append(svgEl('title', {}, label));
  for (let i = 0; i < n; i++) {
    const val = values[i + from];
    const y = val >= 0 ? zero - val * scale : zero;
    const height = Math.max(Math.abs(val) * scale, 1);
    svg.append(
      svgEl('rect', {
        x: i * step + step * 0.15,
        y,
        width: Math.max(step * 0.7, 0.6),
        height,
        class: peakFirst && i === 0 ? 'bar peak' : 'bar',
      }),
    );
  }
  svg.append(svgEl('line', { x1: 0, x2: w, y1: zero, y2: zero, class: 'zero' }));
  return svg;
}

/**
 * `<div data-widget="higher-singer" data-q="2" data-m="3">`: the Singer set of
 * PG(m, q), its parameters, its flat difference tally, and (for q = 2) the
 * shift-register sequence whose zeros it is, with its two-level autocorrelation.
 */
export function mount(el: HTMLElement): void {
  let q = Number(el.dataset.q ?? 2);
  let m = Number(el.dataset.m ?? 3);

  const controls = document.createElement('div');
  controls.className = 'controls';
  const qLabel = document.createElement('label');
  qLabel.className = 'control';
  const qSelect = document.createElement('select');
  qSelect.className = 'q-select';
  for (const x of Q_CHOICES) qSelect.append(new Option(String(x), String(x)));
  qLabel.append('q = ', qSelect);
  const mLabel = document.createElement('label');
  mLabel.className = 'control';
  const mSelect = document.createElement('select');
  mSelect.className = 'm-select';
  mLabel.append('m = ', mSelect);
  controls.append(qLabel, mLabel);

  const params = document.createElement('p');
  params.className = 'singer-params';
  params.setAttribute('aria-live', 'polite');
  const stripBox = document.createElement('div');
  stripBox.className = 'strip-box';
  const setLine = document.createElement('p');
  setLine.className = 'set-line';
  const tallyNote = document.createElement('p');
  tallyNote.className = 'table-note ok tally-note';
  const tallyBox = document.createElement('div');
  const register = document.createElement('div');
  register.className = 'register';
  const corrNote = document.createElement('p');
  corrNote.className = 'corr-note';
  const corrBox = document.createElement('div');

  const render = () => {
    const ms = mChoices(q);
    if (!ms.includes(m)) m = ms[Math.min(ms.length - 1, 1)];
    mSelect.replaceChildren(...ms.map((x) => new Option(String(x), String(x))));
    qSelect.value = String(q);
    mSelect.value = String(m);
    const { v, k, lambda } = singerParams(q, m);
    const D = singerSetPG(q, m);
    params.innerHTML = '';
    params.append(
      `PG(${m}, ${q}): v = (${q}${sup(m + 1)} − 1)/(${q} − 1) = ${v} points, ` +
        `k = (${q}${sup(m)} − 1)/(${q} − 1) = ${k} points on each hyperplane, ` +
        `λ = (${q}${sup(m - 1)} − 1)/(${q} − 1) = ${lambda}.`,
    );
    stripBox.replaceChildren(strip(v, D));
    setLine.textContent = v <= 127 ? `D = {${D.join(', ')}} mod ${v}` : `D has ${k} of the ${v} points.`;
    const counts = differenceCounts(D, v);
    const flat = counts.slice(1).every((c) => c === lambda);
    tallyNote.textContent = flat
      ? `Every nonzero difference 1, 2, …, ${v - 1} occurs exactly λ = ${lambda} time${lambda === 1 ? '' : 's'}.`
      : 'The differences are not all equal.';
    tallyBox.replaceChildren(bars(counts, 1, `How often each difference 1 to ${v - 1} occurs`));

    register.replaceChildren();
    if (q === 2) {
      const n = m + 1;
      const { bits, poly } = mSequence(n);
      const taps = poly
        .slice(0, n)
        .flatMap((c, j) => (c ? [j === 0 ? 'bᵢ' : `bᵢ₊${'₀₁₂₃₄₅₆₇₈₉'[j]}`] : []))
        .join(' + ');
      const rule = document.createElement('p');
      rule.className = 'register-rule';
      rule.textContent = `Shift register: start with ${n} bits ${bits.slice(0, n).join(' ')}, then keep adding bᵢ₊${'₀₁₂₃₄₅₆₇₈₉'[n]} = ${taps} (mod 2).`;
      const seq = document.createElement('p');
      seq.className = 'register-bits';
      seq.setAttribute('aria-label', 'The bits of one period');
      bits.slice(0, Math.min(bits.length, 127)).forEach((b, i) => {
        const s = document.createElement('span');
        s.className = b ? 'bit one' : 'bit zero';
        s.textContent = String(b);
        s.title = `b${i} = ${b}`;
        seq.append(s);
      });
      if (bits.length > 127) seq.append(' …');
      const note = document.createElement('p');
      note.className = 'hint';
      note.textContent = `The bits repeat every ${v} steps, and the 0s fall exactly on the members of D.`;
      register.append(rule, seq, note);
    }

    const corr = autocorrelation(plusMinus(D, v));
    const off = plusMinusOffPeak(v, k, lambda);
    corrNote.textContent =
      `As a ±1 sequence (−1 on D, +1 elsewhere), compared with itself shifted by t: ` +
      `${v} at t = 0, and v − 4(k − λ) = ${off < 0 ? `−${-off}` : off} at every other shift.`;
    corrBox.replaceChildren(bars(corr, 0, `Autocorrelation at shifts 0 to ${v - 1}`, true));
  };

  qSelect.addEventListener('change', () => {
    q = Number(qSelect.value);
    render();
  });
  mSelect.addEventListener('change', () => {
    m = Number(mSelect.value);
    render();
  });

  const h1 = document.createElement('p');
  h1.className = 'widget-heading';
  h1.textContent = 'The hyperplane D';
  const h2 = document.createElement('p');
  h2.className = 'widget-heading';
  h2.textContent = 'Difference tally';
  const h3 = document.createElement('p');
  h3.className = 'widget-heading';
  h3.textContent = 'Autocorrelation';
  el.classList.add('widget', 'higher-singer');
  el.replaceChildren(controls, params, h1, stripBox, setLine, register, h2, tallyBox, tallyNote, h3, corrBox, corrNote);
  render();
}
