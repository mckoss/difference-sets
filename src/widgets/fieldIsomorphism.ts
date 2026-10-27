import { findIsomorphism, irreduciblePolys, isIsomorphism, parsePoly, PolyRing } from '../math/field';
import { polyFormat } from '../math/poly';
import { emitState, h, modulusChoices, PRIMES, selectControl } from './ui';

const MAX = 64;

/**
 * `<div data-widget="field-isomorphism" data-p="2" data-e="3" data-a="1,1,0,1" data-b="1,0,1,1">`:
 * two versions of GF(p^e), from two irreducible moduli f(x) and g(y). Sending
 * x to a root of f in the second field relabels one field as the other; the
 * widget lists the relabeling and checks that it preserves + and ×.
 * `data-fixed` hides the p and e selectors.
 */
export function mount(el: HTMLElement): void {
  let p = PRIMES.includes(Number(el.dataset.p)) ? Number(el.dataset.p) : 2;
  let e = Number(el.dataset.e ?? 3);
  if (!(e >= 1 && p ** e <= MAX)) e = p === 2 ? 3 : 2;
  const pick = (text: string | undefined, fallback: number) => {
    const irr = irreduciblePolys(p, e);
    const f = parsePoly(text);
    return f && irr.some((g) => g.join() === f.join()) ? f : irr[Math.min(fallback, irr.length - 1)];
  };
  let fa = pick(el.dataset.a, 0);
  let fb = pick(el.dataset.b, 1);
  let choice = 0;
  const fixed = el.hasAttribute('data-fixed');

  const controls = h('div', { class: 'controls' });
  const summary = h('p', { class: 'ff-verdict', attrs: { 'aria-live': 'polite' } });
  const roots = h('div', { class: 'ff-info' });
  const host = h('div');
  const check = h('p', { class: 'ff-status iso-check' });

  const resetPolys = () => {
    fa = pick(undefined, 0);
    fb = pick(undefined, 1);
    choice = 0;
  };

  const render = () => {
    const nums = (xs: number[]) => xs.map((x) => ({ value: String(x), label: String(x) }));
    const parts: HTMLElement[] = [];
    if (!fixed) {
      parts.push(
        selectControl('p =', nums(PRIMES.filter((x) => x * x <= MAX)), String(p), (v) => {
          p = Number(v);
          if (p ** e > MAX) e = 2;
          resetPolys();
          render();
        }, 'iso-p').wrap,
        selectControl('e =', nums([1, 2, 3, 4, 5, 6].filter((x) => p ** x <= MAX)), String(e), (v) => {
          e = Number(v);
          resetPolys();
          render();
        }, 'iso-e').wrap,
      );
    }
    const irrChoices = modulusChoices(p, e, true);
    parts.push(
      selectControl('first field mod f(x) =', irrChoices, fa.join(','), (v) => {
        fa = v.split(',').map(Number);
        choice = 0;
        emitState(el, { poly: fa.join(',') });
        render();
      }, 'iso-a').wrap,
      selectControl(
        'second field mod g(y) =',
        irrChoices.map((c) => ({ ...c, label: c.label.replaceAll('x', 'y') })),
        fb.join(','),
        (v) => {
          fb = v.split(',').map(Number);
          choice = 0;
          emitState(el, { poly2: fb.join(',') });
          render();
        },
        'iso-b',
      ).wrap,
    );
    controls.replaceChildren(...parts);

    const F = new PolyRing(p, fa);
    const G = new PolyRing(p, fb);
    const rs = G.roots(F.modulus);
    choice = Math.min(choice, rs.length - 1);
    const map = findIsomorphism(F, G, choice)!;
    const gy = (x: number) => G.label(x, 'poly', 'y', false);
    const fx = (x: number) => F.label(x, 'poly', 'x', false);

    summary.className = 'ff-verdict ok';
    summary.textContent =
      fa.join() === fb.join()
        ? `Both fields use the same modulus. Pick a different g(y) to see a nontrivial relabeling.`
        : `Two versions of GF(${F.size}): remainders mod f(x) = ${polyFormat(fa)}, and remainders mod g(y) = ${polyFormat(fb, 'y')}.`;

    roots.replaceChildren(
      h('p', {
        text:
          `In the second field, f has ${rs.length} root${rs.length === 1 ? '' : 's'}: elements r with f(r) = 0. ` +
          `Since f(x) = 0 in the first field, sending x to a root r and each a(x) to a(r) respects every calculation.`,
      }),
      selectControl(
        'send x to the root r =',
        rs.map((r, i) => ({ value: String(i), label: gy(r) })),
        String(choice),
        (v) => {
          choice = Number(v);
          render();
        },
        'iso-root',
      ).wrap,
    );

    host.replaceChildren(
      h(
        'div',
        { class: 'ff-scroll' },
        h(
          'table',
          { class: 'ff-table iso-table' },
          h('caption', { text: 'The relabeling' }),
          h('thead', {}, h('tr', {}, h('th', { text: `mod ${polyFormat(fa)}` }), h('th', { text: '↦' }), h('th', { text: `mod ${polyFormat(fb, 'y')}` }))),
          h(
            'tbody',
            {},
            ...F.elements().map((a) =>
              h('tr', {}, h('td', { text: fx(a) }), h('td', { text: '↦' }), h('td', { text: gy(map[a]) })),
            ),
          ),
        ),
      ),
    );
    const ok = isIsomorphism(F, G, map);
    check.className = `ff-status iso-check ${ok ? 'ok' : 'bad'}`;
    check.textContent = ok
      ? `Checked all ${F.size}² = ${F.size * F.size} sums and products: relabeling then adding (or multiplying) gives the same answer as adding (or multiplying) then relabeling. It is an isomorphism.`
      : 'This relabeling does not preserve the operations.';
  };

  el.classList.add('widget', 'ff-widget');
  el.replaceChildren(controls, summary, roots, host, check);
  render();
}
