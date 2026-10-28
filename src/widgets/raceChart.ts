import { mod } from '../math/numbers';
import {
  carHeats,
  fairestChart,
  fairness,
  opponentCounts,
  parseLineup,
  raceChart,
  sharedWithNext,
} from '../math/race';
import { RACE_MAX_CARS, RACE_MAX_LANES } from '../math/raceTable';
import { setText } from './format';

/** An `<option>` (built by hand; `new Option` is missing in some test DOMs). */
function option(text: string, value: string): HTMLOptionElement {
  const o = document.createElement('option');
  o.textContent = text;
  o.value = value;
  return o;
}

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls = '', text = ''): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text) e.textContent = text;
  return e;
}

const times = (n: number) => (n === 1 ? 'once' : n === 2 ? 'twice' : `${n} times`);

/** "a, b, and c" */
function listText(items: string[]): string {
  if (items.length <= 2) return items.join(' and ');
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

/** "1 or 2 times", "0 to 2 times" */
function rangeText(lo: number, hi: number): string {
  if (lo === hi) return times(lo);
  if (hi === lo + 1) return `${lo === 1 ? 'once' : lo} or ${hi === 2 ? 'twice' : `${hi} times`}`;
  return `${lo} to ${hi} times`;
}

/**
 * `<div data-widget="race-chart" data-lanes="4" data-cars="13">`: a rotation
 * race chart. Heat j puts car j + D[i] mod N in lane i + 1. Pick the lanes
 * and cars (the fairest lineup comes from the precomputed table) or type your
 * own heat-0 lineup; click a car to see its heats and how often it meets each
 * opponent.
 */
export function mount(root: HTMLElement): void {
  let lanes = Math.min(RACE_MAX_LANES, Math.max(2, Number(root.dataset.lanes ?? 4)));
  let cars = Math.min(RACE_MAX_CARS, Math.max(lanes + 1, Number(root.dataset.cars ?? 13)));
  let set = fairestChart(lanes, cars)?.set ?? [];
  let car = 0;

  const controls = el('div', 'controls');
  const lanesSelect = el('select', 'lanes-select');
  lanesSelect.setAttribute('aria-label', 'Lanes on the track');
  for (let k = 2; k <= RACE_MAX_LANES; k++) lanesSelect.append(option(`${k} lanes`, String(k)));
  const carsSelect = el('select', 'cars-select');
  carsSelect.setAttribute('aria-label', 'Cars in the race');
  const lineupLabel = el('label', 'control lineup-control', 'Heat 0 lineup ');
  const lineupInput = el('input', 'lineup-input');
  lineupInput.type = 'text';
  lineupInput.spellcheck = false;
  lineupInput.setAttribute('inputmode', 'numeric');
  lineupLabel.append(lineupInput);
  const fairestButton = el('button', 'fairest-button', 'Fairest');
  fairestButton.type = 'button';
  controls.append(lanesSelect, carsSelect, lineupLabel, fairestButton);

  const message = el('p', 'hint lineup-message');
  message.setAttribute('aria-live', 'polite');

  const box = el('div', 'race-box');
  const scroll = el('div', 'race-scroll');
  const carLine = el('p', 'race-car');
  carLine.setAttribute('aria-live', 'polite');
  const opponents = el('div', 'race-opponents');
  const verdict = el('p', 'verdict');
  const nextLine = el('p', 'race-next');
  box.append(verdict, scroll, carLine, opponents, nextLine);

  const fillCars = () => {
    carsSelect.replaceChildren();
    for (let n = lanes + 1; n <= RACE_MAX_CARS; n++) carsSelect.append(option(`${n} cars`, String(n)));
    carsSelect.value = String(cars);
  };

  const table = () => {
    const t = el('table', 'race-table');
    const head = el('tr');
    head.append(el('th', '', 'Heat'));
    for (let i = 0; i < lanes; i++) head.append(el('th', '', `Lane ${i + 1}`));
    head.append(el('th', 'next-col', 'Also next heat'));
    const thead = el('thead');
    thead.append(head);
    const body = el('tbody');
    raceChart(set, cars).forEach((lineup, j) => {
      const tr = el('tr');
      if (lineup.includes(car)) tr.className = 'has-car';
      tr.append(el('th', '', String(j)));
      lineup.forEach((c, i) => {
        const td = el('td');
        const b = el('button', c === car ? 'car selected' : 'car', String(c));
        b.type = 'button';
        b.dataset.car = String(c);
        b.setAttribute('aria-label', `Heat ${j}, lane ${i + 1}: car ${c}`);
        td.append(b);
        tr.append(td);
      });
      const again = sharedWithNext(set, j, cars);
      tr.append(el('td', 'next-col', again.join(', ') || (j === cars - 1 ? '' : '—')));
      body.append(tr);
    });
    t.append(thead, body);
    return t;
  };

  const render = () => {
    lanesSelect.value = String(lanes);
    lineupInput.size = Math.max(8, setText(set).length);
    car = mod(car, cars);
    const best = fairestChart(lanes, cars);
    const isFairest = best !== undefined && setText(best.set) === setText(set);
    fairestButton.setAttribute('aria-pressed', String(isFairest));

    scroll.replaceChildren(table());

    const heats = carHeats(set, car, cars);
    carLine.textContent = `Car ${car} races in ${listText(
      heats.map((h) => `heat ${h.heat} (lane ${h.lane + 1})`),
    )}: once in each of the ${lanes} lanes. Click any car in the chart to follow it.`;

    const counts = opponentCounts(set, car, cars);
    const f = fairness(set, cars);
    opponents.replaceChildren();
    const caption = el('p', 'race-opponents-caption', `How often car ${car} races each other car:`);
    const strip = el('div', 'distance-tally');
    counts.forEach((n, b) => {
      if (b === car) return;
      const cls = n === 0 ? 'missing' : f.hi > f.lo && n === f.hi ? 'more' : '';
      const cell = el('span', `tally-cell ${cls}`.trim());
      cell.dataset.car = String(b);
      cell.title = `Car ${car} and car ${b} meet ${times(n)}`;
      cell.append(String(b), el('small', '', `× ${n}`));
      strip.append(cell);
    });
    opponents.append(caption, strip);

    const pairs = (cars * (cars - 1)) / 2;
    const meetings = lanes * (lanes - 1);
    const parts = f.pairsByMeetings
      .map((n, m) => (n ? `${n} meet ${times(m)}` : ''))
      .filter(Boolean)
      .map((s) => s.replace(/meet 0 times/, 'never meet'));
    let text: string;
    if (f.lo === f.hi) {
      text = `Perfect: every two cars race each other exactly ${times(f.lo)}. The lineup is a (${cars}, ${lanes}, ${f.lo}) difference set.`;
    } else {
      text = `Every two cars meet ${rangeText(f.lo, f.hi)}. Of the ${pairs} pairs of cars, ${listText(parts)}.`;
      const better =
        best !== undefined && (best.hi - best.lo < f.hi - f.lo || (best.hi - best.lo === f.hi - f.lo && best.hi < f.hi));
      if (best && better) {
        text += ` Fairer: ${setText(best.set)} makes every two cars meet ${rangeText(best.lo, best.hi)}.`;
      } else if (meetings % (cars - 1) !== 0) {
        text += ` No chart can be perfect here: each car has ${meetings} meetings to share among ${cars - 1} opponents.`;
      } else {
        text += ` A perfect rotation would need a (${cars}, ${lanes}, ${meetings / (cars - 1)}) difference set mod ${cars}, and there is none.`;
      }
    }
    const fairest = best !== undefined && best.lo === f.lo && best.hi === f.hi;
    verdict.className = `verdict ${fairest ? 'ok' : 'bad'}`;
    verdict.textContent = text;

    let changes = 0;
    for (let j = 0; j < cars - 1; j++) if (sharedWithNext(set, j, cars).length) changes++;
    nextLine.textContent =
      changes === 0
        ? 'No car ever races in two heats in a row.'
        : `In ${changes} of the ${cars - 1} changes from one heat to the next, some car races again right away (last column).`;
  };

  const loadFairest = () => {
    set = fairestChart(lanes, cars)?.set ?? set;
    lineupInput.value = setText(set);
    message.textContent = '';
    render();
  };

  lanesSelect.addEventListener('change', () => {
    lanes = Number(lanesSelect.value);
    cars = Math.max(cars, lanes + 1);
    fillCars();
    loadFairest();
  });
  carsSelect.addEventListener('change', () => {
    cars = Number(carsSelect.value);
    loadFairest();
  });
  fairestButton.addEventListener('click', loadFairest);
  lineupInput.addEventListener('input', () => {
    const parsed = parseLineup(lineupInput.value, lanes, cars);
    if (typeof parsed === 'string') {
      message.textContent = parsed;
      return;
    }
    message.textContent = '';
    set = parsed;
    render();
  });
  scroll.addEventListener('click', (e) => {
    const b = (e.target as Element).closest<HTMLElement>('button.car');
    if (!b) return;
    car = Number(b.dataset.car);
    render();
    scroll.querySelector<HTMLElement>(`button.car.selected[data-car="${car}"]`)?.focus();
  });

  root.classList.add('widget', 'race-chart');
  root.replaceChildren(controls, message, box);
  fillCars();
  lineupInput.value = setText(set);
  render();
}
