import { shared } from '../math/deck';
import { mod } from '../math/numbers';
import { renderCard, symbolsFor } from './cards';
import { parseSet } from './differenceWorkbench';
import { setText } from './format';

/**
 * `<div data-widget="match-cards" data-v="7" data-set="0,1,3" data-seed="3">`:
 * the whole small deck whose card j holds the symbols at D + j. Click two
 * cards to see the one symbol they share; "Show point numbers" reveals which
 * point each symbol stands for.
 */
export function mount(el: HTMLElement): void {
  const v = Number(el.dataset.v ?? 7);
  const set = parseSet(el.dataset.set ?? '0,1,3');
  const seed = Number(el.dataset.seed ?? 3);
  const symbols = symbolsFor(v, seed, 'all');
  const cards = Array.from({ length: v }, (_, j) => set.map((d) => mod(d + j, v)));
  let picked: number[] = [];
  let numbers = false;

  const controls = document.createElement('div');
  controls.className = 'controls';
  const numLabel = document.createElement('label');
  numLabel.className = 'control';
  const numBox = document.createElement('input');
  numBox.type = 'checkbox';
  numBox.className = 'numbers-toggle';
  numLabel.append(numBox, ' Show point numbers');
  controls.append(numLabel);

  const grid = document.createElement('div');
  grid.className = 'match-grid';
  const info = document.createElement('p');
  info.className = 'match-info';
  info.setAttribute('aria-live', 'polite');

  const buttons = cards.map((points, j) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'match-pick';
    b.dataset.card = String(j);
    b.setAttribute('aria-pressed', 'false');
    const card = renderCard({ points, symbols, label: `Card ${j}` });
    for (const sym of card.querySelectorAll<HTMLElement>('.sym')) {
      const tag = document.createElement('span');
      tag.className = 'point-tag';
      tag.textContent = sym.dataset.point ?? '';
      sym.append(tag);
    }
    const cap = document.createElement('span');
    cap.className = 'match-caption';
    cap.textContent = `Card ${j}`;
    b.append(card, cap);
    grid.append(b);
    return b;
  });

  const render = () => {
    grid.classList.toggle('show-numbers', numbers);
    buttons.forEach((b, j) => b.setAttribute('aria-pressed', String(picked.includes(j))));
    for (const s of grid.querySelectorAll('.sym.found')) s.classList.remove('found');
    if (picked.length < 2) {
      info.textContent =
        picked.length === 0
          ? `Click any two cards. Card j holds the symbols for the points of D + j, where D = ${setText(set)} mod ${v}.`
          : `Card ${picked[0]} is D + ${picked[0]} = ${setText([...cards[picked[0]]].sort((a, b) => a - b))}. Now click a second card.`;
      return;
    }
    const [a, b] = picked;
    const common = shared(cards[a], cards[b]);
    for (const p of common) {
      for (const j of picked) buttons[j].querySelector(`.sym[data-point="${p}"]`)?.classList.add('found');
    }
    const sorted = (j: number) => setText([...cards[j]].sort((x, y) => x - y));
    info.textContent =
      `Card ${a} = D + ${a} = ${sorted(a)} and card ${b} = D + ${b} = ${sorted(b)} share ` +
      (common.length === 1 ? `one point, ${common[0]}: the ${symbols[common[0]].name}.` : `${common.length} points.`);
  };

  grid.addEventListener('click', (e) => {
    const b = (e.target as Element).closest<HTMLButtonElement>('.match-pick');
    if (!b) return;
    const j = Number(b.dataset.card);
    if (picked.includes(j)) picked = picked.filter((x) => x !== j);
    else picked = picked.length >= 2 ? [picked[1], j] : [...picked, j];
    render();
  });
  numBox.addEventListener('change', () => {
    numbers = numBox.checked;
    render();
  });

  el.classList.add('widget', 'match-cards');
  el.replaceChildren(controls, grid, info);
  render();
}
