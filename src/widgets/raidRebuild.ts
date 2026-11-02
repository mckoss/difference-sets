import {
  bits,
  classicLayout,
  declusteredLayout,
  type Layout,
  type LayoutKind,
  RAID_PRESETS,
  type RebuildSummary,
  rebuildSummary,
  recoverChunk,
  stripeChunks,
  stripesOnDisk,
  unevenRandomLayout,
} from '../math/raid';
import { mulberry32 } from '../math/random';
import { svgEl } from '../viz/circleSet';

const KINDS: { kind: LayoutKind; label: string }[] = [
  { kind: 'declustered', label: 'Difference set' },
  { kind: 'classic', label: 'Classic RAID-5' },
  { kind: 'random', label: 'Random' },
];

/** An `<option>` (built by hand; `new Option` is missing in some test DOMs). */
function option(text: string, value: string): HTMLOptionElement {
  const o = document.createElement('option');
  o.textContent = text;
  o.value = value;
  return o;
}

function button(text: string, cls: string): HTMLButtonElement {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = cls;
  b.textContent = text;
  return b;
}

const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

/** "S0, S2 and S3" */
const listText = (items: string[]) => items.join(', ').replace(/, ([^,]*)$/, ' and $1');

/**
 * One column per disk, holding its chunks (colored by stripe; P marks a
 * parity chunk). Below each column, a bar for the chunks that disk reads
 * while the failed disk is rebuilt.
 */
function diskFigure(layout: Layout, failed: number | null, sum: RebuildSummary | null): SVGSVGElement {
  const n = layout.disks;
  const col = n > 13 ? 34 : 42;
  const chunkH = 24;
  const left = 4;
  const top = 18;
  const chunksH = layout.width * (chunkH + 4) + 6;
  const barTop = top + chunksH + 24;
  const unit = Math.min(22, 66 / Math.max(1, layout.width));
  const barMax = layout.width * unit;
  const width = left * 2 + n * col;
  const height = barTop + barMax + 34;
  const svg = svgEl('svg', {
    viewBox: `0 0 ${width} ${height}`,
    class: 'raid-figure',
    role: 'group',
    'aria-label': 'Disks and their chunks',
    style: `max-width: ${Math.round(width * 1.4)}px`,
  });
  const lost = new Set(sum?.lost ?? []);
  const perDisk = Array.from({ length: n }, (_, d) => stripesOnDisk(layout, d));
  const hue = (j: number) => Math.round((360 * j) / layout.stripes.length);

  for (let d = 0; d < n; d++) {
    const x = left + d * col;
    const isFailed = d === failed;
    const reads = sum ? sum.reads[d] : 0;
    const g = svgEl('g', {
      class: `disk${isFailed ? ' failed' : ''}`,
      'data-disk': d,
      role: 'button',
      tabindex: 0,
      'aria-pressed': String(isFailed),
      'aria-label': isFailed
        ? `Disk ${d}, failed. Press to repair it.`
        : `Disk ${d}${sum ? `, reads ${plural(reads, 'chunk')}` : ''}. Press to fail it.`,
    });
    g.append(svgEl('rect', { x: x + 2, y: top - 2, width: col - 4, height: chunksH, rx: 6, class: 'case' }));
    g.append(svgEl('text', { x: x + col / 2, y: top - 6, class: 'disk-label' }, String(d)));
    const mine = perDisk[d];
    for (let slot = 0; slot < layout.width; slot++) {
      const y = top + 4 + slot * (chunkH + 4);
      const j = mine[slot];
      if (j === undefined) {
        g.append(svgEl('rect', { x: x + 6, y, width: col - 12, height: chunkH, rx: 4, class: 'chunk empty' }));
        continue;
      }
      const isParity = layout.stripes[j].parity === d;
      const state = sum ? (isFailed ? 'lost' : lost.has(j) ? 'read' : 'idle') : '';
      const chunk = svgEl('g', { class: `chunk-g ${state}`.trim(), 'data-stripe': j, style: `--hue: ${hue(j)}` });
      chunk.append(svgEl('rect', { x: x + 6, y, width: col - 12, height: chunkH, rx: 4, class: 'chunk' }));
      chunk.append(svgEl('text', { x: x + col / 2, y: y + chunkH / 2 + 4, class: 'chunk-label' }, `${isParity ? 'P' : 'S'}${j}`));
      g.append(chunk);
    }
    if (isFailed) {
      g.append(svgEl('line', { x1: x + 6, y1: top + 2, x2: x + col - 6, y2: top + chunksH - 6, class: 'cross' }));
      g.append(svgEl('line', { x1: x + col - 6, y1: top + 2, x2: x + 6, y2: top + chunksH - 6, class: 'cross' }));
    }
    svg.append(g);

    if (sum) {
      const base = barTop + barMax;
      if (isFailed) {
        svg.append(svgEl('text', { x: x + col / 2, y: base - 2, class: 'bar-x' }, '×'));
      } else {
        const h = reads * unit;
        const cls = `bar${reads === 0 ? ' zero' : ''}${reads === sum.busiest && sum.busiest > 0 && !sum.even ? ' busiest' : ''}`;
        svg.append(svgEl('rect', { x: x + 8, y: base - h, width: col - 16, height: h, class: cls, 'data-reads': reads }));
        svg.append(svgEl('text', { x: x + col / 2, y: base - h - 4, class: 'bar-count' }, String(reads)));
      }
    }
  }
  if (sum) {
    const base = barTop + barMax;
    svg.append(svgEl('line', { x1: left, y1: base, x2: width - left, y2: base, class: 'axis' }));
    svg.append(svgEl('text', { x: width / 2, y: base + 20, class: 'axis-label' }, 'Chunks each disk reads for the rebuild'));
  }
  return svg;
}

/**
 * `<div data-widget="raid-rebuild" data-v="7">`: disks holding stripes laid out
 * by a planar difference set, classic RAID-5 groups, or at random. Click (or
 * press Enter on) a disk to fail it; bars show how many chunks each survivor
 * must read to rebuild it, and a small panel rebuilds one lost chunk by XOR.
 */
export function mount(el: HTMLElement): void {
  let presetIndex = Math.max(
    0,
    RAID_PRESETS.findIndex((p) => p.v === Number(el.dataset.v ?? 7)),
  );
  const seed = Number(el.dataset.seed ?? 1);
  let kind: LayoutKind = 'declustered';
  let failed: number | null = el.dataset.fail === undefined ? null : Number(el.dataset.fail);
  let xorStripe: number | null = null;

  const controls = document.createElement('div');
  controls.className = 'controls';
  const presetSelect = document.createElement('select');
  presetSelect.className = 'preset-select';
  presetSelect.setAttribute('aria-label', 'Number of disks');
  RAID_PRESETS.forEach((p, i) => presetSelect.append(option(p.label, String(i))));
  presetSelect.value = String(presetIndex);
  const group = document.createElement('span');
  group.className = 'button-group';
  group.setAttribute('role', 'group');
  group.setAttribute('aria-label', 'Layout');
  const kindButtons = KINDS.map(({ kind: k, label }) => {
    const b = button(label, `layout-${k}`);
    b.addEventListener('click', () => {
      kind = k;
      render();
    });
    group.append(b);
    return b;
  });
  controls.append(presetSelect, group);

  const box = document.createElement('div');
  box.className = 'raid-box';
  const layoutLine = document.createElement('p');
  layoutLine.className = 'layout-line';
  const figure = document.createElement('div');
  figure.className = 'raid-chart';
  const verdict = document.createElement('p');
  verdict.className = 'verdict';
  verdict.setAttribute('aria-live', 'polite');
  const xorPanel = document.createElement('div');
  xorPanel.className = 'xor-panel';
  box.append(layoutLine, figure, verdict, xorPanel);

  const layout = (): Layout => {
    const p = RAID_PRESETS[presetIndex];
    if (kind === 'declustered') return declusteredLayout(p.set, p.v);
    if (kind === 'classic') return classicLayout(p.v, p.set.length);
    return unevenRandomLayout(p.v, p.set.length, seed, mulberry32);
  };

  const describe = (L: Layout): string => {
    const p = RAID_PRESETS[presetIndex];
    const k = L.width;
    if (L.kind === 'declustered') {
      return `Stripe j sits on the disks D + j, with D = {${p.set.join(', ')}} mod ${p.v}. Each stripe has ${k - 1} data chunks (S) and 1 parity chunk (P).`;
    }
    if (L.kind === 'classic') {
      const groups = Math.floor(L.disks / k);
      const spare = L.disks - groups * k;
      return `${groups} separate RAID-5 groups of ${k} disks, each holding ${k} stripes of its own${spare ? `; ${plural(spare, 'disk')} left over as a spare` : ''}.`;
    }
    return `Random layout (seed ${L.seed}): each disk still holds ${k} chunks, but the stripes are dealt at random.`;
  };

  const verdictText = (sum: RebuildSummary): string => {
    const lostText = listText(sum.lost.map((j) => `S${j}`));
    const head = `Disk ${sum.failed} failed, losing a chunk of ${sum.lost.length === 1 ? 'stripe' : 'stripes'} ${lostText}.`;
    if (sum.even) {
      return `${head} Every survivor reads ${plural(sum.busiest, 'chunk')}. Rebuild takes ${plural(sum.busiest, 'read-time')}.`;
    }
    const idle = sum.idle.length ? ` ${plural(sum.idle.length, 'survivor')} ${sum.idle.length === 1 ? 'reads' : 'read'} nothing.` : '';
    return `${head} The busiest survivor reads ${plural(sum.busiest, 'chunk')}, so the rebuild takes ${plural(sum.busiest, 'read-time')}.${idle}`;
  };

  const renderXor = (L: Layout, sum: RebuildSummary | null) => {
    xorPanel.replaceChildren();
    if (!sum || sum.lost.length === 0) return;
    if (xorStripe === null || !sum.lost.includes(xorStripe)) xorStripe = sum.lost[0];
    const j = xorStripe;
    const stripe = L.stripes[j];
    const values = stripeChunks(stripe, j);
    const lostPos = stripe.disks.indexOf(sum.failed);
    const recovered = recoverChunk(values, lostPos);

    const head = document.createElement('p');
    const label = document.createElement('label');
    label.className = 'control';
    label.append('Rebuild one lost chunk by XOR: stripe ');
    const select = document.createElement('select');
    select.className = 'xor-stripe';
    select.setAttribute('aria-label', 'Stripe to rebuild');
    for (const s of sum.lost) select.append(option(`S${s}`, String(s)));
    select.value = String(j);
    select.addEventListener('change', () => {
      xorStripe = Number(select.value);
      renderXor(L, sum);
    });
    label.append(select);
    head.append(label);

    const table = document.createElement('table');
    table.className = 'xor-table';
    const row = (name: string, value: string, cls = '') => {
      const tr = document.createElement('tr');
      if (cls) tr.className = cls;
      const th = document.createElement('th');
      th.scope = 'row';
      th.textContent = name;
      const td = document.createElement('td');
      td.textContent = value;
      tr.append(th, td);
      table.append(tr);
    };
    const kindOf = (d: number) => (stripe.parity === d ? 'parity' : 'data');
    stripe.disks.forEach((d, pos) => {
      if (pos !== lostPos) row(`Read from disk ${d} (${kindOf(d)})`, bits(values[pos]));
    });
    row('XOR of those', bits(recovered), 'xor-result');
    row(`Lost on disk ${sum.failed} (${kindOf(sum.failed)})`, bits(values[lostPos]), 'xor-lost');
    const note = document.createElement('p');
    note.className = 'xor-note';
    note.textContent =
      recovered === values[lostPos]
        ? 'They match: each bit of the lost chunk is 1 exactly when an odd number of the other chunks have a 1 there.'
        : 'Mismatch!';
    xorPanel.append(head, table, note);
  };

  const render = () => {
    const L = layout();
    if (failed !== null && (failed < 0 || failed >= L.disks)) failed = null;
    kindButtons.forEach((b, i) => b.setAttribute('aria-pressed', String(KINDS[i].kind === kind)));
    layoutLine.textContent = describe(L);
    const sum = failed === null ? null : rebuildSummary(L, failed);
    const focused = document.activeElement instanceof Element ? document.activeElement.closest('[data-disk]') : null;
    const focusDisk = focused && figure.contains(focused) ? (focused as SVGGElement).dataset.disk : undefined;
    figure.replaceChildren(diskFigure(L, failed, sum));
    if (focusDisk !== undefined) figure.querySelector<SVGGElement>(`[data-disk="${focusDisk}"]`)?.focus();
    if (!sum) {
      verdict.className = 'verdict';
      verdict.textContent = 'Click a disk (or Tab to it and press Enter) to make it fail.';
    } else if (sum.lost.length === 0) {
      verdict.className = 'verdict';
      verdict.textContent = `Disk ${sum.failed} is a spare with no chunks, so nothing needs rebuilding. Try another disk.`;
    } else {
      verdict.className = `verdict ${sum.even ? 'ok' : 'bad'}`;
      verdict.textContent = verdictText(sum);
    }
    renderXor(L, sum);
  };

  const toggle = (d: number) => {
    failed = failed === d ? null : d;
    render();
  };
  figure.addEventListener('click', (e) => {
    const g = (e.target as Element).closest<SVGGElement>('[data-disk]');
    if (g) toggle(Number(g.dataset.disk));
  });
  figure.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const g = (e.target as Element).closest<SVGGElement>('[data-disk]');
    if (!g) return;
    e.preventDefault();
    toggle(Number(g.dataset.disk));
  });
  presetSelect.addEventListener('change', () => {
    presetIndex = Number(presetSelect.value);
    render();
  });

  el.classList.add('widget', 'raid-rebuild');
  el.replaceChildren(controls, box);
  render();
}
