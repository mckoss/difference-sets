import { bruckRyser, cyclicStatus, factorize, planeStatus } from '../math/planeOrders';

const MAX_N = 100;
const MAX_INPUT = 1e12;
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const sup = (n: number) => [...String(n)].map((d) => SUP[Number(d)]).join('');
const num = (x: number) => x.toLocaleString('en-US');

type View = 'cyclic' | 'any';

const LEGEND: Record<View, [string, string][]> = {
  cyclic: [
    ['singer', 'Prime power: Singer set'],
    ['bruck-ryser', 'Ruled out by Bruck–Ryser'],
    ['theorem', 'Ruled out by a theorem on difference sets'],
    ['computer', 'Ruled out by computer search'],
  ],
  any: [
    ['exists', 'Prime power: a plane exists'],
    ['bruck-ryser', 'Ruled out by Bruck–Ryser'],
    ['computer', 'Ruled out by computer search'],
    ['open', 'Open: no plane known'],
  ],
};

const factorText = (n: number) =>
  factorize(n)
    .map(([p, e]) => (e === 1 ? String(p) : `${p}${sup(e)}`))
    .join(' · ');

/** The Bruck–Ryser test for n, step by step, as a list of sentences. */
export function bruckRyserSteps(n: number): string[] {
  const br = bruckRyser(n);
  const steps = [`${num(n)} = ${factorText(n)}, and ${num(n)} ≡ ${br.residue} (mod 4).`];
  if (!br.applies) {
    steps.push('Bruck–Ryser only speaks when n ≡ 1 or 2 (mod 4), so it says nothing about this order.');
    return steps;
  }
  steps.push('Since n ≡ 1 or 2 (mod 4), a plane of order n can exist only if n is a sum of two squares.');
  if (br.squares) {
    const [a, b] = br.squares;
    steps.push(`It is: ${num(n)} = ${a}² + ${b}². The test passes, so Bruck–Ryser does not rule this order out.`);
  } else {
    const tries = Math.floor(Math.sqrt(n / 2));
    if (tries <= 12) {
      const rests = Array.from({ length: tries + 1 }, (_, a) => `${num(n)} − ${a}² = ${num(n - a * a)}`);
      steps.push(`Try every a with a² ≤ n/2: ${rests.join(', ')}. None of these is a perfect square.`);
    }
    steps.push(
      `Another way to see it: ${br.badPrimes.join(' and ')} ${br.badPrimes.length === 1 ? 'is a prime' : 'are primes'} ` +
        `that leave remainder 3 when divided by 4 and divide ${num(n)} an odd number of times, and such a number is never ` +
        `a sum of two squares. So no projective plane of order ${num(n)} exists.`,
    );
  }
  return steps;
}

function detail(n: number): HTMLElement {
  const box = document.createElement('div');
  box.className = 'order-detail';
  const h = document.createElement('p');
  h.className = 'order-title';
  h.textContent = `Order n = ${num(n)}: v = n² + n + 1 = ${num(n * n + n + 1)} points`;
  const ul = document.createElement('ul');
  ul.className = 'br-steps';
  for (const s of bruckRyserSteps(n)) {
    const li = document.createElement('li');
    li.textContent = s;
    ul.append(li);
  }
  const any = document.createElement('p');
  const p = planeStatus(n);
  any.innerHTML = '';
  any.append(Object.assign(document.createElement('strong'), { textContent: 'Any plane: ' }), p.reason);
  const cyc = document.createElement('p');
  const c = cyclicStatus(n);
  cyc.append(Object.assign(document.createElement('strong'), { textContent: 'Cyclic plane (difference set): ' }), c.reason);
  box.append(h, ul, any, cyc);
  return box;
}

/**
 * `<div data-widget="plane-orders" data-view="cyclic">`: the orders
 * 2 … 100 colored by what is known about projective planes of that order,
 * either cyclic ones or any at all, with the Bruck–Ryser test and the
 * reason for the chosen order. `<div data-widget="bruck-ryser" data-n="21">`
 * shows only the test for one order, typed in.
 */
export function mount(el: HTMLElement): void {
  const checkerOnly = el.dataset.widget === 'bruck-ryser';
  let view: View = el.dataset.view === 'any' ? 'any' : 'cyclic';
  let n = Number(el.dataset.n ?? (checkerOnly ? 21 : 12));

  const controls = document.createElement('div');
  controls.className = 'controls';
  const viewButtons = (['cyclic', 'any'] as View[]).map((v) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = `view-${v}`;
    b.textContent = v === 'cyclic' ? 'Cyclic planes' : 'Any plane';
    b.addEventListener('click', () => {
      view = v;
      render();
    });
    return b;
  });
  const inputLabel = document.createElement('label');
  inputLabel.className = 'control';
  const input = document.createElement('input');
  input.type = 'number';
  input.min = '2';
  input.max = String(MAX_INPUT);
  input.className = 'order-input';
  inputLabel.append('n = ', input);
  if (!checkerOnly) controls.append(...viewButtons);
  controls.append(inputLabel);

  const grid = document.createElement('div');
  grid.className = 'order-grid';
  grid.setAttribute('role', 'group');
  grid.setAttribute('aria-label', `Orders 2 to ${MAX_N}`);
  const legend = document.createElement('div');
  legend.className = 'order-legend';
  const detailBox = document.createElement('div');
  detailBox.setAttribute('aria-live', 'polite');

  const cells: HTMLButtonElement[] = [];
  for (let x = 2; x <= MAX_N; x++) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'order-cell';
    b.textContent = String(x);
    b.dataset.n = String(x);
    b.addEventListener('click', () => {
      n = x;
      render();
    });
    cells.push(b);
  }
  grid.append(...cells);

  const render = () => {
    for (const b of viewButtons) b.setAttribute('aria-pressed', String(b.className === `view-${view}`));
    input.value = String(n);
    if (!checkerOnly) {
      const tally = new Map<string, number>();
      for (const b of cells) {
        const x = Number(b.dataset.n);
        const status = view === 'cyclic' ? cyclicStatus(x).status : planeStatus(x).status;
        tally.set(status, (tally.get(status) ?? 0) + 1);
        b.className = `order-cell s-${status}`;
        b.dataset.status = status;
        b.setAttribute('aria-pressed', String(x === n));
        b.title = (view === 'cyclic' ? cyclicStatus(x) : planeStatus(x)).reason;
      }
      legend.replaceChildren(
        ...LEGEND[view].map(([status, label]) => {
          const s = document.createElement('span');
          s.className = `order-key s-${status}`;
          s.textContent = `${label} (${tally.get(status) ?? 0})`;
          return s;
        }),
      );
    }
    detailBox.replaceChildren(detail(n));
  };

  input.addEventListener('change', () => {
    const x = Math.floor(Number(input.value));
    if (Number.isFinite(x) && x >= 2 && x <= MAX_INPUT) n = x;
    render();
  });

  el.classList.add('widget', checkerOnly ? 'bruck-ryser' : 'plane-orders');
  el.replaceChildren(controls, ...(checkerOnly ? [] : [legend, grid]), detailBox);
  render();
}
