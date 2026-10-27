import { firstPrimitivePoly, isIrreducible, parsePoly, PolyRing } from '../math/field';
import { primeFactors } from '../math/numbers';
import { superscript } from '../math/poly';
import { arrowCircle } from '../viz/arrowCircle';
import { button, emitState, type FieldChoice, fieldPicker, h, opTable, readField, selectControl } from './ui';

const MAX = 256;
const MAX_CIRCLE = 64;

/**
 * `<div data-widget="powers" data-p="2" data-e="3" data-poly="1,1,0,1" data-g="0,1">`:
 * the powers g⁰, g¹, g², … of one element, drawn as a walk around the
 * nonzero elements and listed in a table, with its order, the fast
 * primitivity test, and (when g is primitive) a log table. `data-fixed`
 * hides the field picker.
 */
export function mount(el: HTMLElement): void {
  let field: FieldChoice = readField((n) => el.dataset[n], { p: 2, e: 3 }, MAX);
  if (!isIrreducible(field.poly, field.p)) field = { ...field, poly: firstPrimitivePoly(field.p, field.e) };
  let ring = new PolyRing(field.p, field.poly);
  let g = initialG(ring, el.dataset.g);
  let jumps = 0;
  let timer: number | undefined;
  let [ma, mb] = defaultFactors(ring);
  const fixed = el.hasAttribute('data-fixed');

  const stop = () => {
    if (timer !== undefined) clearInterval(timer);
    timer = undefined;
  };

  const picker = fixed
    ? null
    : fieldPicker(
        field,
        (f) => {
          field = f;
          ring = new PolyRing(f.p, f.poly);
          g = ring.x;
          reset();
          emitState(el, { p: String(f.p), e: String(f.e), poly: f.poly.join(','), g: ring.poly(g).join(',') });
        },
        { max: MAX, onlyIrreducible: true },
      );
  const controls = h('div', { class: 'controls' });
  const summary = h('p', { class: 'ff-verdict', attrs: { 'aria-live': 'polite' } });
  const figure = h('div', { class: 'ff-figure' });
  const walkStatus = h('p', { class: 'ff-status' });
  const test = h('div', { class: 'ff-info' });
  const powTable = h('div');
  const logs = h('div');
  const multiply = h('div', { class: 'ff-info' });

  const name = (a: number) => ring.label(a, 'poly', 'x', false);
  const short = (a: number) => (ring.size <= 9 ? ring.label(a, 'poly') : ring.label(a, 'digits'));

  const reset = () => {
    stop();
    jumps = 0;
    [ma, mb] = defaultFactors(ring);
    drawControls();
    render();
  };

  const drawControls = () => {
    const els = ring.elements().slice(1);
    controls.replaceChildren(
      selectControl(
        'element g =',
        els.map((a) => ({ value: String(a), label: name(a) })),
        String(g),
        (v) => {
          g = Number(v);
          stop();
          jumps = 0;
          emitState(el, { g: ring.poly(g).join(',') });
          render();
        },
        'pow-g',
      ).wrap,
      button('Multiply by g', () => {
        stop();
        step();
      }, 'pow-step'),
      button('Play', () => {
        stop();
        const ord = ring.order(g) ?? 1;
        if (jumps >= ord) jumps = 0;
        timer = window.setInterval(() => {
          step();
          if (jumps >= (ring.order(g) ?? 1)) stop();
        }, ring.size > 32 ? 150 : 500);
      }, 'pow-play'),
      button('Reset', () => {
        stop();
        jumps = 0;
        render();
      }, 'pow-reset'),
    );
  };

  const step = () => {
    if (jumps < (ring.order(g) ?? 0)) jumps++;
    render();
  };

  const render = () => {
    if (!ring.isField) {
      summary.textContent = 'Choose an irreducible modulus.';
      return;
    }
    const N = ring.size - 1;
    const ord = ring.order(g)!;
    const primitive = ord === N;
    const gName = name(g);
    summary.className = `ff-verdict ${primitive ? 'ok' : 'bad'}`;
    summary.textContent = primitive
      ? `g = ${gName} has order ${ord}: its powers visit all ${N} nonzero elements, so g is primitive.`
      : `g = ${gName} has order ${ord}: g${superscript(ord)} = 1 after only ${ord} of the ${N} nonzero elements, so g is not primitive.`;

    // The walk: nonzero elements around a circle in the order of powers of a fixed primitive element α.
    if (ring.size - 1 <= MAX_CIRCLE) {
      const alpha = ring.elements().find((a) => ring.isPrimitive(a))!;
      const alphaLog = ring.logTable(alpha);
      const powersOfG = ring.powers(g);
      const path = powersOfG.slice(0, jumps + 1);
      if (jumps === ord) path.push(ring.one);
      const arrows = path.slice(1).map((to, i) => ({
        from: alphaLog[path[i]],
        to: alphaLog[to],
        cls: i === path.length - 2 ? 'latest' : '',
      }));
      const here = path[path.length - 1];
      figure.replaceChildren(
        arrowCircle({
          labels: Array.from({ length: N }, (_, i) => short(ring.pow(alpha, i))),
          arrows,
          pointClass: (i) => {
            const a = ring.pow(alpha, i);
            return [a === here ? 'here' : '', path.includes(a) ? 'visited' : ''].join(' ').trim();
          },
          ariaLabel: `The ${N} nonzero elements of GF(${ring.size}) and the powers of ${gName}`,
          size: N > 40 ? 380 : 320,
        }),
      );
      walkStatus.textContent =
        `Around the circle: the nonzero elements in the order α⁰, α¹, α², … for α = ${name(alpha)}` +
        `${ring.size > 9 ? ' (labels are coefficient digits)' : ''}. ` +
        (jumps === 0
          ? `Start at 1 and multiply by g.`
          : jumps === ord
            ? `g${superscript(ord)} = 1: back to the start after ${ord} steps.`
            : `g${superscript(jumps)} = ${name(path[path.length - 1])}.`);
    } else {
      figure.replaceChildren();
      walkStatus.textContent = '';
    }

    // Fast primitivity test.
    const factors = primeFactors(N);
    test.replaceChildren(
      h('p', {
        text:
          `Fast test: ${primeFactors(N).length === 1 && primeFactors(N)[0] === N ? `${N} is prime` : `${N} = ${factorString(N)}`}. g is primitive exactly when g^(${N}/r) ≠ 1 for each prime r dividing ${N}:`,
      }),
      h(
        'ul',
        { class: 'ff-checks' },
        ...factors.map((r) => {
          const x = ring.pow(g, N / r);
          const ok = x !== ring.one;
          return h('li', { class: ok ? 'ok' : 'bad', text: `r = ${r}: g${superscript(N / r)} = ${name(x)} ${ok ? '≠ 1 ✓' : '= 1 ✗'}` });
        }),
      ),
    );

    // Table of powers.
    const pw = ring.powers(g);
    powTable.replaceChildren(
      opTable({
        caption: `Powers of g = ${gName}`,
        corner: 'i',
        rowHeads: ['gⁱ', 'digits'],
        colHeads: pw.map((_, i) => String(i)),
        cell: (r, c) => (r === 0 ? ring.label(pw[c], 'poly') : ring.label(pw[c], 'digits')),
        cellClass: (_, c) => (c === jumps && jumps < ord ? 'sel' : ''),
        cls: 'pow-table',
      }),
    );

    if (primitive) {
      const log = ring.logTable(g);
      const els = ring.elements().slice(1);
      logs.replaceChildren(
        opTable({
          caption: `Log table base g: log(a) = i means gⁱ = a`,
          corner: 'a',
          rowHeads: ['log a'],
          colHeads: els.map((a) => ring.label(a, 'poly')),
          cell: (_, c) => String(log[els[c]]),
          cls: 'log-table',
        }),
      );
      const choices = els.map((a) => ({ value: String(a), label: name(a) }));
      const prod = ring.mul(ma, mb);
      const sum = log[ma] + log[mb];
      multiply.replaceChildren(
        h(
          'div',
          { class: 'controls' },
          'Multiply with logs: ',
          selectControl('', choices, String(ma), (v) => {
            ma = Number(v);
            render();
          }, 'log-a').wrap,
          ' × ',
          selectControl('', choices, String(mb), (v) => {
            mb = Number(v);
            render();
          }, 'log-b').wrap,
        ),
        h('p', {
          class: 'log-result',
          text:
            `log ${log[ma]} + log ${log[mb]} = ${sum}${sum >= N ? ` ≡ ${sum % N} (mod ${N})` : ''}, ` +
            `and g${superscript(sum % N)} = ${name(prod)}. So (${name(ma)}) × (${name(mb)}) = ${name(prod)}.`,
        }),
      );
    } else {
      logs.replaceChildren(h('p', { class: 'ff-legend', text: 'Pick a primitive g to see a log table: the powers of a non-primitive element miss some elements.' }));
      multiply.replaceChildren();
    }
  };

  el.classList.add('widget', 'ff-widget');
  el.replaceChildren(...[picker, controls, summary, figure, walkStatus, powTable, test, logs, multiply].filter((x) => x !== null));
  drawControls();
  render();
}

function defaultFactors(ring: PolyRing): [number, number] {
  if (!ring.isField || ring.size < 4) return [ring.one, ring.one];
  return [ring.x === ring.one ? ring.one : ring.x, ring.pow(ring.x, Math.min(3, ring.size - 2))];
}

function initialG(ring: PolyRing, text: string | undefined): number {
  const poly = parsePoly(text ?? '') ?? (text && /^\d+$/.test(text) ? [Number(text)] : null);
  const g = poly ? ring.index(poly) : ring.x;
  return g === 0 ? ring.one : g;
}

function factorString(n: number): string {
  const parts: string[] = [];
  for (const r of primeFactors(n)) {
    let e = 0;
    while (n % r === 0) {
      n /= r;
      e++;
    }
    parts.push(e > 1 ? `${r}${superscript(e)}` : String(r));
  }
  return parts.join(' × ') || '1';
}
