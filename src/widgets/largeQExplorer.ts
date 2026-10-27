import { primePowersUpTo } from '../math/numbers';
import { DENSITY_SIZE, RIM_INSET, type ExplorerResult } from '../workers/singerExplorer.worker';

const Q_VALUES = primePowersUpTo(1024);
const MAX_CANVAS = 640;

const num = (x: number) => x.toLocaleString('en-US');
const ms = (t: number) => (t < 10 ? `${t.toFixed(1)} ms` : `${num(Math.round(t))} ms`);

function cssVar(el: Element, name: string, fallback: string): string {
  return getComputedStyle(el).getPropertyValue(name).trim() || fallback;
}

/** A canvas sized to its box at the device's pixel ratio; returns the context and the size in CSS pixels. */
function prepare(canvas: HTMLCanvasElement, width: number, height: number): CanvasRenderingContext2D {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  const ctx = canvas.getContext('2d')!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  return ctx;
}

/** An "r, g, b" triple for any CSS color. */
function rgbOf(ctx: CanvasRenderingContext2D, color: string): [number, number, number] {
  ctx.fillStyle = '#000';
  ctx.fillStyle = color;
  const s = String(ctx.fillStyle);
  if (s.startsWith('#')) return [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16)) as [number, number, number];
  const m = s.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0];
  return [m[0], m[1], m[2]];
}

/**
 * Chords given as a crossing count per grid cell, shaded so that a cell
 * crossed by many chords is darker: opacity 1 − e^(−count / scale), with the
 * scale set by the average count, so any number of chords reads as a texture.
 */
function densityImage(ctx: CanvasRenderingContext2D, density: Uint32Array, color: string): HTMLCanvasElement {
  const n = DENSITY_SIZE;
  const [r, g, b] = rgbOf(ctx, color);
  let total = 0;
  let cells = 0;
  for (const x of density) {
    if (x) {
      total += x;
      cells++;
    }
  }
  const scale = Math.max(1, total / Math.max(1, cells)) * 0.9;
  const off = document.createElement('canvas');
  off.width = n;
  off.height = n;
  const octx = off.getContext('2d')!;
  const img = octx.createImageData(n, n);
  for (let i = 0; i < density.length; i++) {
    const a = density[i] ? 1 - Math.exp(-density[i] / scale) : 0;
    img.data[4 * i] = r;
    img.data[4 * i + 1] = g;
    img.data[4 * i + 2] = b;
    img.data[4 * i + 3] = Math.round(255 * 0.85 * a);
  }
  octx.putImageData(img, 0, 0);
  return off;
}

/** Points on a circle, members of D as dots, and every chord between two members as a faint line. */
function drawChords(
  canvas: HTMLCanvasElement,
  size: number,
  v: number,
  set: readonly number[],
  density: Uint32Array | null,
): void {
  const ctx = prepare(canvas, size, size);
  const c = size / 2;
  const r = size / 2 - RIM_INSET * size;
  const at = (i: number): [number, number] => {
    const a = -Math.PI / 2 + (2 * Math.PI * i) / v;
    return [c + r * Math.cos(a), c + r * Math.sin(a)];
  };
  ctx.strokeStyle = cssVar(canvas, '--rim', '#e0e0e0');
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(c, c, r, 0, 2 * Math.PI);
  ctx.stroke();

  const k = set.length;
  const pts = set.map(at);
  const chord = cssVar(canvas, '--chord', 'rgba(66, 133, 244, 0.4)');
  if (density) {
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(densityImage(ctx, density, chord), 0, 0, size, size);
  }
  ctx.strokeStyle = chord;
  // Fainter lines as their number grows, so the disc reads as a density.
  // Overlaps within one path don't add up, so stroke one member's chords at
  // a time: each stroke then darkens what the earlier ones drew.
  ctx.globalAlpha = Math.min(1, 3 / Math.sqrt(k));
  ctx.lineWidth = k > 200 ? 0.5 : 1;
  for (let i = 0; i < k - 1 && !density; i++) {
    const [x1, y1] = pts[i];
    ctx.beginPath();
    for (let j = i + 1; j < k; j++) {
      ctx.moveTo(x1, y1);
      ctx.lineTo(pts[j][0], pts[j][1]);
    }
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  if (v <= 400) {
    ctx.fillStyle = cssVar(canvas, '--point', '#9e9e9e');
    for (let i = 0; i < v; i++) {
      const [x, y] = at(i);
      ctx.beginPath();
      ctx.arc(x, y, 1.2, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
  ctx.fillStyle = cssVar(canvas, '--member', '#ea4335');
  const dot = k > 300 ? 1.2 : k > 60 ? 2 : 3.5;
  for (const [x, y] of pts) {
    ctx.beginPath();
    ctx.arc(x, y, dot, 0, 2 * Math.PI);
    ctx.fill();
  }
}

/**
 * How often each nonzero difference occurs, squeezed into the canvas width:
 * each pixel column covers a run of differences and spans their lowest to
 * highest count. A difference set draws one flat line at height λ.
 */
function drawHistogram(canvas: HTMLCanvasElement, width: number, counts: Int32Array): void {
  const height = 120;
  const ctx = prepare(canvas, width, height);
  const v = counts.length;
  let max = 1;
  for (let d = 1; d < v; d++) if (counts[d] > max) max = counts[d];
  const top = Math.max(2, max + 1);
  const left = 24;
  const bottom = height - 18;
  const plot = bottom - 8;
  const y = (c: number) => bottom - (c / top) * plot;

  const muted = cssVar(canvas, '--muted', '#6b6b70');
  ctx.font = '11px system-ui, sans-serif';
  ctx.fillStyle = muted;
  ctx.strokeStyle = cssVar(canvas, '--border', '#e2e0d8');
  ctx.lineWidth = 1;
  ctx.textAlign = 'right';
  for (let t = 0; t <= top; t++) {
    ctx.beginPath();
    ctx.moveTo(left, y(t) + 0.5);
    ctx.lineTo(width, y(t) + 0.5);
    ctx.stroke();
    ctx.fillText(String(t), left - 5, y(t) + 4);
  }
  ctx.textAlign = 'left';
  ctx.fillText('1', left, height - 4);
  ctx.textAlign = 'right';
  ctx.fillText(num(v - 1), width, height - 4);

  const cols = width - left;
  const ok = cssVar(canvas, '--ok', '#188038');
  const bad = cssVar(canvas, '--bad', '#c5221f');
  for (let col = 0; col < cols; col++) {
    const from = 1 + Math.floor((col * (v - 1)) / cols);
    const to = Math.max(from + 1, 1 + Math.floor(((col + 1) * (v - 1)) / cols));
    let lo = Infinity;
    let hi = -Infinity;
    for (let d = from; d < to && d < v; d++) {
      lo = Math.min(lo, counts[d]);
      hi = Math.max(hi, counts[d]);
    }
    if (hi < 0) continue;
    ctx.fillStyle = lo === 1 && hi === 1 ? ok : bad;
    const y0 = y(hi);
    ctx.fillRect(left + col, y0 - 1, 1, Math.max(2, y(lo) - y0 + 2));
  }
}

/**
 * `<div data-widget="large-q-explorer" data-q="101" [data-url-state]>`: a
 * Singer set for any prime power q up to 1024, built in a Web Worker, drawn
 * on a canvas, checked difference by difference, and offered as text to copy
 * or download.
 */
export function mount(el: HTMLElement): void {
  const useUrl = el.hasAttribute('data-url-state');
  const fromUrl = useUrl ? Number(new URLSearchParams(location.search).get('q')) : NaN;
  let q = Q_VALUES.includes(fromUrl) ? fromUrl : Number(el.dataset.q ?? 101);

  const controls = document.createElement('div');
  controls.className = 'controls';
  const label = document.createElement('label');
  label.className = 'control';
  const select = document.createElement('select');
  select.className = 'q-select';
  for (const x of Q_VALUES) select.append(new Option(String(x), String(x)));
  label.append('q = ', select);
  const prevBtn = document.createElement('button');
  prevBtn.type = 'button';
  prevBtn.textContent = '←';
  prevBtn.setAttribute('aria-label', 'Previous prime power');
  const nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.textContent = '→';
  nextBtn.setAttribute('aria-label', 'Next prime power');
  controls.append(label, prevBtn, nextBtn);

  const summary = document.createElement('p');
  summary.className = 'explorer-summary';
  summary.setAttribute('aria-live', 'polite');

  const body = document.createElement('div');
  body.className = 'explorer-body';
  const chordBox = document.createElement('div');
  chordBox.className = 'explorer-chords';
  const chordCanvas = document.createElement('canvas');
  chordCanvas.className = 'chord-canvas';
  chordCanvas.setAttribute('role', 'img');
  chordBox.append(chordCanvas);

  const side = document.createElement('div');
  side.className = 'explorer-side';
  const histHeading = document.createElement('p');
  histHeading.className = 'widget-heading';
  histHeading.textContent = 'Difference tally';
  const histCanvas = document.createElement('canvas');
  histCanvas.className = 'hist-canvas';
  histCanvas.setAttribute('role', 'img');
  const verdict = document.createElement('p');
  verdict.className = 'explorer-verdict table-note';
  const textHeading = document.createElement('p');
  textHeading.className = 'widget-heading';
  textHeading.textContent = 'The set';
  const text = document.createElement('textarea');
  text.className = 'set-text';
  text.readOnly = true;
  text.rows = 5;
  text.setAttribute('aria-label', 'The difference set, as text');
  const actions = document.createElement('div');
  actions.className = 'controls';
  const copy = document.createElement('button');
  copy.type = 'button';
  copy.className = 'copy-button';
  copy.textContent = 'Copy';
  const download = document.createElement('a');
  download.className = 'download-link button-link';
  download.textContent = 'Download .txt';
  const copied = document.createElement('span');
  copied.className = 'hint copied';
  copied.setAttribute('aria-live', 'polite');
  actions.append(copy, download, copied);
  side.append(histHeading, histCanvas, verdict, textHeading, text, actions);
  body.append(chordBox, side);

  let worker: Worker | null = null;
  let result: ExplorerResult | null = null;
  let blobUrl = '';

  const draw = () => {
    if (!result) return;
    const size = Math.min(MAX_CANVAS, Math.floor(chordBox.clientWidth) || MAX_CANVAS);
    drawChords(chordCanvas, size, result.v, result.set, result.density);
    drawHistogram(histCanvas, Math.max(200, Math.floor(side.clientWidth)), result.counts);
  };

  const show = (r: ExplorerResult) => {
    result = r;
    const { v, set, counts } = r;
    const k = set.length;
    let zero = 0;
    let many = 0;
    for (let d = 1; d < v; d++) {
      if (counts[d] === 0) zero++;
      else if (counts[d] > 1) many++;
    }
    const pairs = (k * (k - 1)) / 2;
    summary.textContent =
      `q = ${q}: a (${num(v)}, ${num(k)}, 1) difference set mod ${num(v)}, built in ${ms(r.buildMs)} ` +
      `by stepping through ${num(v)} powers of a generator. Its ${num(pairs)} chords give ${num(2 * pairs)} differences, ` +
      `checked in ${ms(r.checkMs)}.` +
      (r.density ? ` Too many chords to draw one by one, so the picture shades each spot by how many cross it (${ms(r.drawMs)}).` : '');
    chordCanvas.setAttribute('aria-label', `Chord diagram of the ${k} members among ${v} points, with ${pairs} chords`);
    histCanvas.setAttribute('aria-label', `How often each of the ${v - 1} nonzero differences occurs`);
    const flat = zero === 0 && many === 0;
    verdict.className = `explorer-verdict table-note ${flat ? 'ok' : 'bad'}`;
    verdict.textContent = flat
      ? `Every nonzero difference 1, 2, …, ${num(v - 1)} occurs exactly once: λ = 1.`
      : `${zero} differences are missing and ${many} occur more than once.`;
    const body = set.join(', ');
    text.value = body;
    if (blobUrl) URL.revokeObjectURL(blobUrl);
    blobUrl = URL.createObjectURL(
      new Blob([`Singer (${v}, ${k}, 1) difference set for q = ${q}, mod ${v}:\n${set.join('\n')}\n`], {
        type: 'text/plain',
      }),
    );
    download.href = blobUrl;
    download.download = `singer-q${q}.txt`;
    el.classList.remove('busy');
    draw();
  };

  const compute = () => {
    worker?.terminate();
    el.classList.add('busy');
    copied.textContent = '';
    summary.textContent = `Building the Singer set for q = ${q} (v = ${num(q * q + q + 1)})…`;
    worker = new Worker(new URL('../workers/singerExplorer.worker.ts', import.meta.url), { type: 'module' });
    worker.onmessage = (e: MessageEvent<ExplorerResult>) => {
      if (e.data.q === q) show(e.data);
    };
    worker.postMessage({ q });
  };

  const setQ = (x: number) => {
    q = x;
    select.value = String(q);
    prevBtn.disabled = Q_VALUES.indexOf(q) === 0;
    nextBtn.disabled = Q_VALUES.indexOf(q) === Q_VALUES.length - 1;
    if (useUrl) {
      const url = new URL(location.href);
      url.searchParams.set('q', String(q));
      history.replaceState(null, '', url);
    }
    compute();
  };

  select.addEventListener('change', () => setQ(Number(select.value)));
  prevBtn.addEventListener('click', () => setQ(Q_VALUES[Math.max(0, Q_VALUES.indexOf(q) - 1)]));
  nextBtn.addEventListener('click', () => setQ(Q_VALUES[Math.min(Q_VALUES.length - 1, Q_VALUES.indexOf(q) + 1)]));
  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(text.value);
      copied.textContent = 'Copied.';
    } catch {
      text.select();
      copied.textContent = 'Selected: press Ctrl+C or ⌘C to copy.';
    }
  });

  let frame = 0;
  const redraw = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(draw);
  };
  new ResizeObserver(redraw).observe(chordBox);
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', redraw);

  el.classList.add('widget', 'large-q-explorer');
  el.replaceChildren(controls, summary, body);
  setQ(q);
}
