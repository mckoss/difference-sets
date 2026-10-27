import { mod } from '../math/numbers';
import { mulberry32 } from '../math/random';
import { awakeSlots, failingRandomSchedule, missedOffsets, SCHEDULE_PRESETS, sharedSlots } from '../math/schedule';
import { svgEl } from '../viz/circleSet';
import { setText } from './format';

/** The three ways the same picture can be read. */
const VIEWS = {
  radio: {
    label: 'Radios and time slots',
    device: 'Radio',
    noun: 'slot',
    nouns: 'slots',
    header: 'Time slot (the cycle repeats)',
    offset: 'clock',
    slider: 'clock ahead by',
    member: (x: number) => `slot ${x}`,
    meet: (a: string, b: string, x: string) => `${a} and ${b} are both awake in ${x}.`,
    never: (a: string, b: string) => `${a} and ${b} are never awake at the same time, so they never hear each other.`,
  },
  keys: {
    label: 'Sensors and keys',
    device: 'Sensor',
    noun: 'key',
    nouns: 'keys',
    header: 'Key number',
    offset: 'ring',
    slider: 'ring D +',
    member: (x: number) => `key ${x}`,
    meet: (a: string, b: string, x: string) => `${a} and ${b} share ${x}, so they can talk in secret.`,
    never: (a: string, b: string) => `${a} and ${b} share no key, so they cannot talk securely.`,
  },
  quorum: {
    label: 'Servers and quorums',
    device: 'Server',
    noun: 'server',
    nouns: 'servers',
    header: 'Server in the quorum',
    offset: 'quorum',
    slider: 'quorum D +',
    member: (x: number) => `server ${x}`,
    meet: (a: string, b: string, x: string) => `The quorums of ${a} and ${b} overlap in ${x}, who can referee.`,
    never: (a: string, b: string) => `The quorums of ${a} and ${b} don't overlap, so nobody can referee between them.`,
  },
} as const;
type View = keyof typeof VIEWS;

const NAMES = ['A', 'B', 'C'];
const ROW_CLASS = ['row-a', 'row-b', 'row-c'];

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

/** One row per device; a cell is filled when that device is awake, and ringed when two or more are. */
function timeline(v: number, rows: number[][], view: View): SVGSVGElement {
  const cell = 24;
  const left = 30;
  const top = 20;
  const width = left + v * cell + 2;
  const height = top + rows.length * cell + 4;
  const svg = svgEl('svg', { viewBox: `0 0 ${width} ${height}`, class: 'wake-timeline', role: 'img', style: `max-width: ${Math.round(width * 1.5)}px` });
  const V = VIEWS[view];
  const counts = new Array<number>(v).fill(0);
  rows.forEach((r) => r.forEach((x) => counts[x]++));
  svg.append(
    svgEl(
      'title',
      {},
      rows.map((r, i) => `${V.device} ${NAMES[i]}: ${V.nouns} ${setText(r)}`).join('; '),
    ),
  );
  for (let x = 0; x < v; x++) {
    svg.append(svgEl('text', { x: left + x * cell + cell / 2, y: top - 6, class: 'tick' }, String(x)));
  }
  rows.forEach((r, i) => {
    const y = top + i * cell;
    svg.append(svgEl('text', { x: left - 10, y: y + cell / 2 + 4, class: `row-label ${ROW_CLASS[i]}` }, NAMES[i]));
    const on = new Set(r);
    for (let x = 0; x < v; x++) {
      const cls = ['slot', on.has(x) ? `on ${ROW_CLASS[i]}` : 'off', on.has(x) && counts[x] > 1 ? 'meet' : '']
        .join(' ')
        .trim();
      svg.append(
        svgEl('rect', {
          x: left + x * cell + 1.5,
          y: y + 1.5,
          width: cell - 3,
          height: cell - 3,
          rx: 4,
          class: cls,
          'data-row': i,
          'data-slot': x,
        }),
      );
    }
  });
  return svg;
}

/**
 * `<div data-widget="wake-up" data-v="7" data-seed="1">`: three devices on a
 * repeating cycle of v slots, each awake on D + offset. Sliders move each
 * device's clock; any two devices on a difference-set schedule always share an
 * awake slot. A toggle swaps in a random schedule of the same size (seeded),
 * and a menu relabels slots as keys or quorum members.
 */
export function mount(el: HTMLElement): void {
  let presetIndex = Math.max(
    0,
    SCHEDULE_PRESETS.findIndex((p) => p.v === Number(el.dataset.v ?? 7)),
  );
  const seed = Number(el.dataset.seed ?? 1);
  let random = false;
  let view: View = 'radio';
  let offsets = [0, 2, 5];

  const controls = document.createElement('div');
  controls.className = 'controls';
  const presetSelect = document.createElement('select');
  presetSelect.className = 'preset-select';
  presetSelect.setAttribute('aria-label', 'Cycle length');
  SCHEDULE_PRESETS.forEach((p, i) => presetSelect.append(option(p.label, String(i))));
  presetSelect.value = String(presetIndex);
  const singerButton = button('Difference set', 'schedule-singer');
  const randomButton = button('Random', 'schedule-random');
  const scheduleGroup = document.createElement('span');
  scheduleGroup.className = 'button-group';
  scheduleGroup.setAttribute('role', 'group');
  scheduleGroup.setAttribute('aria-label', 'Schedule');
  scheduleGroup.append(singerButton, randomButton);
  const viewSelect = document.createElement('select');
  viewSelect.className = 'view-select';
  viewSelect.setAttribute('aria-label', 'What the picture means');
  for (const [key, val] of Object.entries(VIEWS)) viewSelect.append(option(val.label, key));
  const shuffle = button('Shuffle clocks', 'shuffle-button');
  controls.append(presetSelect, scheduleGroup, viewSelect, shuffle);

  const sliders = document.createElement('div');
  sliders.className = 'wake-sliders';
  const inputs: HTMLInputElement[] = [];
  const outputs: HTMLOutputElement[] = [];
  const captions: HTMLSpanElement[] = [];
  NAMES.forEach((name, i) => {
    const label = document.createElement('label');
    label.className = `control range ${ROW_CLASS[i]}`;
    const caption = document.createElement('span');
    const input = document.createElement('input');
    input.type = 'range';
    input.min = '0';
    input.className = `offset-${name.toLowerCase()}`;
    const out = document.createElement('output');
    label.append(caption, input, out);
    sliders.append(label);
    inputs.push(input);
    outputs.push(out);
    captions.push(caption);
    input.addEventListener('input', () => {
      offsets[i] = Number(input.value);
      render();
    });
  });

  const box = document.createElement('div');
  box.className = 'wake-box';
  const header = document.createElement('p');
  header.className = 'wake-header';
  const chart = document.createElement('div');
  chart.className = 'wake-chart';
  const scheduleLine = document.createElement('p');
  scheduleLine.className = 'schedule-line';
  const pairs = document.createElement('ul');
  pairs.className = 'wake-pairs';
  pairs.setAttribute('aria-live', 'polite');
  const verdict = document.createElement('p');
  verdict.className = 'verdict';
  const missButton = button('Show a pair that never meets', 'miss-button');
  box.append(header, chart, scheduleLine, pairs, verdict, missButton);

  const schedule = (): { v: number; set: number[]; seed?: number } => {
    const p = SCHEDULE_PRESETS[presetIndex];
    if (!random) return { v: p.v, set: p.set };
    const bad = failingRandomSchedule(p.v, p.set.length, seed, mulberry32);
    return { v: p.v, set: bad.set, seed: bad.seed };
  };

  const render = () => {
    const { v, set, seed: usedSeed } = schedule();
    const V = VIEWS[view];
    offsets = offsets.map((o) => mod(o, v));
    singerButton.setAttribute('aria-pressed', String(!random));
    randomButton.setAttribute('aria-pressed', String(random));
    NAMES.forEach((name, i) => {
      inputs[i].max = String(v - 1);
      inputs[i].value = String(offsets[i]);
      outputs[i].textContent = String(offsets[i]);
      captions[i].textContent = `${V.device} ${name}: ${V.slider} `;
      inputs[i].setAttribute('aria-label', `${V.device} ${name} ${V.offset} offset`);
    });
    header.textContent = V.header;
    const rows = offsets.map((o) => awakeSlots(set, o, v));
    chart.replaceChildren(timeline(v, rows, view));
    const k = set.length;
    const pct = Math.round((100 * k) / v);
    scheduleLine.textContent =
      view === 'radio'
        ? `${random ? `Random schedule (seed ${usedSeed})` : 'Schedule D'} = ${setText(set)}: each radio is awake in ${k} of every ${v} slots (${pct}%) and asleep the rest.`
        : `${random ? `Random set (seed ${usedSeed})` : 'D'} = ${setText(set)}: each ${V.device.toLowerCase()} holds ${k} of the ${v} ${V.nouns}, shifted by its number on the slider.`;

    pairs.replaceChildren();
    let anyMiss = false;
    for (const [i, j] of [
      [0, 1],
      [0, 2],
      [1, 2],
    ]) {
      const a = `${V.device} ${NAMES[i]}`;
      const b = NAMES[j];
      const both = sharedSlots(set, offsets[i], offsets[j], v);
      const li = document.createElement('li');
      if (both.length === 0) {
        anyMiss = true;
        li.className = 'miss';
        li.textContent = V.never(a, b);
      } else {
        const list = both.map(V.member).join(', ').replace(/, ([^,]*)$/, ' and $1');
        li.textContent =
          offsets[i] === offsets[j] ? `${a} and ${b} have the same ${V.offset}, so they share all ${k}.` : V.meet(a, b, list);
      }
      pairs.append(li);
    }

    const missed = missedOffsets(set, v);
    if (missed.length === 0) {
      verdict.className = 'verdict ok';
      verdict.textContent = `Whatever the offsets, any two with different offsets share exactly one ${V.noun}: D is a (${v}, ${k}, 1) difference set, so every offset difference occurs once as a difference of D.`;
    } else {
      verdict.className = 'verdict bad';
      verdict.textContent = `${anyMiss ? 'A miss! ' : ''}With this set, two whose offsets differ by ${missed.join(' or ')} share nothing: those differences never occur in ${setText(set)}.`;
    }
    missButton.hidden = missed.length === 0;
  };

  presetSelect.addEventListener('change', () => {
    presetIndex = Number(presetSelect.value);
    render();
  });
  singerButton.addEventListener('click', () => {
    random = false;
    render();
  });
  randomButton.addEventListener('click', () => {
    random = true;
    render();
  });
  viewSelect.addEventListener('change', () => {
    view = viewSelect.value as View;
    render();
  });
  shuffle.addEventListener('click', () => {
    const { v } = SCHEDULE_PRESETS[presetIndex];
    offsets = offsets.map(() => Math.floor(Math.random() * v));
    render();
  });
  missButton.addEventListener('click', () => {
    const { v, set } = schedule();
    const missed = missedOffsets(set, v);
    if (missed.length) offsets[1] = mod(offsets[0] + missed[0], v);
    render();
  });

  el.classList.add('widget', 'wake-up');
  el.replaceChildren(controls, sliders, box);
  render();
}
