import { decodeImage, detectorImage, foldSet, type Mask2D, randomMask, skyFrom } from '../math/aperture';
import { mulberry32 } from '../math/random';
import { singerParams, singerSetPG } from '../math/singerPG';
import { svgEl } from '../viz/circleSet';

// The mask: the Singer set of PG(7, 2), 255 points, folded into 15 × 17.
const ROWS = 15;
const COLS = 17;
const M = 7;
const CELL = 10;
const BRIGHTNESS = [1, 0.7, 0.45];
const MAX_SOURCES = BRIGHTNESS.length;

const signed = (x: number) => x.toFixed(2).replace('-', '−');

interface Source {
  r: number;
  c: number;
  b: number;
}

function grid(cls: string, label: string): SVGSVGElement {
  const svg = svgEl('svg', {
    viewBox: `0 0 ${COLS * CELL} ${ROWS * CELL}`,
    class: `ap-grid ${cls}`,
    role: 'img',
    'aria-label': label,
  });
  return svg;
}

function cellRect(r: number, c: number, cls: string, opacity?: number): SVGRectElement {
  const rect = svgEl('rect', {
    x: c * CELL,
    y: r * CELL,
    width: CELL,
    height: CELL,
    class: cls,
    'data-r': r,
    'data-c': c,
  });
  if (opacity !== undefined) rect.setAttribute('fill-opacity', opacity.toFixed(3));
  return rect;
}

function panel(title: string, note: string): [HTMLElement, HTMLElement, HTMLElement] {
  const fig = document.createElement('figure');
  fig.className = 'ap-panel';
  const box = document.createElement('div');
  box.className = 'ap-box';
  const cap = document.createElement('figcaption');
  const strong = document.createElement('strong');
  strong.textContent = title;
  const span = document.createElement('span');
  span.textContent = note;
  cap.append(strong, ' ', span);
  fig.append(box, cap);
  return [fig, box, span];
}

function toggle(label: string, cls: string): HTMLButtonElement {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = cls;
  b.textContent = label;
  return b;
}

/**
 * `<div data-widget="coded-aperture">`: a sky of up to three point sources,
 * a 15 × 17 mask folded from the 255-point Singer set of PG(7, 2), the
 * shadow picture the detector records, and the picture decoded by
 * correlating with the mask. A button swaps in a random mask with the same
 * number of holes, which decodes with ghosts.
 */
export function mount(el: HTMLElement): void {
  const { k, lambda } = singerParams(2, M);
  const singer = foldSet(singerSetPG(2, M), ROWS, COLS);
  const random = randomMask(ROWS, COLS, k, mulberry32(7));
  let mask: Mask2D = singer;
  let sources: Source[] = [
    { r: 4, c: 5, b: BRIGHTNESS[0] },
    { r: 10, c: 12, b: BRIGHTNESS[1] },
  ];
  let decoded = false;
  let cursor = { r: 7, c: 8 };
  let focused = false;

  const controls = document.createElement('div');
  controls.className = 'controls';
  const singerBtn = toggle('Singer mask', 'mask-singer');
  const randomBtn = toggle('Random mask', 'mask-random');
  const decodeBtn = toggle('Decode', 'decode-button');
  const clearBtn = toggle('Clear sky', 'clear-button');
  const group = document.createElement('span');
  group.className = 'ap-toggle';
  group.setAttribute('role', 'group');
  group.setAttribute('aria-label', 'Mask');
  group.append(singerBtn, randomBtn);
  controls.append(group, decodeBtn, clearBtn);

  const hint = document.createElement('p');
  hint.className = 'hint';
  hint.textContent =
    'Click the sky to add a star (up to three), drag a star to move it, or click it again to remove it. ' +
    'With the keyboard, focus the sky, move with the arrow keys, and press Enter.';

  const [skyFig, skyBox] = panel('Sky.', 'Where the stars really are.');
  const [maskFig, maskBox] = panel('Mask.', `${k} open holes out of ${ROWS * COLS}.`);
  const [detFig, detBox] = panel('Detector.', 'Every star’s shadow of the mask, added up.');
  const [decFig, decBox, decNote] = panel('Decoded.', '');
  const panels = document.createElement('div');
  panels.className = 'ap-panels';
  panels.append(skyFig, maskFig, detFig, decFig);

  const report = document.createElement('p');
  report.className = 'floor-report';
  report.setAttribute('aria-live', 'polite');

  const sky = grid('ap-sky', 'The sky. Click to add or remove a star.');
  sky.setAttribute('tabindex', '0');
  sky.setAttribute('role', 'application');
  skyBox.append(sky);

  const renderSky = () => {
    sky.replaceChildren(svgEl('rect', { x: 0, y: 0, width: COLS * CELL, height: ROWS * CELL, class: 'night' }));
    for (const s of sources) {
      const g = svgEl('g', { class: 'star', 'data-r': s.r, 'data-c': s.c });
      g.append(
        svgEl('circle', { cx: s.c * CELL + CELL / 2, cy: s.r * CELL + CELL / 2, r: 2 + 3.5 * s.b, class: 'star-dot' }),
      );
      sky.append(g);
    }
    if (focused) {
      sky.append(
        svgEl('rect', {
          x: cursor.c * CELL + 0.75,
          y: cursor.r * CELL + 0.75,
          width: CELL - 1.5,
          height: CELL - 1.5,
          class: 'ap-cursor',
        }),
      );
    }
  };

  const renderGrid = (box: HTMLElement, cls: string, label: string, values: readonly number[], kind: 'mask' | 'heat') => {
    const svg = grid(cls, label);
    if (kind === 'mask') {
      svg.append(svgEl('rect', { x: 0, y: 0, width: COLS * CELL, height: ROWS * CELL, class: 'solid' }));
      values.forEach((x, i) => {
        if (x) svg.append(cellRect(Math.floor(i / COLS), i % COLS, 'hole'));
      });
    } else {
      const max = Math.max(1e-9, ...values.map(Math.abs));
      svg.append(svgEl('rect', { x: 0, y: 0, width: COLS * CELL, height: ROWS * CELL, class: 'heat-bg' }));
      values.forEach((x, i) => {
        const a = Math.abs(x) / max;
        if (a < 0.004) return;
        const peak = cls === 'ap-decoded' && x > 0.2;
        svg.append(cellRect(Math.floor(i / COLS), i % COLS, `heat${x < 0 ? ' neg' : ''}${peak ? ' peak' : ''}`, a));
      });
    }
    box.replaceChildren(svg);
  };

  const render = () => {
    const isSinger = mask === singer;
    singerBtn.setAttribute('aria-pressed', String(isSinger));
    randomBtn.setAttribute('aria-pressed', String(!isSinger));
    renderSky();
    renderGrid(maskBox, 'ap-mask', isSinger ? 'The Singer mask' : 'A random mask', mask.open, 'mask');
    const skyVals = skyFrom(sources, ROWS, COLS);
    const det = detectorImage(mask, skyVals);
    renderGrid(detBox, 'ap-detector', 'The detector picture', det, 'heat');
    if (!decoded) {
      const p = document.createElement('p');
      p.className = 'ap-placeholder';
      p.textContent = 'Press Decode.';
      decBox.replaceChildren(p);
      decNote.textContent = 'The detector picture correlated with the mask.';
      report.textContent = '';
      report.className = 'floor-report';
      return;
    }
    const out = decodeImage(mask, det);
    renderGrid(decBox, 'ap-decoded', 'The decoded picture', out, 'heat');
    decNote.textContent = 'The detector picture correlated with the mask.';
    const off = out.filter((_, i) => skyVals[i] === 0);
    const lo = Math.min(...off);
    const hi = Math.max(...off);
    const n = sources.length;
    const stars = `${n} star${n === 1 ? '' : 's'}`;
    if (n === 0) {
      report.textContent = 'The sky is empty, so the decoded picture is blank. Click the sky to add a star.';
      report.className = 'floor-report';
    } else if (Math.max(Math.abs(lo), Math.abs(hi)) < 1e-9) {
      report.textContent =
        `${stars}, ${n === 1 ? 'one sharp peak' : `${n} sharp peaks`} at the right brightness, and every other pixel is exactly 0: ` +
        `a flat floor, because each shifted copy of the mask overlaps it in exactly λ = ${lambda} holes.`;
      report.className = 'floor-report ok';
    } else {
      report.textContent =
        `Ghosts: pixels where there is no star range from ${signed(lo)} to ${signed(hi)} ` +
        `(a star of brightness 1 decodes to 1). The random mask’s shifted copies overlap it unevenly.`;
      report.className = 'floor-report bad';
    }
  };

  // Pointer: add, drag, or remove a star.
  const cellAt = (e: PointerEvent) => {
    const box = sky.getBoundingClientRect();
    const c = Math.min(COLS - 1, Math.max(0, Math.floor(((e.clientX - box.left) / box.width) * COLS)));
    const r = Math.min(ROWS - 1, Math.max(0, Math.floor(((e.clientY - box.top) / box.height) * ROWS)));
    return { r, c };
  };
  const find = (r: number, c: number) => sources.findIndex((s) => s.r === r && s.c === c);
  const reweigh = () => sources.forEach((s, i) => (s.b = BRIGHTNESS[i]));
  const add = (r: number, c: number) => {
    if (sources.length >= MAX_SOURCES) sources.shift();
    sources.push({ r, c, b: 0 });
    reweigh();
    return sources.length - 1;
  };
  let drag: { i: number; existed: boolean; moved: boolean } | null = null;

  sky.addEventListener('pointerdown', (e) => {
    const { r, c } = cellAt(e);
    cursor = { r, c };
    const i = find(r, c);
    drag = i >= 0 ? { i, existed: true, moved: false } : { i: add(r, c), existed: false, moved: false };
    sky.setPointerCapture?.(e.pointerId);
    e.preventDefault();
    render();
  });
  sky.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const { r, c } = cellAt(e);
    const s = sources[drag.i];
    if (!s || (s.r === r && s.c === c) || find(r, c) >= 0) return;
    s.r = r;
    s.c = c;
    drag.moved = true;
    render();
  });
  const end = () => {
    if (drag && drag.existed && !drag.moved) {
      sources.splice(drag.i, 1);
      reweigh();
      render();
    }
    drag = null;
  };
  sky.addEventListener('pointerup', end);
  sky.addEventListener('pointercancel', () => (drag = null));

  // Keyboard: a cursor that moves with the arrow keys; Enter or Space toggles a star.
  sky.addEventListener('focus', () => {
    focused = true;
    renderSky();
  });
  sky.addEventListener('blur', () => {
    focused = false;
    renderSky();
  });
  sky.addEventListener('keydown', (e) => {
    const moves: Record<string, [number, number]> = {
      ArrowUp: [-1, 0],
      ArrowDown: [1, 0],
      ArrowLeft: [0, -1],
      ArrowRight: [0, 1],
    };
    if (moves[e.key]) {
      const [dr, dc] = moves[e.key];
      cursor = { r: (cursor.r + dr + ROWS) % ROWS, c: (cursor.c + dc + COLS) % COLS };
      renderSky();
    } else if (e.key === 'Enter' || e.key === ' ') {
      const i = find(cursor.r, cursor.c);
      if (i >= 0) {
        sources.splice(i, 1);
        reweigh();
      } else {
        add(cursor.r, cursor.c);
      }
      render();
    } else {
      return;
    }
    e.preventDefault();
  });

  singerBtn.addEventListener('click', () => {
    mask = singer;
    render();
  });
  randomBtn.addEventListener('click', () => {
    mask = random;
    render();
  });
  decodeBtn.addEventListener('click', () => {
    decoded = true;
    render();
  });
  clearBtn.addEventListener('click', () => {
    sources = [];
    render();
  });

  el.classList.add('widget', 'coded-aperture');
  el.replaceChildren(controls, hint, panels, report);
  render();
}
