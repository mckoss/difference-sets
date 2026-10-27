import { firstPrimitivePoly, isIrreducible, parsePoly, PolyRing } from '../math/field';
import { gcd, primePower } from '../math/numbers';
import { polyFormat, superscript } from '../math/poly';
import { arrowCircle } from '../viz/arrowCircle';
import { h, selectControl } from './ui';

const FIELDS = [4, 8, 9, 16, 25, 27, 49, 64];

/**
 * `<div data-widget="frobenius" data-field="64" data-q="4">`: the map
 * x ↦ x^q on GF(field), built from the first primitive polynomial over its
 * prime field with α = x. Nonzero elements αⁱ sit around a circle at
 * position i; arrows show where the map sends each one, and the fixed
 * points (a subfield) are highlighted. Below: the cycles of the map, the
 * fixed points as polynomials, and a check of (a + b)^q = a^q + b^q.
 */
export function mount(el: HTMLElement): void {
  let size = FIELDS.includes(Number(el.dataset.field)) ? Number(el.dataset.field) : 8;
  let q = validQ(size, Number(el.dataset.q)) ? Number(el.dataset.q) : primePower(size)![0];
  let a = 1;
  let b = 2;
  let given = parsePoly(el.dataset.poly);
  const fixed = el.hasAttribute('data-fixed');

  const controls = h('div', { class: 'controls' });
  const summary = h('p', { class: 'ff-verdict', attrs: { 'aria-live': 'polite' } });
  const figure = h('div', { class: 'ff-figure' });
  const cycles = h('div', { class: 'ff-info' });
  const fixedList = h('div', { class: 'ff-info' });
  const dream = h('div', { class: 'ff-info' });

  const render = () => {
    const [p, deg] = primePower(size)!;
    const usable = given && given.length === deg + 1 && given[deg] === 1 && given.every((c) => c < p) && isIrreducible(given, p);
    const R = new PolyRing(p, usable ? given! : firstPrimitivePoly(p, deg));
    const alpha = R.isPrimitive(R.x) ? R.x : R.elements().find((x) => R.isPrimitive(x))!;
    const N = size - 1;
    const j = Math.round(Math.log(q) / Math.log(p));
    const d = gcd(j, deg);
    const sub = p ** d;
    const step = N / (sub - 1);
    const image = (i: number) => (i * q) % N;

    controls.replaceChildren(
      ...(fixed
        ? []
        : [
      selectControl(
        'field GF(',
        FIELDS.map((s) => ({ value: String(s), label: `${s}` })),
        String(size),
        (v) => {
          size = Number(v);
          given = null;
          q = primePower(size)![0];
          a = 1;
          b = 2;
          render();
        },
        'frob-field',
      ).wrap,
      ')',
          ]),
      selectControl(
        'map x ↦ x^q with q =',
        Array.from({ length: deg }, (_, i) => p ** (i + 1)).map((x) => ({ value: String(x), label: String(x) })),
        String(q),
        (v) => {
          q = Number(v);
          render();
        },
        'frob-q',
      ).wrap,
    );

    const fixedExps = Array.from({ length: N }, (_, i) => i).filter((i) => image(i) === i);
    summary.className = 'ff-verdict ok';
    summary.textContent =
      `In GF(${size}) = GF(${p}${superscript(deg)}), the map x ↦ x${superscript(q)} fixes ${sub} elements: ` +
      `0 and the ${sub - 1} powers of α${superscript(step)}` +
      (sub === size ? ' — that is, every element, since x^' + size + ' = x always.' : `. They form a copy of GF(${sub}) inside GF(${size}).`);

    figure.replaceChildren(
      arrowCircle({
        labels: Array.from({ length: N }, (_, i) => String(i)),
        arrows: Array.from({ length: N }, (_, i) => ({ from: i, to: image(i), cls: image(i) === i ? 'fixed' : '' })),
        pointClass: (i) => (image(i) === i ? 'fixed' : ''),
        centerPoint: { label: '0', cls: 'fixed' },
        ariaLabel: `Frobenius map x to x^${q} on GF(${size})`,
        size: N > 40 ? 400 : 320,
      }),
      h('p', {
        class: 'ff-legend',
        text: `Point i stands for αⁱ, with α = ${R.label(alpha, 'poly', 'x', false)} mod ${polyFormat(R.modulus)}; 0 is in the middle. An arrow i → j means (αⁱ)${superscript(q)} = αʲ, that is, j = ${q}i mod ${N}. Highlighted points are fixed.`,
      }),
    );

    // Cycles of the permutation on exponents.
    const seen = new Set<number>();
    const orbitChips: HTMLElement[] = [];
    for (let i = 0; i < N; i++) {
      if (seen.has(i)) continue;
      const orbit: number[] = [];
      for (let x = i; !seen.has(x); x = image(x)) {
        seen.add(x);
        orbit.push(x);
      }
      const text = orbit.length === 1 ? `α${superscript(i)} (fixed)` : [...orbit, orbit[0]].map((x) => `α${superscript(x)}`).join(' → ');
      orbitChips.push(h('li', { class: orbit.length === 1 ? 'fixed' : '', text }));
    }
    cycles.replaceChildren(
      h('p', { text: `The map shuffles the nonzero elements in cycles. Applying it ${deg / d} times returns every element to where it started:` }),
      h('ul', { class: 'chips orbits' }, ...orbitChips),
    );

    fixedList.replaceChildren(
      h('p', { text: `The fixed elements, written as polynomials in x of degree below ${deg} over GF(${p}):` }),
      h(
        'ul',
        { class: 'chips fixed-list' },
        h('li', { class: 'fixed', text: '0' }),
        ...fixedExps.map((i) => h('li', { class: 'fixed', text: `α${superscript(i)} = ${R.label(R.pow(alpha, i), 'poly', 'x', false)}` })),
      ),
    );

    // The freshman's dream check.
    const els = R.elements();
    const choices = els.map((x) => ({ value: String(x), label: R.label(x, 'poly', 'x', false) }));
    const lhs = R.pow(R.add(a, b), q);
    const rhs = R.add(R.pow(a, q), R.pow(b, q));
    const nm = (x: number) => R.label(x, 'poly', 'x', false);
    dream.replaceChildren(
      h(
        'div',
        { class: 'controls' },
        'Check (a + b)^q = a^q + b^q:  a = ',
        selectControl('', choices, String(a), (v) => {
          a = Number(v);
          render();
        }, 'frob-a').wrap,
        ' b = ',
        selectControl('', choices, String(b), (v) => {
          b = Number(v);
          render();
        }, 'frob-b').wrap,
      ),
      h('p', {
        class: 'dream-result',
        text:
          `(a + b)${superscript(q)} = (${nm(R.add(a, b))})${superscript(q)} = ${nm(lhs)}, and ` +
          `a${superscript(q)} + b${superscript(q)} = ${nm(R.pow(a, q))} + ${nm(R.pow(b, q))} = ${nm(rhs)}. ` +
          (lhs === rhs ? 'Equal.' : 'Not equal!'),
      }),
    );
  };

  el.classList.add('widget', 'ff-widget');
  el.replaceChildren(controls, summary, figure, cycles, fixedList, dream);
  render();
}

function validQ(size: number, q: number): boolean {
  const pe = primePower(size);
  if (!pe) return false;
  for (let j = 1; j <= pe[1]; j++) if (pe[0] ** j === q) return true;
  return false;
}
