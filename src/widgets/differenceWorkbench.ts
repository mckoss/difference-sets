import { differenceReport, normalizeSet, pairsWithDifference } from '../math/difference';
import { circleSet, highlightDifference } from '../viz/circleSet';
import { differenceHistogram } from '../viz/histogram';
import { setText } from './format';

export const MIN_V = 2;
export const MAX_V = 64;

export interface Preset {
  label: string;
  v: number;
  set: number[];
}

export const PRESETS: Preset[] = [
  { label: '{0, 1, 3} mod 7: a (7, 3, 1) difference set', v: 7, set: [0, 1, 3] },
  { label: '{0, 1, 3, 9} mod 13: a (13, 4, 1) difference set', v: 13, set: [0, 1, 3, 9] },
  { label: '{0, 1, 4, 14, 16} mod 21: a (21, 5, 1) difference set', v: 21, set: [0, 1, 4, 14, 16] },
  { label: '{1, 3, 4, 5, 9} mod 11: a (11, 5, 2) difference set', v: 11, set: [1, 3, 4, 5, 9] },
  { label: '{0, 1, 2} mod 7: not a difference set', v: 7, set: [0, 1, 2] },
  { label: '{0, 1, 2, 4} mod 13: not a difference set', v: 13, set: [0, 1, 2, 4] },
];

/** The event a workbench fires on `document` whenever its set changes, so other widgets can follow it. */
export const CHANGE_EVENT = 'difference-set-change';
export interface ChangeDetail {
  v: number;
  set: number[];
}

/** The most recent change, for a follower that mounts after the workbench has drawn. */
export let latestChange: ChangeDetail | null = null;

/** Parse "0,1,3" into numbers, ignoring junk. */
export function parseSet(text: string | null | undefined): number[] {
  return (text ?? '')
    .split(/[\s,]+/)
    .filter((s) => /^-?\d+$/.test(s))
    .map(Number);
}

function clampV(v: number, fallback: number): number {
  return Number.isInteger(v) && v >= MIN_V && v <= MAX_V ? v : fallback;
}

/** One-sentence verdict on a candidate set. */
export function verdict(set: readonly number[], v: number): { ok: boolean; text: string } {
  const r = differenceReport(set, v);
  const name = `${setText(r.set)} mod ${v}`;
  if (r.k < 2) return { ok: false, text: 'Pick at least two points to see their differences.' };
  if (r.lambda !== null) {
    const trivial = r.k >= v - 1 ? ' (a trivial one: it uses nearly every point)' : '';
    const times = r.lambda === 1 ? 'exactly once' : `exactly ${r.lambda} times`;
    return {
      ok: true,
      text: `${name} is a (${v}, ${r.k}, ${r.lambda}) difference set${trivial}: every nonzero difference appears ${times}.`,
    };
  }
  const list = (ds: number[]) => ds.join(', ');
  if (r.target === null) {
    return {
      ok: false,
      text:
        `Not a difference set: ${r.k} points give ${r.k * (r.k - 1)} differences, which can't be shared evenly ` +
        `among the ${v - 1} nonzero residues.` +
        (r.tooFew.length ? ` Missing: ${list(r.tooFew)}.` : ''),
    };
  }
  if (r.target === 1) {
    return {
      ok: false,
      text: `Not a difference set. Missing: ${list(r.tooFew)}. Repeated: ${list(r.tooMany)}.`,
    };
  }
  return {
    ok: false,
    text:
      `Not a difference set. Each difference would need to appear ${r.target} times. ` +
      (r.tooFew.length ? `Too few: ${list(r.tooFew)}. ` : '') +
      (r.tooMany.length ? `Too many: ${list(r.tooMany)}.` : ''),
  };
}

/**
 * `<div data-widget="difference-workbench" data-v="7" data-set="0,1,3" data-url-state>`:
 * click points on a circle to build a set and watch its differences. With
 * `data-url-state`, v and the set live in `?v=7&set=0,1,3`. With
 * `data-no-presets` the preset menu is hidden.
 */
export function mount(el: HTMLElement): void {
  const useUrl = el.hasAttribute('data-url-state');
  const params = new URLSearchParams(location.search);
  let v = clampV(Number(el.dataset.v ?? 7), 7);
  let members = new Set(normalizeSet(parseSet(el.dataset.set), v));
  if (useUrl && params.has('v')) {
    v = clampV(Number(params.get('v')), v);
    members = new Set(normalizeSet(parseSet(params.get('set') ?? ''), v));
  }

  const controls = document.createElement('div');
  controls.className = 'controls';

  const vLabel = document.createElement('label');
  vLabel.className = 'control';
  const vInput = document.createElement('input');
  vInput.type = 'number';
  vInput.className = 'v-input';
  vInput.min = String(MIN_V);
  vInput.max = String(MAX_V);
  vInput.value = String(v);
  vLabel.append('v = ', vInput);
  controls.append(vLabel);

  let presetSelect: HTMLSelectElement | null = null;
  if (!el.hasAttribute('data-no-presets')) {
    const pLabel = document.createElement('label');
    pLabel.className = 'control';
    presetSelect = document.createElement('select');
    presetSelect.className = 'preset-select';
    presetSelect.append(new Option('Examples…', ''));
    PRESETS.forEach((p, i) => presetSelect!.append(new Option(p.label, String(i))));
    pLabel.append(presetSelect);
    controls.append(pLabel);
  }

  const clear = document.createElement('button');
  clear.type = 'button';
  clear.className = 'clear-button';
  clear.textContent = 'Clear';
  controls.append(clear);

  const hint = document.createElement('p');
  hint.className = 'hint';
  hint.textContent = 'Click points on the circle to add or remove them.';

  const body = document.createElement('div');
  body.className = 'workbench-body';
  const circleBox = document.createElement('div');
  circleBox.className = 'circle-box';
  const side = document.createElement('div');
  side.className = 'workbench-side';
  const setLine = document.createElement('p');
  setLine.className = 'set-line';
  const histBox = document.createElement('div');
  histBox.className = 'histogram-box';
  const verdictEl = document.createElement('p');
  verdictEl.className = 'verdict';
  verdictEl.setAttribute('aria-live', 'polite');
  const pairs = document.createElement('details');
  pairs.className = 'pairs';
  const pairsSummary = document.createElement('summary');
  pairsSummary.textContent = 'Which pairs give each difference';
  const pairsList = document.createElement('ul');
  pairs.append(pairsSummary, pairsList);
  side.append(setLine, histBox, verdictEl, pairs);
  body.append(circleBox, side);

  let svg: SVGSVGElement;

  const render = () => {
    const set = [...members].sort((a, b) => a - b);
    svg = circleSet({ v, set, interactive: true, title: `${setText(set)} mod ${v}` });
    circleBox.replaceChildren(svg);
    const report = differenceReport(set, v);
    setLine.textContent = `D = ${setText(set)} mod ${v}, k = ${set.length}`;
    histBox.replaceChildren(differenceHistogram(report));
    const { ok, text } = verdict(set, v);
    verdictEl.textContent = text;
    verdictEl.classList.toggle('ok', ok);
    verdictEl.classList.toggle('bad', !ok && set.length >= 2);
    pairs.hidden = set.length < 2 || set.length > 12;
    pairsList.replaceChildren(
      ...Array.from({ length: v - 1 }, (_, i) => i + 1).map((d) => {
        const li = document.createElement('li');
        const ps = pairsWithDifference(set, d, v);
        li.textContent = `${d}: ${ps.length ? ps.map(([a, b]) => `${a} − ${b}`).join(', ') : 'none'}`;
        if (ps.length === 0) li.className = 'none';
        return li;
      }),
    );
    if (useUrl) {
      const url = new URL(location.href);
      url.searchParams.set('v', String(v));
      url.searchParams.set('set', set.join(','));
      history.replaceState(null, '', url);
    }
    latestChange = { v, set };
    document.dispatchEvent(new CustomEvent<ChangeDetail>(CHANGE_EVENT, { detail: latestChange }));
  };

  const toggle = (i: number) => {
    if (members.has(i)) members.delete(i);
    else members.add(i);
    if (presetSelect) presetSelect.value = '';
    render();
    circleBox.querySelector<SVGGElement>(`[data-point="${i}"]`)?.focus();
  };

  circleBox.addEventListener('click', (e) => {
    const g = (e.target as Element).closest<SVGGElement>('[data-point]');
    if (g) toggle(Number(g.dataset.point));
  });
  circleBox.addEventListener('keydown', (e) => {
    const g = (e.target as Element).closest<SVGGElement>('[data-point]');
    if (g && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      toggle(Number(g.dataset.point));
    }
  });

  const hot = (e: Event) => {
    const bar = (e.target as Element).closest<SVGGElement>('.bar');
    highlightDifference(svg, bar ? Number(bar.dataset.d) : null);
  };
  histBox.addEventListener('pointerover', hot);
  histBox.addEventListener('focusin', hot);
  histBox.addEventListener('pointerleave', () => highlightDifference(svg, null));
  histBox.addEventListener('focusout', () => highlightDifference(svg, null));

  vInput.addEventListener('change', () => {
    const next = clampV(Number(vInput.value), v);
    vInput.value = String(next);
    if (next === v) return;
    v = next;
    members = new Set([...members].filter((x) => x < v));
    if (presetSelect) presetSelect.value = '';
    render();
  });
  presetSelect?.addEventListener('change', () => {
    const p = PRESETS[Number(presetSelect!.value)];
    if (!p) return;
    v = p.v;
    vInput.value = String(v);
    members = new Set(p.set);
    render();
  });
  clear.addEventListener('click', () => {
    members.clear();
    if (presetSelect) presetSelect.value = '';
    render();
  });

  el.classList.add('widget', 'workbench');
  el.replaceChildren(controls, hint, body);
  render();
}
