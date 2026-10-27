// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { differenceSetLambda } from '../../src/math/difference';
import { mulberry32 } from '../../src/math/random';
import {
  alwaysMeet,
  awakeSlots,
  failingRandomSchedule,
  missedOffsets,
  overlapByOffset,
  randomSchedule,
  SCHEDULE_PRESETS,
  sharedSlots,
} from '../../src/math/schedule';
import { singerSet, singerV } from '../../src/math/singer';
import { mount as mountWakeUp } from '../../src/widgets/wakeUp';

describe('wake-up schedules from Singer sets', () => {
  for (const q of [2, 3, 4, 5]) {
    const v = singerV(q);
    const D = singerSet(q);
    it(`q = ${q}: any two of ${v} offsets share exactly one awake slot`, () => {
      for (let i = 0; i < v; i++) {
        for (let j = 0; j < v; j++) {
          expect(sharedSlots(D, i, j, v)).toHaveLength(i === j ? q + 1 : 1);
        }
      }
      expect(alwaysMeet(D, v)).toBe(true);
    });
    it(`q = ${q}: awake fraction k/v is close to 1/√v`, () => {
      const frac = (q + 1) / v;
      expect(frac).toBeGreaterThan(1 / Math.sqrt(v));
      expect(frac).toBeLessThan(1.5 / Math.sqrt(v));
    });
  }

  it('presets are the planar sets from the lessons', () => {
    for (const p of SCHEDULE_PRESETS) expect(differenceSetLambda(p.set, p.v)).toBe(1);
  });

  it('shifts the awake slots by the clock offset', () => {
    expect(awakeSlots([0, 1, 3], 5, 7)).toEqual([1, 5, 6]);
    expect(awakeSlots([0, 1, 3], -1, 7)).toEqual([0, 2, 6]);
    expect(sharedSlots([0, 1, 3], 0, 2, 7)).toEqual([3]);
  });
});

describe('random schedules', () => {
  it('can leave two devices that never meet', () => {
    // {0, 1, 2}: offsets 3 and 4 apart never meet.
    expect(missedOffsets([0, 1, 2], 7)).toEqual([3, 4]);
    expect(alwaysMeet([0, 1, 2], 7)).toBe(false);
  });

  it('draws k distinct slots from a seed, reproducibly', () => {
    const a = randomSchedule(21, 5, mulberry32(7));
    expect(a).toHaveLength(5);
    expect(new Set(a).size).toBe(5);
    expect(randomSchedule(21, 5, mulberry32(7))).toEqual(a);
  });

  for (const { v, set } of SCHEDULE_PRESETS) {
    it(`finds a failing random schedule with ${set.length} of ${v} slots`, () => {
      const { set: bad, seed } = failingRandomSchedule(v, set.length, 1, mulberry32);
      expect(bad).toHaveLength(set.length);
      expect(alwaysMeet(bad, v)).toBe(false);
      expect(randomSchedule(v, set.length, mulberry32(seed))).toEqual(bad);
      expect(Math.min(...overlapByOffset(bad, v))).toBe(0);
    });
  }
});

describe('wake-up widget', () => {
  it('mounts, draws three rows, and reports a meeting for every pair', () => {
    const el = document.createElement('div');
    el.dataset.v = '13';
    document.body.append(el);
    mountWakeUp(el);
    expect(el.querySelectorAll('.wake-timeline .slot')).toHaveLength(3 * 13);
    expect(el.querySelectorAll('.wake-pairs li')).toHaveLength(3);
    expect(el.querySelectorAll('.wake-pairs li.miss')).toHaveLength(0);
    expect(el.querySelector('.verdict')?.className).toContain('ok');
    el.querySelector<HTMLButtonElement>('.schedule-random')!.click();
    expect(el.querySelector('.verdict')?.className).toContain('bad');
    el.querySelector<HTMLButtonElement>('.miss-button')!.click();
    expect(el.querySelectorAll('.wake-pairs li.miss').length).toBeGreaterThan(0);
  });
});
