// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { differenceCounts, differenceSetLambda } from '../../src/math/difference';
import {
  carHeats,
  fairestChart,
  fairness,
  heatLineup,
  opponentCounts,
  parseLineup,
  perfectCarCounts,
  possiblePerfectCounts,
  raceChart,
  sharedWithNext,
} from '../../src/math/race';
import { fairestRotation, rotationInWindow } from '../../src/math/raceSearch';
import { RACE_MAX_CARS, RACE_TABLE } from '../../src/math/raceTable';
import { mount } from '../../src/widgets/raceChart';

/** Every k-subset of 0 … N − 1 that contains 0. */
function* lineups(k: number, N: number, start = 1, prefix = [0]): Generator<number[]> {
  if (prefix.length === k) {
    yield prefix;
    return;
  }
  for (let x = start; x < N; x++) yield* lineups(k, N, x + 1, [...prefix, x]);
}

const window = (set: readonly number[], N: number) => {
  const c = differenceCounts(set, N).slice(1);
  return [Math.min(...c), Math.max(...c)];
};

describe('the rotation chart', () => {
  const D = [0, 1, 3, 9];
  const chart = raceChart(D, 13);

  it('puts car j + D[i] in lane i of heat j', () => {
    expect(chart).toHaveLength(13);
    expect(chart[0]).toEqual([0, 1, 3, 9]);
    expect(chart[12]).toEqual([12, 0, 2, 8]);
    expect(heatLineup(D, 6, 13)).toEqual([6, 7, 9, 2]);
  });

  it('runs every car once in each lane, for any lineup', () => {
    for (const set of [D, [0, 1, 2, 3], [5, 2, 11, 4]]) {
      const c = raceChart(set, 13);
      for (let lane = 0; lane < 4; lane++) {
        expect(new Set(c.map((h) => h[lane])).size).toBe(13);
      }
      for (let car = 0; car < 13; car++) {
        const heats = carHeats(set, car, 13);
        expect(heats.map((h) => h.lane).sort()).toEqual([0, 1, 2, 3]);
        for (const { heat, lane } of heats) expect(c[heat][lane]).toBe(car);
      }
    }
  });

  it('counts opponents as differences of the lineup', () => {
    for (const set of [D, [0, 1, 2, 3]]) {
      const c = raceChart(set, 13);
      for (let a = 0; a < 13; a++) {
        const direct = Array.from({ length: 13 }, (_, b) =>
          b === a ? 0 : c.filter((h) => h.includes(a) && h.includes(b)).length,
        );
        expect(opponentCounts(set, a, 13)).toEqual(direct);
      }
    }
    expect(opponentCounts(D, 2, 13)[7]).toBe(1);
  });

  it('a planar lineup makes every pair meet once and every two heats share one car', () => {
    expect(fairness(D, 13)).toEqual({ lo: 1, hi: 1, pairsByMeetings: [0, 78] });
    for (let j = 0; j < 12; j++) expect(sharedWithNext(D, j, 13)).toHaveLength(1);
    expect(sharedWithNext(D, 12, 13)).toEqual([]);
  });

  it('tallies pairs by how often they meet', () => {
    const f = fairness([0, 1, 2, 3], 13);
    expect(f.lo).toBe(0);
    expect(f.hi).toBe(3);
    expect(f.pairsByMeetings.reduce((a, b) => a + b, 0)).toBe(78);
    expect(f.pairsByMeetings.reduce((a, n, m) => a + n * m, 0)).toBe(13 * 6);
  });
});

describe('the fairest-rotation table', () => {
  it('covers 2–8 lanes and up to 60 cars, each entry checked', () => {
    expect(RACE_TABLE).toHaveLength(385);
    for (const e of RACE_TABLE) {
      expect(e.set).toHaveLength(e.lanes);
      expect(e.set[0]).toBe(0);
      expect(new Set(e.set).size).toBe(e.lanes);
      expect(window(e.set, e.cars)).toEqual([e.lo, e.hi]);
      // The window always contains the average number of meetings.
      const avg = (e.lanes * (e.lanes - 1)) / (e.cars - 1);
      expect(e.lo <= avg && avg <= e.hi).toBe(true);
    }
    expect(fairestChart(4, RACE_MAX_CARS)).toBeDefined();
    expect(fairestChart(9, 20)).toBeUndefined();
  });

  it('is optimal: brute force over every lineup agrees for small tracks', () => {
    for (let k = 2; k <= 4; k++) {
      for (let N = k + 1; N <= 22; N++) {
        let best = [0, Infinity];
        for (const set of lineups(k, N)) {
          const [lo, hi] = window(set, N);
          const [blo, bhi] = best;
          if (hi - lo < bhi - blo || (hi - lo === bhi - blo && hi < bhi)) best = [lo, hi];
        }
        const e = fairestChart(k, N)!;
        expect([e.lo, e.hi], `${k} lanes, ${N} cars`).toEqual(best);
      }
    }
  });

  it('matches the search it was generated from', () => {
    for (const [k, N] of [
      [4, 10],
      [5, 20],
      [6, 31],
    ]) {
      const e = fairestChart(k, N)!;
      expect(fairestRotation(k, N)).toEqual({ set: e.set, lo: e.lo, hi: e.hi });
    }
    expect(rotationInWindow(6, 16, 2, 2)).toBeNull();
  });

  it('has the perfect charts listed in Lesson 24', () => {
    const perfect: Record<number, number[]> = {
      2: [3],
      3: [4, 7],
      4: [5, 7, 13],
      5: [6, 11, 21],
      6: [7, 11, 31],
      7: [8, 15],
      8: [9, 15, 57],
    };
    const allowed: Record<number, number[]> = {
      2: [3],
      3: [4, 7],
      4: [5, 7, 13],
      5: [6, 11, 21],
      6: [7, 11, 16, 31],
      7: [8, 15, 22, 43],
      8: [9, 15, 29, 57],
    };
    for (let k = 2; k <= 8; k++) {
      expect(perfectCarCounts(k)).toEqual(perfect[k]);
      expect(possiblePerfectCounts(k, 60)).toEqual(allowed[k]);
      for (const N of perfect[k]) {
        expect(differenceSetLambda(fairestChart(k, N)!.set, N)).toBe((k * (k - 1)) / (N - 1));
      }
    }
  });

  it('has the same gaps as Pope and Young list for Partial Perfect-N charts', () => {
    const gaps = (k: number) => RACE_TABLE.filter((e) => e.lanes === k && e.hi - e.lo > 1).map((e) => e.cars);
    expect(gaps(4)).toEqual([]);
    expect(gaps(5)).toEqual([20, 22]);
    expect(gaps(6)).toEqual([16, 17, 29, 30, 32, 33, 34]);
  });

  it('gives the lineups quoted in the lesson', () => {
    expect(fairestChart(4, 10)).toMatchObject({ lo: 1, hi: 2, set: [0, 1, 2, 5] });
    expect(fairestChart(4, 20)).toMatchObject({ lo: 0, hi: 1, set: [0, 1, 3, 7] });
    // DerbyNet's 13-car generator (2, 4, 12) is 2 · {0, 1, 3, 9}.
    expect(differenceSetLambda([0, 2, 6, 5], 13)).toBe(1);
  });
});

describe('parseLineup', () => {
  it('reads lane-ordered car numbers', () => {
    expect(parseLineup('{0, 1, 3, 9}', 4, 13)).toEqual([0, 1, 3, 9]);
    expect(parseLineup('9 3 1 0', 4, 13)).toEqual([9, 3, 1, 0]);
  });
  it('rejects bad lineups', () => {
    expect(parseLineup('0, 1, 3', 4, 13)).toMatch(/4 lanes/);
    expect(parseLineup('0, 1, 1, 3', 4, 13)).toMatch(/one lane/);
    expect(parseLineup('0, 1, 3, 13', 4, 13)).toMatch(/0 to 12/);
    expect(parseLineup('0, 1, x, 3', 4, 13)).toMatch(/commas/);
  });
});

describe('race-chart widget', () => {
  const make = (lanes = 4, cars = 13) => {
    const el = document.createElement('div');
    el.dataset.lanes = String(lanes);
    el.dataset.cars = String(cars);
    document.body.append(el);
    mount(el);
    return el;
  };

  it('shows the 13-car chart, perfect, with car 0 selected', () => {
    const el = make();
    expect(el.querySelectorAll('.race-table tbody tr')).toHaveLength(13);
    expect(el.querySelectorAll('button.car')).toHaveLength(52);
    expect(el.querySelectorAll('button.car.selected')).toHaveLength(4);
    expect(el.querySelector('.verdict')?.className).toContain('ok');
    expect(el.querySelector('.verdict')?.textContent).toContain('(13, 4, 1) difference set');
    expect(el.querySelectorAll('.race-opponents .tally-cell')).toHaveLength(12);
    expect(el.querySelector('.race-next')?.textContent).toContain('In 12 of the 12 changes');
  });

  it('follows a clicked car and reports an unfair lineup', () => {
    const el = make();
    (el.querySelector('button.car[data-car="2"]') as HTMLButtonElement).click();
    expect(el.querySelector('.race-car')?.textContent).toMatch(/^Car 2 races in heat 1 \(lane 2\), heat 2 \(lane 1\), heat 6 \(lane 4\), and heat 12 \(lane 3\)/);
    const input = el.querySelector('.lineup-input') as HTMLInputElement;
    input.value = '0, 1, 2, 3';
    input.dispatchEvent(new Event('input'));
    const verdict = el.querySelector('.verdict')!;
    expect(verdict.className).toContain('bad');
    expect(verdict.textContent).toContain('never meet');
    expect(el.querySelectorAll('.race-opponents .tally-cell.missing').length).toBeGreaterThan(0);
    (el.querySelector('.fairest-button') as HTMLButtonElement).click();
    expect(el.querySelector('.verdict')?.className).toContain('ok');
  });

  it('loads the fairest chart for other lanes and cars', () => {
    const el = make();
    const cars = el.querySelector('.cars-select') as HTMLSelectElement;
    cars.value = '10';
    cars.dispatchEvent(new Event('change'));
    expect((el.querySelector('.lineup-input') as HTMLInputElement).value).toBe('{0, 1, 2, 5}');
    expect(el.querySelector('.verdict')?.textContent).toContain('once or twice');
    const lanes = el.querySelector('.lanes-select') as HTMLSelectElement;
    lanes.value = '6';
    lanes.dispatchEvent(new Event('change'));
    expect(el.querySelectorAll('.race-table thead th')).toHaveLength(8);
  });
});

/** The fewest heats, and the empty lanes, when `byes` of the chart's cars are phantoms, over every choice of byes. */
function bestByes(set: number[], v: number, byes: number) {
  const heats = raceChart(set, v);
  let best = { heats: Infinity, empty: 0 };
  const choose = function* (start: number, picked: number[]): Generator<number[]> {
    if (picked.length === byes) {
      yield picked;
      return;
    }
    for (let x = start; x < v; x++) yield* choose(x + 1, [...picked, x]);
  };
  for (const phantom of choose(0, [])) {
    const ghost = new Set(phantom);
    const used = heats.filter((h) => h.some((c) => !ghost.has(c))).length;
    if (used < best.heats) best = { heats: used, empty: used * set.length - (v - byes) * set.length };
  }
  return best;
}

describe('byes in a perfect chart (Lesson 24)', () => {
  it('keep every remaining pair meeting once and every car in each lane once', () => {
    const chart = raceChart([0, 1, 3, 9], 13).map((h) => h.map((c) => (c >= 10 ? null : c)));
    for (let a = 0; a < 10; a++) {
      for (let b = a + 1; b < 10; b++) {
        expect(chart.filter((h) => h.includes(a) && h.includes(b))).toHaveLength(1);
      }
      for (let lane = 0; lane < 4; lane++) expect(chart.filter((h) => h[lane] === a)).toHaveLength(1);
    }
  });

  it('cost the heats in the lesson table on 4 lanes', () => {
    const table: Record<number, [number, number]> = {
      12: [13, 8],
      11: [13, 15],
      10: [13, 23],
      9: [12, 25],
      8: [12, 33],
      6: [11, 45],
    };
    for (const [cars, [heats, pct]] of Object.entries(table)) {
      const best = bestByes([0, 1, 3, 9], 13, 13 - Number(cars));
      expect(best.heats).toBe(heats);
      expect(Math.round((100 * best.empty) / (best.heats * 4))).toBe(pct);
    }
  });

  it('cost one or two heats for 30 or 29 cars on 6 lanes, where no near-fair rotation exists', () => {
    const D = fairestChart(6, 31)!.set;
    expect(bestByes(D, 31, 1).heats).toBe(31);
    expect(bestByes(D, 31, 2).heats).toBe(31);
    expect(fairestChart(6, 29)).toMatchObject({ lo: 0, hi: 2 });
    expect(fairestChart(6, 30)).toMatchObject({ lo: 0, hi: 2 });
  });
});
