// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import {
  agreements,
  BENT_PRESETS,
  bestAffineRule,
  bits,
  fromSupport,
  isBent,
  nonlinearity,
  ruleName,
  support,
  walsh,
  xorDifferenceCounts,
  xorDifferenceSetLambda,
} from '../../src/math/bent';
import { mount as mountBent } from '../../src/widgets/bentFunction';

const preset = (id: string) => BENT_PRESETS.find((p) => p.id === id)!.f;

describe('bent functions on 4 bits', () => {
  const f = preset('x1x2+x3x4');

  it('x1x2 ⊕ x3x4 has a support of 6 inputs that is a (16, 6, 2) difference set under XOR', () => {
    const D = support(f);
    expect(D.map((x) => bits(x, 4))).toEqual(['0011', '0111', '1011', '1100', '1101', '1110']);
    expect(xorDifferenceSetLambda(D, 4)).toBe(2);
    expect(xorDifferenceCounts(D, 4).slice(1)).toEqual(new Array(15).fill(2));
  });

  it('has every Walsh value ±4, agreements 6 or 10, and nonlinearity 6', () => {
    expect(walsh(f).every((w) => Math.abs(w) === 4)).toBe(true);
    expect(agreements(f).every((m) => m === 6 || m === 10)).toBe(true);
    expect(nonlinearity(f)).toBe(6);
    expect(isBent(f)).toBe(true);
  });

  it('the other bent preset has 10 ones and is a (16, 10, 6) difference set', () => {
    const g = preset('x1x4+x2x3+1');
    expect(isBent(g)).toBe(true);
    expect(support(g)).toHaveLength(10);
    expect(xorDifferenceSetLambda(support(g), 4)).toBe(6);
  });

  it('a linear rule matches itself everywhere and is far from bent', () => {
    const g = preset('x1+x3');
    expect(isBent(g)).toBe(false);
    expect(nonlinearity(g)).toBe(0);
    expect(bestAffineRule(g)).toMatchObject({ a: 0b1010, flipped: false, matches: 16, name: 'x1 ⊕ x3' });
    expect(xorDifferenceSetLambda(support(g), 4)).toBeNull();
  });

  it('the majority-like function is not bent', () => {
    const g = preset('majority');
    expect(support(g)).toHaveLength(5);
    expect(isBent(g)).toBe(false);
    expect(bestAffineRule(g)).toMatchObject({ a: 0, matches: 11, name: '0' });
  });

  it('names rules with x1 as the leftmost bit', () => {
    expect(ruleName(0, 4)).toBe('0');
    expect(ruleName(0b1000, 4)).toBe('x1');
    expect(ruleName(0b0101, 4)).toBe('x2 ⊕ x4');
    expect(bestAffineRule(fromSupport([0, 1, 2, 3, 4, 5, 6, 7], 4)).name).toBe('x1 ⊕ 1');
  });

  it('over all 2^16 functions: bent ⇔ nontrivial XOR difference set, and there are 896 bent functions', () => {
    let bent = 0;
    const sizes = new Set<number>();
    for (let t = 0; t < 1 << 16; t++) {
      const D: number[] = [];
      for (let x = 0; x < 16; x++) if ((t >> x) & 1) D.push(x);
      const g = fromSupport(D, 4);
      const lambda = xorDifferenceSetLambda(D, 4);
      const ds = lambda !== null && D.length >= 2 && D.length <= 14;
      const b = isBent(g);
      expect(b).toBe(ds);
      if (b) {
        bent++;
        sizes.add(D.length);
        expect(nonlinearity(g)).toBe(6);
      } else {
        expect(nonlinearity(g)).toBeLessThan(6);
      }
    }
    expect(bent).toBe(896);
    expect([...sizes].sort((a, b) => a - b)).toEqual([6, 10]);
  });
});

describe('bent-function widget', () => {
  it('mounts on a bent function, toggles inputs, and switches presets', () => {
    const el = document.createElement('div');
    document.body.append(el);
    mountBent(el);
    expect(el.querySelectorAll('.bent-cell')).toHaveLength(16);
    expect(el.querySelectorAll('.bent-cell.on')).toHaveLength(6);
    expect(el.querySelectorAll('.xor-overlap .overlap')).toHaveLength(15);
    expect(el.querySelectorAll('.rule-list li')).toHaveLength(16);
    expect(el.querySelectorAll('.rule-list li.close')).toHaveLength(0);
    expect(el.querySelector('.verdict')?.className).toContain('ok');
    expect(el.querySelector('.overlap-note')?.textContent).toContain('(16, 6, 2) difference set');

    el.querySelector<HTMLButtonElement>('[data-x="0"]')!.click();
    expect(el.querySelectorAll('.bent-cell.on')).toHaveLength(7);
    expect(el.querySelector<HTMLSelectElement>('.preset-select')!.value).toBe('custom');
    expect(el.querySelector('.verdict')?.className).toContain('bad');

    const sel = el.querySelector<HTMLSelectElement>('.preset-select')!;
    sel.value = 'x1+x3';
    sel.dispatchEvent(new Event('change'));
    expect(el.querySelector('.verdict')?.textContent).toBe(
      'Rule x1 ⊕ x3 matches f on 16 of 16 inputs — a linear attack would use it.',
    );
    el.querySelector<HTMLButtonElement>('.random-button')!.click();
    expect(el.querySelectorAll('.rule-list li')).toHaveLength(16);
  });
});
