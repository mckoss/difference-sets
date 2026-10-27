import { gcd } from '../math/numbers';
import { arrowCircle } from '../viz/arrowCircle';
import { button, h, selectControl } from './ui';

/**
 * `<div data-widget="zn-clock" data-v="7" data-a="3">`: multiplication mod n
 * as repeated jumps. Starting at 0, each step jumps a hours around an n-hour
 * clock, so after b jumps the hand points at a × b mod n. Landing on 1 means
 * b is the inverse of a; landing back on 0 early means a is a zero divisor.
 */
export function mount(el: HTMLElement): void {
  let n = clamp(Number(el.dataset.v ?? el.dataset.n ?? 7), 2, 24, 7);
  let a = clamp(Number(el.dataset.a ?? 3), 1, n - 1, 1);
  let jumps = 0;
  let timer: number | undefined;

  const controls = h('div', { class: 'controls' });
  const picture = h('div', { class: 'ff-figure' });
  const status = h('p', { class: 'ff-status', attrs: { 'aria-live': 'polite' } });
  const trail = h('p', { class: 'ff-trail' });

  const stop = () => {
    if (timer !== undefined) clearInterval(timer);
    timer = undefined;
  };

  const drawControls = () => {
    controls.replaceChildren(
      selectControl(
        'v =',
        Array.from({ length: 23 }, (_, i) => ({ value: String(i + 2), label: String(i + 2) })),
        String(n),
        (v) => {
          n = Number(v);
          a = Math.min(a, n - 1);
          reset();
        },
        'clock-n',
      ).wrap,
      selectControl(
        'jump by a =',
        Array.from({ length: n - 1 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) })),
        String(a),
        (v) => {
          a = Number(v);
          reset();
        },
        'clock-a',
      ).wrap,
      button('Jump', () => {
        stop();
        step();
      }, 'clock-step'),
      button('Play', () => {
        stop();
        if (jumps >= n) jumps = 0;
        timer = window.setInterval(() => {
          step();
          if (jumps >= n) stop();
        }, 600);
      }, 'clock-play'),
      button('Reset', () => reset(), 'clock-reset'),
    );
  };

  const reset = () => {
    stop();
    jumps = 0;
    drawControls();
    render();
  };

  const step = () => {
    if (jumps < n) jumps++;
    render();
  };

  const render = () => {
    const visited = Array.from({ length: jumps + 1 }, (_, b) => (a * b) % n);
    const here = visited[jumps];
    const arrows = visited.slice(1).map((to, i) => ({ from: visited[i], to, cls: i === jumps - 1 ? 'latest' : '' }));
    picture.replaceChildren(
      arrowCircle({
        labels: Array.from({ length: n }, (_, i) => String(i)),
        arrows,
        pointClass: (i) =>
          [i === here ? 'here' : '', visited.includes(i) ? 'visited' : '', i === 1 && visited.slice(1).includes(1) ? 'hit-one' : '']
            .join(' ')
            .trim(),
        ariaLabel: `Clock with ${n} hours, ${jumps} jumps of ${a}`,
        size: 300,
      }),
    );
    trail.textContent = `Hand positions: ${visited.join(' → ')}`;
    if (jumps === 0) {
      status.textContent = `Start at 0. Each jump adds ${a}, so after b jumps the hand shows ${a} × b mod ${n}.`;
      return;
    }
    let msg = `${a} × ${jumps} = ${a * jumps} ≡ ${here} (mod ${n}).`;
    if (here === 1) msg += ` Landed on 1, so ${jumps} is the inverse of ${a}.`;
    else if (here === 0 && jumps < n)
      msg += ` Back at 0 after only ${jumps} jumps: ${a} × ${jumps} = 0 with neither factor 0, so ${a} is a zero divisor and never reaches 1.`;
    else if (here === 0) {
      const hit = new Set(visited).size;
      msg +=
        hit === n
          ? ` Back to 0 after all ${n} jumps, having visited every hour: row ${a} of the table is a permutation.`
          : ` The hand visited only ${hit} of ${n} hours (gcd(${a}, ${n}) = ${gcd(a, n)}).`;
    }
    status.textContent = msg;
  };

  el.classList.add('widget', 'ff-widget');
  el.replaceChildren(controls, picture, status, trail);
  drawControls();
  render();
}

function clamp(x: number, lo: number, hi: number, fallback: number): number {
  return Number.isInteger(x) && x >= lo && x <= hi ? x : fallback;
}
