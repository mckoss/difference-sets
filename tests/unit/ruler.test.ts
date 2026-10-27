// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import {
  bestCut,
  gaps,
  isGolomb,
  isModularGolomb,
  isPerfectModularRuler,
  linearDistanceCounts,
  minModulus,
  modularDistanceCounts,
  rulerLength,
  unwind,
} from '../../src/math/ruler';
import { singerSet, singerV } from '../../src/math/singer';
import { mount as mountRuler } from '../../src/widgets/golombRuler';

describe('modular Golomb rulers', () => {
  for (const q of [2, 3, 4, 5, 7, 8, 9]) {
    const v = singerV(q);
    const D = singerSet(q);
    it(`the Singer set for q = ${q} has every distance 1 … ${v - 1} exactly once`, () => {
      expect(isPerfectModularRuler(D, v)).toBe(true);
      expect(isModularGolomb(D, v)).toBe(true);
      expect(v).toBe(minModulus(D.length));
    });

    it(`q = ${q}: every cut unwinds to a straight Golomb ruler, the longest gap to the shortest`, () => {
      const lengths = gaps(D, v).map((g) => {
        const marks = unwind(D, v, g.from);
        expect(marks[0]).toBe(0);
        expect(isGolomb(marks)).toBe(true);
        expect(rulerLength(marks)).toBe(v - g.length);
        return rulerLength(marks);
      });
      const best = bestCut(D, v);
      expect(rulerLength(unwind(D, v, best.from))).toBe(Math.min(...lengths));
    });
  }

  it('counts distances both ways round the circle', () => {
    const c = modularDistanceCounts([0, 1, 3, 9], 13);
    expect(c.slice(1)).toEqual(new Array(12).fill(1));
    expect(isModularGolomb([0, 1, 2], 7)).toBe(false);
    expect(isPerfectModularRuler([0, 1, 4], 13)).toBe(false);
    expect(isModularGolomb([0, 1, 4], 13)).toBe(true);
  });

  it('unwinds {0, 1, 3, 9} mod 13 at its longest gap to {0, 4, 5, 7}', () => {
    expect(gaps([0, 1, 3, 9], 13).map((g) => g.length)).toEqual([1, 2, 6, 4]);
    expect(bestCut([0, 1, 3, 9], 13)).toEqual({ from: 3, to: 9, length: 6 });
    const marks = unwind([0, 1, 3, 9], 13, 3);
    expect(marks).toEqual([0, 4, 5, 7]);
    expect(linearDistanceCounts(marks)).toEqual([0, 1, 1, 1, 1, 1, 0, 1]);
  });

  it('unwinds {0, 1, 4, 14, 16} mod 21 to {0, 2, 7, 8, 11}, missing only 10', () => {
    const marks = unwind([0, 1, 4, 14, 16], 21, bestCut([0, 1, 4, 14, 16], 21).from);
    expect(marks).toEqual([0, 2, 7, 8, 11]);
    const missing = linearDistanceCounts(marks).flatMap((c, d) => (d > 0 && c === 0 ? [d] : []));
    expect(missing).toEqual([10]);
  });

  it('spots repeats on a straight ruler', () => {
    expect(isGolomb([0, 1, 2])).toBe(false);
    expect(isGolomb([0, 1, 4, 6])).toBe(true);
  });
});

describe('golomb-ruler widget', () => {
  it('measures two marks both ways and unwinds', () => {
    const el = document.createElement('div');
    el.dataset.v = '13';
    document.body.append(el);
    mountRuler(el);
    expect(el.querySelectorAll('.tally-cell.once')).toHaveLength(12);
    el.querySelector<SVGGElement>('[data-mark="1"]')!.dispatchEvent(new Event('click', { bubbles: true }));
    el.querySelector<SVGGElement>('[data-mark="9"]')!.dispatchEvent(new Event('click', { bubbles: true }));
    expect(el.querySelector('.ruler-info')?.textContent).toContain('From 1 to 9 is 8 steps clockwise, and 5 the other way');
    expect(el.querySelectorAll('.arc')).toHaveLength(2);
    el.querySelector<HTMLButtonElement>('.view-unwind')!.click();
    expect(el.querySelectorAll('.antenna')).toHaveLength(4);
    expect(el.querySelector('.ruler-info')?.textContent).toContain('These two antennas are 5 apart');
    expect(el.querySelector('.table-note')?.textContent).toContain('spacing 6 is missing');
  });
});
