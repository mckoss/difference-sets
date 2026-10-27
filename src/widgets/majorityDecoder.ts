import { checksThrough, codeBasis, codeParams, encode, isCodeword, lines, majorityDecode, syndrome, votes } from '../math/codes';
import { mulberry32, randomInt, type Rng } from '../math/random';
import { svgEl } from '../viz/circleSet';
import { setText } from './format';

interface Plane {
  order: number;
  v: number;
  set: number[];
}

const PLANES: Plane[] = [
  { order: 2, v: 7, set: [0, 1, 3] },
  { order: 4, v: 21, set: [0, 1, 4, 14, 16] },
];

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

function listText(items: readonly number[]): string {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

/**
 * `<div data-widget="majority-decoder" data-q="4" data-errors="2,9">`: a
 * codeword of the difference-set code on a circle of bits. Click a bit to flip
 * it; the panel shows the n + 1 checks (lines) through the chosen bit and how
 * they vote. "Vote and fix" applies the majority vote to every bit at once.
 */
export function mount(el: HTMLElement): void {
  let plane = PLANES.find((p) => p.order === Number(el.dataset.q ?? 4)) ?? PLANES[1];
  const rng: Rng = mulberry32(Number(el.dataset.seed ?? 3));
  let basis = codeBasis(plane.set, plane.v);
  let sent: number[] = [];
  let word: number[] = [];
  let inspect = 0;
  let fixed: number[] = [];
  let result: { text: string; ok: boolean } | null = null;

  const newCodeword = () => {
    do {
      sent = encode(
        basis.map(() => randomInt(rng, 2)),
        basis,
      );
    } while (sent.every((b) => b === 0));
    word = [...sent];
    fixed = [];
    result = null;
  };
  newCodeword();
  for (const s of (el.dataset.errors ?? '').split(',')) {
    const i = Number(s);
    if (s.trim() !== '' && Number.isInteger(i) && i >= 0 && i < plane.v) word[i] ^= 1;
  }

  // Controls.
  const controls = document.createElement('div');
  controls.className = 'controls';
  const planeLabel = document.createElement('label');
  planeLabel.className = 'control';
  const planeSelect = document.createElement('select');
  planeSelect.className = 'plane-select';
  planeSelect.setAttribute('aria-label', 'Which plane');
  for (const p of PLANES) planeSelect.append(new Option(`Order ${p.order}: ${p.v} bits`, String(p.order)));
  planeSelect.value = String(plane.order);
  planeLabel.append(planeSelect);
  const button = (text: string, cls: string) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = cls;
    b.textContent = text;
    return b;
  };
  const decodeButton = button('Vote and fix', 'decode-button');
  const resetButton = button('Undo errors', 'reset-button');
  const newButton = button('New codeword', 'new-button');
  controls.append(planeLabel, decodeButton, resetButton, newButton);

  const hint = document.createElement('p');
  hint.className = 'hint';
  hint.textContent = 'Click a bit to flip it (or focus it and press Enter). The checks through the last bit you touched are drawn on the circle.';

  // Layout.
  const body = document.createElement('div');
  body.className = 'workbench-body';
  const circleBox = document.createElement('div');
  circleBox.className = 'circle-box';
  const side = document.createElement('div');
  side.className = 'workbench-side';
  const status = document.createElement('p');
  status.className = 'error-status verdict';
  const inspectLabel = document.createElement('label');
  inspectLabel.className = 'control range';
  const inspectRange = document.createElement('input');
  inspectRange.type = 'range';
  inspectRange.className = 'inspect-range';
  inspectRange.min = '0';
  const inspectOut = document.createElement('output');
  inspectLabel.append('Look at bit ', inspectRange, inspectOut);
  const checkHead = document.createElement('p');
  checkHead.className = 'check-head';
  const checkList = document.createElement('ul');
  checkList.className = 'check-list';
  const voteLine = document.createElement('p');
  voteLine.className = 'vote-line';
  const resultLine = document.createElement('p');
  resultLine.className = 'decode-result';
  resultLine.setAttribute('aria-live', 'polite');
  side.append(status, inspectLabel, checkHead, checkList, voteLine, resultLine);
  body.append(circleBox, side);

  const strips = document.createElement('div');
  strips.className = 'bit-strips';

  const drawCircle = (fails: number[]) => {
    const { v, set } = plane;
    const R = v > 10 ? 104 : 78;
    const pad = 34;
    const size = 2 * (R + pad);
    const c = size / 2;
    const at = (i: number, radius = R): [number, number] => {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / v;
      return [c + radius * Math.cos(a), c + radius * Math.sin(a)];
    };
    const svg = svgEl('svg', { viewBox: `0 0 ${size} ${size}`, class: 'code-circle', role: 'group' });
    svg.setAttribute('aria-label', `The ${v} bits of the word, around a circle`);
    svg.append(svgEl('circle', { cx: c, cy: c, r: R, class: 'rim' }));
    const ls = lines(set, v);
    for (const t of checksThrough(inspect, set, v)) {
      const pts = ls[t].map((i) => at(i).join(',')).join(' ');
      svg.append(
        svgEl('polygon', { points: pts, class: `check ${fails[t] ? 'fail' : 'pass'}`, 'data-check': t }),
      );
    }
    const cell = v > 10 ? 12 : 15;
    for (let i = 0; i < v; i++) {
      const [x, y] = at(i);
      const [lx, ly] = at(i, R + cell + 10);
      const cls = [
        'bit',
        word[i] ? 'one' : 'zero',
        word[i] !== sent[i] && 'err',
        fixed.includes(i) && 'fixed',
        i === inspect && 'inspect',
      ]
        .filter(Boolean)
        .join(' ');
      const g = svgEl('g', { class: cls, 'data-bit': i, tabindex: 0, role: 'button' });
      g.setAttribute(
        'aria-label',
        `Bit ${i} is ${word[i]}${word[i] !== sent[i] ? ', an error' : ''}. Press to flip it.`,
      );
      g.append(svgEl('circle', { cx: x, cy: y, r: cell + 5, class: 'ring' }));
      g.append(svgEl('circle', { cx: x, cy: y, r: cell, class: 'cell' }));
      g.append(svgEl('text', { x, y: y + 4.5, class: 'bit-value' }, String(word[i])));
      g.append(svgEl('text', { x: lx, y: ly + 3.5, class: 'bit-index' }, String(i)));
      svg.append(g);
    }
    return svg;
  };

  const strip = (label: string, bits: readonly number[], mark: boolean) => {
    const row = document.createElement('p');
    row.className = 'bit-strip';
    const name = document.createElement('span');
    name.className = 'strip-label';
    name.textContent = label;
    const code = document.createElement('code');
    bits.forEach((b, i) => {
      const s = document.createElement('span');
      s.textContent = String(b);
      if (mark && b !== sent[i]) s.className = 'err';
      code.append(s);
    });
    row.append(name, code);
    return row;
  };

  const render = () => {
    const { v, set } = plane;
    const params = codeParams(set, v);
    const fails = syndrome(word, set, v);
    const vs = votes(word, set, v)[inspect];
    const errors = word.flatMap((b, i) => (b !== sent[i] ? [i] : []));

    circleBox.replaceChildren(drawCircle(fails));
    strips.replaceChildren(strip('Sent', sent, false), strip('Now', word, true));

    status.textContent =
      errors.length === 0
        ? `No errors: this is the codeword that was sent, and all ${v} checks pass. The vote can fix up to ${params.corrects}.`
        : `${plural(errors.length, 'bit')} differ from what was sent (${listText(errors)}). ` +
          (errors.length <= params.corrects
            ? `The vote is guaranteed to fix up to ${params.corrects}.`
            : `That is more than the ${params.corrects} the vote is guaranteed to fix.`);
    status.classList.toggle('ok', errors.length <= params.corrects);
    status.classList.toggle('bad', errors.length > params.corrects);

    inspectRange.max = String(v - 1);
    inspectRange.value = String(inspect);
    inspectOut.textContent = String(inspect);
    checkHead.textContent = `Bit ${inspect} is ${word[inspect]}. It lies on ${set.length} lines, the checks that vote on it:`;
    checkList.replaceChildren(
      ...vs.checks.map((t) => {
        const li = document.createElement('li');
        const line = lines(set, v)[t];
        const ones = line.filter((i) => word[i]).length;
        li.className = fails[t] ? 'fail' : 'pass';
        li.dataset.check = String(t);
        li.textContent = `D + ${t} = ${setText(line)}: ${plural(ones, 'one')}, ${fails[t] ? 'odd, fails' : 'even, passes'}`;
        return li;
      }),
    );
    voteLine.textContent =
      `${vs.failing} of ${vs.checks.length} fail. ` +
      (vs.flip ? `That is more than half, so the vote flips bit ${inspect}.` : `That is not more than half, so the vote keeps bit ${inspect}.`);
    voteLine.classList.toggle('flip', vs.flip);

    resultLine.textContent = result?.text ?? '';
    resultLine.hidden = !result;
    resultLine.className = `decode-result verdict ${result ? (result.ok ? 'ok' : 'bad') : ''}`;
  };

  const flip = (i: number) => {
    word[i] ^= 1;
    inspect = i;
    fixed = [];
    result = null;
    render();
    circleBox.querySelector<SVGGElement>(`[data-bit="${i}"]`)?.focus();
  };

  circleBox.addEventListener('click', (e) => {
    const g = (e.target as Element).closest<SVGGElement>('.bit');
    if (g) flip(Number(g.dataset.bit));
  });
  circleBox.addEventListener('keydown', (e) => {
    const g = (e.target as Element).closest<SVGGElement>('.bit');
    if (!g || (e.key !== 'Enter' && e.key !== ' ')) return;
    e.preventDefault();
    flip(Number(g.dataset.bit));
  });
  inspectRange.addEventListener('input', () => {
    inspect = Number(inspectRange.value);
    render();
  });
  decodeButton.addEventListener('click', () => {
    const { set, v } = plane;
    const before = word.flatMap((b, i) => (b !== sent[i] ? [i] : []));
    const out = majorityDecode(word, set, v);
    word = out.word;
    fixed = out.flipped;
    const same = word.every((b, i) => b === sent[i]);
    if (out.flipped.length === 0) {
      result = same
        ? { text: 'Nothing to fix: every bit kept its value.', ok: true }
        : { text: 'No bit had a majority against it, so nothing changed, and the errors remain.', ok: false };
    } else if (same) {
      result = {
        text: `The vote flipped ${out.flipped.length === 1 ? 'bit' : 'bits'} ${listText(out.flipped)} and recovered the codeword that was sent.`,
        ok: true,
      };
    } else {
      const landed = isCodeword(word, set, v) ? 'It landed on a different codeword' : 'Some checks still fail';
      result = {
        text: `With ${plural(before.length, 'error')} the vote flipped ${listText(out.flipped)}, and got it wrong. ${landed}: too many errors for this code.`,
        ok: false,
      };
    }
    render();
  });
  resetButton.addEventListener('click', () => {
    word = [...sent];
    fixed = [];
    result = null;
    render();
  });
  newButton.addEventListener('click', () => {
    newCodeword();
    render();
  });
  planeSelect.addEventListener('change', () => {
    plane = PLANES.find((p) => p.order === Number(planeSelect.value)) ?? PLANES[1];
    basis = codeBasis(plane.set, plane.v);
    inspect = Math.min(inspect, plane.v - 1);
    newCodeword();
    render();
  });

  el.classList.add('widget', 'majority-decoder');
  el.replaceChildren(controls, hint, body, strips);
  render();
}
