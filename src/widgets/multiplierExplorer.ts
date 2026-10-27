import { multiplierClasses, multiplySet, powersMod, traceSet, translateOffset, units } from '../math/construction';
import { primePower, totient } from '../math/numbers';
import { superscript } from '../math/poly';
import { singerV } from '../math/singer';
import { chordDiagram } from '../viz/chordDiagram';
import { setText } from './format';
import { h, selectControl } from './ui';

const ALL_QS = [2, 3, 4, 5, 7, 8, 9, 11, 13];

/**
 * `<div data-widget="multiplier-explorer" data-q="3" data-t="2" [data-qs="…"]>`:
 * multiply the trace set D of Lesson 14 by any t coprime to v. Shows t·D
 * beside D, says whether it is a translate D + j (t is then a multiplier, a
 * power of p), and groups all φ(v) choices of t into the classes of t·D up
 * to translation, with each class next to its mirror image.
 */
export function mount(el: HTMLElement): void {
  const qs = (el.dataset.qs ?? '')
    .split(',')
    .map(Number)
    .filter((q) => ALL_QS.includes(q));
  const QS = qs.length ? qs : ALL_QS;
  let q = QS.includes(Number(el.dataset.q)) ? Number(el.dataset.q) : QS[0];
  let t = Number(el.dataset.t ?? 2);

  const controls = h('div', { class: 'controls' });
  const verdict = h('div', { class: 'ff-info me-verdict', attrs: { 'aria-live': 'polite' } });
  const figures = h('div', { class: 'gallery me-figures' });
  const summary = h('p', { class: 'ff-verdict ok me-summary' });
  const classes = h('div', { class: 'me-classes' });
  const more = h('p', { class: 'ff-legend me-more' });

  const render = () => {
    const v = singerV(q);
    const [p, e] = primePower(q)!;
    const us = units(v);
    if (!us.includes(t)) t = us.includes(2) ? 2 : us[1];
    const D = traceSet(q);
    const tD = multiplySet(D, t, v);
    const minus = multiplySet(D, -1, v);
    const j = translateOffset(D, tD, v);
    const jm = translateOffset(minus, tD, v);
    const powers = powersMod(p, v);
    const exponent = powers.indexOf(t);
    const groups = multiplierClasses(D, v);

    // Pair each class with its mirror image, in order of their smallest t.
    const order: number[] = [];
    for (let g = 0; g < groups.length; g++) {
      if (order.includes(g)) continue;
      order.push(g, groups[g].mirror);
    }
    const names = new Map<number, string>();
    order.forEach((g, n) => names.set(g, `${Math.floor(n / 2) + 1}${n % 2 ? '′' : ''}`));
    const mine = groups.findIndex((g) => g.ts.includes(t));

    controls.replaceChildren(
      selectControl(
        'q =',
        QS.map((x) => ({ value: String(x), label: String(x) })),
        String(q),
        (val) => {
          q = Number(val);
          render();
        },
        'me-q',
      ).wrap,
      selectControl(
        't =',
        us.map((x) => ({ value: String(x), label: String(x) })),
        String(t),
        (val) => {
          t = Number(val);
          render();
        },
        'me-t',
      ).wrap,
    );

    const pText = (x: number) => (x === 0 ? '1' : `${p}${superscript(x)}`);
    verdict.replaceChildren(
      h('p', {
        text: `D = ${setText(D)} mod ${v}, the trace set of Lesson 14. Multiply each member by ${t}: ${t}·D = ${setText(tD)}.`,
      }),
      h('p', {
        class: `ff-verdict me-result ${j !== null ? 'ok' : ''}`,
        text:
          j !== null
            ? `${t}·D = D + ${j}: a translate of D, so ${t} is a multiplier. ` +
              (exponent >= 0 ? `It is ${pText(exponent)} mod ${v}, a power of p = ${p}.` : '')
            : jm !== null
              ? `${t}·D is not a translate of D. It is −D + ${jm}, a translate of the mirror image −D = ${setText(minus)}.`
              : `${t}·D is not a translate of D or of its mirror image: it is a different difference set, in class ${names.get(mine)} below.`,
      }),
    );

    const fig = (set: readonly number[], caption: string) =>
      h('figure', {}, chordDiagram(set), h('figcaption', { text: caption }));
    figures.replaceChildren(fig(D, `D = ${setText(D)}`), fig(tD, `${t}·D = ${setText(tD)}`));

    const phi = totient(v);
    summary.textContent =
      `φ(${v}) = ${phi} choices of t share no factor with ${v}. The multipliers are the ${3 * e} powers of p = ${p}: ` +
      `${setText([...powers].sort((a, b) => a - b))}. So the ${phi} sets t·D fall into ${phi} / ${3 * e} = ${groups.length} ` +
      `classes up to translation, and ${groups.length / 2} up to translation and mirror images.`;

    classes.replaceChildren(
      h('p', { class: 'pg-list-head', text: 'Each class: the values of t, and the translate of t·D that contains 0 and 1' }),
      h(
        'ul',
        { class: 'me-class-list' },
        ...order.map((g) => {
          const c = groups[g];
          const li = h('li', { class: `me-class ${g === mine ? 'now' : ''}`.trim(), attrs: { 'data-class': names.get(g)! } });
          li.append(
            h('span', { class: 'me-name', text: `Class ${names.get(g)}` }),
            h(
              'span',
              { class: 'me-ts' },
              ...c.ts.map((x) => {
                const b = h('button', {
                  class: `me-t-chip ${x === t ? 'now' : ''}`.trim(),
                  text: String(x),
                  attrs: { type: 'button', 'aria-pressed': String(x === t), 'data-t': String(x) },
                });
                b.addEventListener('click', () => {
                  t = x;
                  render();
                });
                return b;
              }),
            ),
            h('span', { class: 'me-rep', text: setText(c.reduced) }),
          );
          return li;
        }),
      ),
    );

    const href = el.dataset.classesHref ?? '../../playgrounds/singer-classes/';
    more.replaceChildren(
      'Class n′ holds the mirror images of class n. One diagram per pair is drawn in the ',
      h('a', { text: 'Singer classes gallery', attrs: { href: `${href}?q=${q}` } }),
      '.',
    );
  };

  el.classList.add('widget', 'ff-widget', 'multiplier-explorer');
  el.replaceChildren(controls, verdict, figures, summary, classes, more);
  render();
}
