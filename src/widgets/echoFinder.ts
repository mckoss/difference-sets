import { argmax, bitsToPlusMinus, randomPlusMinus, received } from '../math/aperture';
import { mod } from '../math/numbers';
import { mulberry32, randomInt } from '../math/random';
import { autocorrelation, correlation } from '../math/sequences';
import { mSequence } from '../math/singerPG';
import { svgEl } from '../viz/circleSet';

const LENGTHS = [3, 4, 5, 6, 7].map((n) => ({ n, v: 2 ** n - 1 }));
const W = 320;

interface ChartOptions {
  title: string;
  height?: number;
  /** Index drawn in the highlight color. */
  current?: number;
  /** Index marked as the found peak. */
  found?: number;
  cls?: string;
}

/** Bars for values[0 … v − 1] from a zero line, scaled to fit. */
function barChart(values: readonly number[], { title, height = 110, current, found, cls = '' }: ChartOptions) {
  const v = values.length;
  const top = 14;
  const bottom = 16;
  const left = 30;
  const plotW = W - left - 4;
  const hi = Math.max(1, ...values);
  const lo = Math.min(0, ...values);
  const plotH = height - top - bottom;
  const y = (x: number) => top + ((hi - x) / (hi - lo)) * plotH;
  const step = plotW / v;
  const barW = Math.max(1, step - (step > 6 ? 2 : step > 3 ? 1 : 0));
  const svg = svgEl('svg', { viewBox: `0 0 ${W} ${height}`, class: `echo-chart ${cls}`.trim(), role: 'img' });
  svg.append(svgEl('title', {}, title));
  for (const t of new Set([hi, 0, Math.round(lo)])) {
    svg.append(svgEl('line', { x1: left - 3, x2: W, y1: y(t), y2: y(t), class: t === 0 ? 'axis' : 'grid' }));
    svg.append(svgEl('text', { x: left - 6, y: y(t) + 3.5, class: 'tick y-tick' }, String(Math.round(t * 10) / 10)));
  }
  values.forEach((x, t) => {
    const y0 = y(Math.max(0, x));
    const h = Math.max(0.75, Math.abs(y(x) - y(0)));
    const state = t === found ? 'found' : t === current ? 'current' : '';
    svg.append(
      svgEl('rect', {
        x: left + t * step + (step - barW) / 2,
        y: x >= 0 ? y0 : y(0),
        width: barW,
        height: h,
        class: `bar ${x < 0 ? 'neg' : 'pos'} ${state}`.trim(),
        'data-t': t,
      }),
    );
  });
  for (const t of [0, v - 1]) {
    svg.append(svgEl('text', { x: left + t * step + step / 2, y: height - 3, class: 'tick' }, String(t)));
  }
  return svg;
}

/** The received signal as bars, with the shifted template drawn on top as a step line. */
function signalStrip(signal: readonly number[], template: readonly number[], title: string) {
  const v = signal.length;
  const height = 110;
  const left = 30;
  const plotW = W - left - 4;
  const lim = Math.max(1.5, ...signal.map(Math.abs));
  const mid = height / 2;
  const scale = (height / 2 - 8) / lim;
  const step = plotW / v;
  const svg = svgEl('svg', { viewBox: `0 0 ${W} ${height}`, class: 'echo-chart echo-signal', role: 'img' });
  svg.append(svgEl('title', {}, title));
  svg.append(svgEl('line', { x1: left - 3, x2: W, y1: mid, y2: mid, class: 'axis' }));
  for (const t of [1, -1]) {
    svg.append(svgEl('text', { x: left - 6, y: mid - t * scale + 3.5, class: 'tick y-tick' }, t > 0 ? '+1' : '−1'));
  }
  signal.forEach((x, i) => {
    svg.append(
      svgEl('rect', {
        x: left + i * step + step * 0.15,
        y: x >= 0 ? mid - x * scale : mid,
        width: Math.max(0.6, step * 0.7),
        height: Math.max(0.5, Math.abs(x) * scale),
        class: 'sig',
      }),
    );
  });
  let d = '';
  template.forEach((x, i) => {
    const yy = mid - x * scale;
    d += `${i === 0 ? 'M' : 'L'} ${left + i * step} ${yy} L ${left + (i + 1) * step} ${yy} `;
  });
  svg.append(svgEl('path', { d, class: 'template' }));
  return svg;
}

const fmt = (x: number) => (Math.round(x * 10) / 10).toFixed(Math.abs(x) >= 100 ? 0 : 1).replace('-', '−');
const int = (x: number) => String(x).replace('-', '−');

function sideLobes(values: readonly number[]): string {
  const off = values.slice(1);
  const lo = Math.min(...off);
  const hi = Math.max(...off);
  return lo === hi ? `every other shift: exactly ${int(lo)}` : `other shifts: anywhere from ${int(lo)} to ${int(hi)}`;
}

/**
 * `<div data-widget="echo-finder" data-n="5">`: an m-sequence of length
 * 2^n − 1 as a ±1 code, hidden at an unknown delay in noise. Slide a template
 * along it and watch the match score; "Find the echo" picks the best shift.
 * Below, the code's own correlation (v, then −1 everywhere) beside a random
 * ±1 code's bumpy one.
 */
export function mount(el: HTMLElement): void {
  let n = Number(el.dataset.n ?? 5);
  if (!LENGTHS.some((l) => l.n === n)) n = 5;
  let noise = Number(el.dataset.noise ?? 1);
  let seed = 1;
  let useRandom = false;
  let shift = 0;
  let found: number | null = null;

  const controls = document.createElement('div');
  controls.className = 'controls';
  const lenLabel = document.createElement('label');
  lenLabel.className = 'control';
  const lenSelect = document.createElement('select');
  lenSelect.className = 'length-select';
  for (const l of LENGTHS) lenSelect.append(new Option(`length ${l.v}`, String(l.n)));
  lenSelect.value = String(n);
  lenLabel.append('Code: ', lenSelect);

  const codeGroup = document.createElement('span');
  codeGroup.className = 'ap-toggle';
  codeGroup.setAttribute('role', 'group');
  codeGroup.setAttribute('aria-label', 'Code');
  const mBtn = document.createElement('button');
  mBtn.type = 'button';
  mBtn.className = 'code-m';
  mBtn.textContent = 'm-sequence';
  const rBtn = document.createElement('button');
  rBtn.type = 'button';
  rBtn.className = 'code-random';
  rBtn.textContent = 'random';
  codeGroup.append(mBtn, rBtn);

  const noiseLabel = document.createElement('label');
  noiseLabel.className = 'control range';
  const noiseInput = document.createElement('input');
  noiseInput.type = 'range';
  noiseInput.className = 'noise-range';
  noiseInput.min = '0';
  noiseInput.max = '3';
  noiseInput.step = '0.25';
  noiseInput.value = String(noise);
  const noiseOut = document.createElement('output');
  noiseLabel.append('noise ', noiseInput, noiseOut);

  const newBtn = document.createElement('button');
  newBtn.type = 'button';
  newBtn.className = 'new-echo';
  newBtn.textContent = 'New echo';
  controls.append(lenLabel, codeGroup, noiseLabel, newBtn);

  const shiftRow = document.createElement('div');
  shiftRow.className = 'controls';
  const shiftLabel = document.createElement('label');
  shiftLabel.className = 'control range echo-shift';
  const shiftInput = document.createElement('input');
  shiftInput.type = 'range';
  shiftInput.className = 'shift-range';
  shiftInput.min = '0';
  const shiftOut = document.createElement('output');
  shiftLabel.append('template shift t = ', shiftInput, shiftOut);
  const findBtn = document.createElement('button');
  findBtn.type = 'button';
  findBtn.className = 'find-echo';
  findBtn.textContent = 'Find the echo';
  shiftRow.append(shiftLabel, findBtn);

  const fig = (cls: string) => {
    const f = document.createElement('figure');
    f.className = `echo-panel ${cls}`;
    const box = document.createElement('div');
    const cap = document.createElement('figcaption');
    f.append(box, cap);
    return { f, box, cap };
  };
  const sig = fig('echo-received');
  const score = fig('echo-score');
  const result = document.createElement('p');
  result.className = 'echo-result';
  result.setAttribute('aria-live', 'polite');

  const prints = document.createElement('div');
  prints.className = 'echo-prints';
  const printM = fig('print-m');
  const printR = fig('print-random');
  prints.append(printM.f, printR.f);

  /** Everything that follows from the settings: the codes, the hidden delay, the signal, and the scores. */
  const state = () => {
    const v = 2 ** n - 1;
    const mCode = bitsToPlusMinus(mSequence(n).bits);
    const rCode = randomPlusMinus(v, mulberry32(1000 + v));
    const code = useRandom ? rCode : mCode;
    const rng = mulberry32(seed * 7919 + v);
    const delay = randomInt(rng, v);
    const signal = received(code, delay, noise, rng);
    return { v, mCode, rCode, code, delay, signal, scores: correlation(code, signal) };
  };

  const render = () => {
    const { v, mCode, rCode, code, delay, signal, scores } = state();
    shift = Math.min(shift, v - 1);

    mBtn.setAttribute('aria-pressed', String(!useRandom));
    rBtn.setAttribute('aria-pressed', String(useRandom));
    noiseOut.textContent = String(noise);
    shiftInput.max = String(v - 1);
    shiftInput.value = String(shift);
    shiftOut.textContent = String(shift);

    const template = code.map((_, i) => code[mod(i - shift, v)]);
    sig.box.replaceChildren(signalStrip(signal, template, 'The received signal with the shifted template'));
    sig.cap.innerHTML = '';
    const s1 = document.createElement('strong');
    s1.textContent = 'Received signal';
    sig.cap.append(
      s1,
      ` (bars): the ${useRandom ? 'random' : 'm-sequence'} code, delayed and buried in noise. The line is the template shifted by t = ${shift}.`,
    );

    score.box.replaceChildren(
      barChart(scores, {
        title: 'Match score C(t) at every shift t',
        current: shift,
        found: found ?? undefined,
        cls: 'echo-scores',
      }),
    );
    score.cap.innerHTML = '';
    const s2 = document.createElement('strong');
    s2.textContent = 'Match score';
    score.cap.append(
      s2,
      ` C(t) at every shift. At t = ${shift}, multiplying the received signal by the template and adding gives C(${shift}) = ${fmt(scores[shift])}.`,
    );

    if (found === null) {
      result.textContent = '';
      result.className = 'echo-result';
    } else {
      const ok = found === delay;
      result.textContent = ok
        ? `The best match is at t = ${found}, scoring ${fmt(scores[found])}. The echo really was delayed by ${delay} steps.`
        : `The best match is at t = ${found}, but the echo was delayed by ${delay} steps. The noise won this time; lower it or use a longer code.`;
      result.className = `echo-result ${ok ? 'ok' : 'bad'}`;
    }

    const am = autocorrelation(mCode);
    const ar = autocorrelation(rCode);
    printM.box.replaceChildren(barChart(am, { title: 'Autocorrelation of the m-sequence', height: 90, cls: 'print' }));
    printM.cap.textContent = `m-sequence of length ${v}: ${int(am[0])} at shift 0, ${sideLobes(am)}.`;
    printR.box.replaceChildren(barChart(ar, { title: 'Autocorrelation of a random code', height: 90, cls: 'print' }));
    printR.cap.textContent = `Random ±1 code of length ${v}: ${int(ar[0])} at shift 0, ${sideLobes(ar)}.`;
  };

  lenSelect.addEventListener('change', () => {
    n = Number(lenSelect.value);
    found = null;
    render();
  });
  mBtn.addEventListener('click', () => {
    useRandom = false;
    found = null;
    render();
  });
  rBtn.addEventListener('click', () => {
    useRandom = true;
    found = null;
    render();
  });
  noiseInput.addEventListener('input', () => {
    noise = Number(noiseInput.value);
    found = null;
    render();
  });
  newBtn.addEventListener('click', () => {
    seed++;
    found = null;
    render();
  });
  shiftInput.addEventListener('input', () => {
    shift = Number(shiftInput.value);
    render();
  });
  findBtn.addEventListener('click', () => {
    found = argmax(state().scores);
    shift = found;
    render();
  });

  const sub = document.createElement('p');
  sub.className = 'echo-subhead';
  sub.textContent = 'Each code compared with itself, at every shift:';

  el.classList.add('widget', 'echo-finder');
  el.replaceChildren(controls, shiftRow, sig.f, score.f, result, sub, prints);
  render();
}
