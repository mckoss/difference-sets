import { divisionSteps, parsePolyText } from '../math/field';
import { polyDeg, polyFormat, type Poly } from '../math/poly';
import { button, h, PRIMES, selectControl } from './ui';

/**
 * `<div data-widget="poly-division" data-p="2" data-a="x^4" data-b="x^3+x+1">`:
 * long division of polynomials over GF(p), one leading term per click. The
 * reader can type their own dividend and divisor.
 */
export function mount(el: HTMLElement): void {
  let p = PRIMES.includes(Number(el.dataset.p)) ? Number(el.dataset.p) : 2;
  let aText = el.dataset.a ?? 'x^4';
  let bText = el.dataset.b ?? 'x^3 + x + 1';
  let shown = 0;

  const aInput = h('input', { class: 'div-a', attrs: { type: 'text', value: aText, 'aria-label': 'dividend', size: '14' } });
  const bInput = h('input', { class: 'div-b', attrs: { type: 'text', value: bText, 'aria-label': 'divisor', size: '14' } });
  const work = h('div', { class: 'div-work' });
  const status = h('p', { class: 'ff-status', attrs: { 'aria-live': 'polite' } });

  const parsed = (): { a: Poly; b: Poly } | null => {
    const a = parsePolyText(aText, p);
    const b = parsePolyText(bText, p);
    return a && b && polyDeg(b) >= 0 ? { a, b } : null;
  };

  const onInput = () => {
    aText = aInput.value;
    bText = bInput.value;
    shown = 0;
    render();
  };
  aInput.addEventListener('input', onInput);
  bInput.addEventListener('input', onInput);

  const controls = h(
    'div',
    { class: 'controls' },
    h('label', { class: 'control' }, 'divide ', aInput),
    h('label', { class: 'control' }, 'by ', bInput),
    selectControl(
      'over GF(',
      PRIMES.map((x) => ({ value: String(x), label: String(x) })),
      String(p),
      (v) => {
        p = Number(v);
        shown = 0;
        render();
      },
      'div-p',
    ).wrap,
    ')',
    button('Next step', () => {
      shown++;
      render();
    }, 'div-step'),
    button('Show all', () => {
      shown = Infinity;
      render();
    }, 'div-all'),
    button('Reset', () => {
      shown = 0;
      render();
    }, 'div-reset'),
  );

  const render = () => {
    const input = parsed();
    if (!input) {
      work.replaceChildren();
      status.textContent = 'Type polynomials like x^4 + x + 1 (use ^ for powers), with a nonzero divisor.';
      return;
    }
    const { a, b } = input;
    const steps = divisionSteps(a, b, p);
    shown = Math.min(shown, steps.length);
    const fa = polyFormat(a);
    const fb = polyFormat(b);
    const rows: HTMLElement[] = [h('p', { class: 'div-start', text: `Start: ${fa}` })];
    const lead = (x: Poly) => polyFormat([...new Array<number>(polyDeg(x)).fill(0), x[polyDeg(x)]]);
    steps.slice(0, shown).forEach((s, i) => {
      const before = i === 0 ? a : steps[i - 1].remainder;
      rows.push(
        h(
          'div',
          { class: 'div-step-row' },
          h('p', { text: `Step ${i + 1}. Leading term ${lead(before)} ÷ ${lead(b)} = ${polyFormat(s.term)}.` }),
          h('p', { text: `Subtract ${polyFormat(s.term)} × (${fb}) = ${polyFormat(s.subtracted)}, coefficients mod ${p}:` }),
          h('p', { class: 'div-rem', text: `left over: ${polyFormat(s.remainder)}` }),
        ),
      );
    });
    work.replaceChildren(...rows);
    const quotient = steps.slice(0, shown).reduce<Poly>((acc, s) => {
      const r = acc.slice();
      s.term.forEach((c, i) => (r[i] = ((r[i] ?? 0) + c) % p));
      return r;
    }, [0]);
    if (shown >= steps.length) {
      const rem = steps.length ? steps[steps.length - 1].remainder : a;
      status.textContent =
        `Done: the degree of what is left (${polyDeg(rem) < 0 ? 'none, it is 0' : polyDeg(rem)}) is below the divisor's (${polyDeg(b)}). ` +
        `${fa} = (${polyFormat(trim(quotient))}) × (${fb}) + ${polyFormat(rem)}, so the remainder is ${polyFormat(rem)}.`;
    } else {
      status.textContent = `${steps.length - shown} more step${steps.length - shown === 1 ? '' : 's'}. Click Next step.`;
    }
  };

  el.classList.add('widget', 'ff-widget');
  el.replaceChildren(controls, work, status);
  render();
}

function trim(a: Poly): Poly {
  const r = a.slice();
  while (r.length > 1 && r[r.length - 1] === 0) r.pop();
  return r;
}
