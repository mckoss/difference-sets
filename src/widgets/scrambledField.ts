import { isPrime } from '../math/numbers';
import { button, h, opTable, selectControl } from './ui';

const LETTERS = 'ABCDEFGHIJKLM';

/** A small deterministic generator, so a given seed always gives the same scramble. */
function shuffle(n: number, seed: number): number[] {
  const perm = Array.from({ length: n }, (_, i) => i);
  let s = seed >>> 0 || 1;
  const rand = () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return (s >>> 0) / 2 ** 32;
  };
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [perm[i], perm[j]] = [perm[j], perm[i]];
  }
  return perm;
}

/**
 * `<div data-widget="scrambled-field" data-p="5" data-seed="7">`: a field
 * with p elements whose elements have been renamed with letters in a
 * shuffled order, so the tables look random. The reader finds 0 and 1, then
 * keeps adding 1 to name every element; at the end the tables snap into
 * clock arithmetic mod p.
 */
export function mount(el: HTMLElement): void {
  let p = isPrime(Number(el.dataset.p)) && Number(el.dataset.p) <= 13 ? Number(el.dataset.p) : 5;
  let seed = Number(el.dataset.seed ?? 7);
  // Step 0: nothing known. 1: 0 found. 2: 1 found. 2 + j: j + 1 found, up to p.
  // p + 1: counted back to 0. p + 2: snapped into order.
  let step = 0;
  let letterOf: number[] = [];

  const controls = h('div', { class: 'controls' });
  const status = h('p', { class: 'ff-status', attrs: { 'aria-live': 'polite' } });
  const tables = h('div', { class: 'ff-pair' });
  const log = h('ol', { class: 'ff-steps scramble-log' });

  const setup = () => {
    // Letter A..: the element named by letter i has value perm[i]; letterOf[value] = i.
    const perm = shuffle(p, seed * 31 + p);
    // Keep 0 and 1 off the first two letters so they are not given away.
    while (p > 2 && (perm[0] === 0 || perm[0] === 1)) perm.push(perm.shift()!);
    letterOf = new Array<number>(p);
    perm.forEach((value, i) => (letterOf[value] = i));
    step = 0;
    log.replaceChildren();
  };

  const name = (value: number) => LETTERS[letterOf[value]];
  const known = (value: number) => {
    if (step >= 1 && value === 0) return true;
    if (step >= 2 && value === 1) return true;
    return value >= 2 && value <= Math.min(step - 1, p - 1);
  };
  const header = (value: number) => (known(value) ? `${name(value)}=${value}` : name(value));

  const next = () => {
    if (step === 0) {
      log.append(h('li', { text: `${name(0)} + x = x for every x (its + row copies the header), so ${name(0)} is 0.` }));
    } else if (step === 1) {
      log.append(h('li', { text: `${name(1)} × x = x for every x (its × row copies the header), so ${name(1)} is 1.` }));
    } else if (step < p) {
      const j = step; // finding the value j
      log.append(h('li', { text: `${name(j - 1)} + ${name(1)} = ${name(j)}, so ${name(j)} is ${j - 1} + 1 = ${j}.` }));
    } else if (step === p) {
      log.append(
        h('li', {
          text: `${name(p - 1)} + ${name(1)} = ${name(0)}: adding 1 a total of ${p} times returns to 0. Every element is now a count of 1s.`,
        }),
      );
    }
    step++;
    render();
  };

  const drawControls = () => {
    const label = step === 0 ? 'Find 0' : step === 1 ? 'Find 1' : step <= p ? 'Add 1' : step === p + 1 ? 'Snap into order' : 'Done';
    const nextBtn = button(label, next, 'scramble-next');
    nextBtn.disabled = step > p + 1;
    controls.replaceChildren(
      selectControl(
        'p =',
        [2, 3, 5, 7, 11, 13].map((x) => ({ value: String(x), label: String(x) })),
        String(p),
        (v) => {
          p = Number(v);
          setup();
          render();
        },
        'scramble-p',
      ).wrap,
      nextBtn,
      button('Scramble again', () => {
        seed = (seed * 1103515245 + 12345) % 2 ** 31;
        setup();
        render();
      }, 'scramble-reset'),
    );
  };

  const render = () => {
    drawControls();
    const snapped = step > p + 1;
    // Display order: alphabetical by letter until snapped, then by value.
    const order = snapped
      ? Array.from({ length: p }, (_, v) => v)
      : Array.from({ length: p }, (_, i) => letterOf.indexOf(i));
    const heads = order.map(header);
    // Cell to emphasize: the sum used in the latest step.
    let focus: [number, number] | null = null;
    if (step >= 3 && step <= p + 1) focus = [step - 2, 1];
    const make = (op: '+' | '×') =>
      opTable({
        caption: op === '+' ? 'Addition' : 'Multiplication',
        corner: op,
        rowHeads: heads,
        colHeads: heads,
        cell: (r, c) => {
          const v = op === '+' ? (order[r] + order[c]) % p : (order[r] * order[c]) % p;
          return snapped ? String(v) : name(v);
        },
        cellClass: (r, c) => {
          const cls: string[] = [];
          if (op === '+' && step === 1 && order[r] === 0) cls.push('hint');
          if (op === '×' && step === 2 && order[r] === 1) cls.push('hint');
          if (op === '+' && focus && order[r] === focus[0] && order[c] === focus[1]) cls.push('focus');
          return cls.join(' ');
        },
        colClass: (c) => (known(order[c]) ? 'known' : ''),
        rowClass: (r) => (known(order[r]) ? 'known' : ''),
        cls: 'scramble',
      });
    tables.replaceChildren(make('+'), make('×'));

    if (step === 0) status.textContent = `A field with ${p} elements, named with letters in a random order. Which letter is 0?`;
    else if (step === 1) status.textContent = `Found 0. Which letter is 1? Look for the × row that copies the header.`;
    else if (step <= p) status.textContent = `Now keep adding 1: the highlighted sum names the next element.`;
    else if (step === p + 1)
      status.textContent = `Every letter is a sum 1 + 1 + … + 1. Snap the tables into that order.`;
    else
      status.textContent = `Sorted by count, the tables are exactly addition and multiplication mod ${p}. Renaming each letter by its count is an isomorphism onto ℤ/${p}ℤ.`;
  };

  el.classList.add('widget', 'ff-widget');
  el.replaceChildren(controls, status, tables, log);
  setup();
  render();
}
