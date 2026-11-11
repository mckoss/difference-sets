// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { differenceSetLambda } from '../../src/math/difference';
import {
  bits,
  classicLayout,
  declusteredLayout,
  evenForEveryFailure,
  type Layout,
  RAID_PRESETS,
  randomLayout,
  rebuildReads,
  rebuildSummary,
  recoverChunk,
  stripeChunks,
  stripesOnDisk,
  unevenRandomLayout,
  xorAll,
} from '../../src/math/raid';
import { mulberry32 } from '../../src/math/random';
import { singerSet, singerV } from '../../src/math/singer';
import { mount as mountRaid } from '../../src/widgets/raidRebuild';

/** Every disk holds `width` chunks and no stripe uses a disk twice. */
function expectWellFormed(L: Layout) {
  for (const s of L.stripes) {
    expect(new Set(s.disks).size).toBe(L.width);
    expect(s.disks).toContain(s.parity);
  }
}

describe('declustered layouts from planar difference sets', () => {
  for (const q of [2, 3, 4]) {
    const v = singerV(q);
    const L = declusteredLayout(singerSet(q), v);
    it(`q = ${q}: every survivor of ${v} disks reads exactly 1 chunk, whichever disk fails`, () => {
      expectWellFormed(L);
      for (let f = 0; f < v; f++) {
        const s = rebuildSummary(L, f);
        expect(s.lost).toHaveLength(q + 1);
        expect(s.reads.filter((_, d) => d !== f)).toEqual(new Array(v - 1).fill(1));
        expect(s.total).toBe(v - 1);
        expect(s.busiest).toBe(1);
        expect(s.even).toBe(true);
        expect(s.idle).toEqual([]);
      }
      expect(evenForEveryFailure(L)).toBe(true);
    });
    it(`q = ${q}: each disk holds ${q + 1} chunks, one of them parity`, () => {
      for (let d = 0; d < v; d++) {
        expect(stripesOnDisk(L, d)).toHaveLength(q + 1);
        expect(L.stripes.filter((s) => s.parity === d)).toHaveLength(1);
      }
    });
  }

  it('presets are the planar sets from the lessons', () => {
    for (const p of RAID_PRESETS) {
      expect(differenceSetLambda(p.set, p.v)).toBe(1);
      expect(singerV(p.q)).toBe(p.v);
    }
  });

  it('puts stripe j on D + j', () => {
    const L = declusteredLayout([0, 1, 3], 7);
    expect(L.stripes[0].disks).toEqual([0, 1, 3]);
    expect(L.stripes[5].disks).toEqual([5, 6, 1]);
    expect(stripesOnDisk(L, 0)).toEqual([0, 4, 6]);
  });

  it('a (7, 4, 2) set gives every survivor 2 reads', () => {
    const L = declusteredLayout([2, 4, 5, 6], 7);
    expect(rebuildReads(L, 3).filter((_, d) => d !== 3)).toEqual([2, 2, 2, 2, 2, 2]);
  });

  it('matches the Lesson 28 exercise: disk 5 of 13', () => {
    const L = declusteredLayout([0, 1, 3, 9], 13);
    expect(rebuildSummary(L, 5).lost).toEqual([2, 4, 5, 9]);
  });
});

describe('comparison layouts are uneven', () => {
  for (const { v, set } of RAID_PRESETS) {
    const k = set.length;
    it(`classic RAID-5 on ${v} disks: group partners read ${k}, the rest read nothing`, () => {
      const L = classicLayout(v, k);
      expectWellFormed(L);
      expect(L.stripes).toHaveLength(v - 1);
      const s = rebuildSummary(L, 0);
      expect(s.busiest).toBe(k);
      expect(s.fewest).toBe(0);
      expect(s.even).toBe(false);
      expect(s.idle).toHaveLength(v - k);
      expect(s.total).toBe(k * (k - 1));
      // The spare disk holds nothing.
      expect(stripesOnDisk(L, v - 1)).toEqual([]);
      expect(evenForEveryFailure(L)).toBe(false);
    });

    it(`random layout on ${v} disks: same shape, uneven rebuild`, () => {
      const L = unevenRandomLayout(v, k, 1, mulberry32);
      expectWellFormed(L);
      expect(L.stripes).toHaveLength(v);
      for (let d = 0; d < v; d++) expect(stripesOnDisk(L, d)).toHaveLength(k);
      const s = rebuildSummary(L, 0);
      expect(s.fewest).toBe(0);
      expect(s.busiest).toBeGreaterThanOrEqual(2);
      expect(s.total).toBe(k * (k - 1));
      expect(randomLayout(v, k, mulberry32(L.seed!)).stripes).toEqual(L.stripes);
    });
  }
});

describe('XOR parity', () => {
  it('rebuilds any lost chunk from the others', () => {
    const L = declusteredLayout([0, 1, 4, 14, 16], 21);
    L.stripes.forEach((stripe, j) => {
      const values = stripeChunks(stripe, j);
      expect(xorAll(values)).toBe(0);
      values.forEach((x, lost) => expect(recoverChunk(values, lost)).toBe(x));
    });
  });

  it('matches the worked example in the lesson', () => {
    const a = 0b10110010;
    const b = 0b01100111;
    expect(bits(a ^ b)).toBe('11010101');
    expect(recoverChunk([a, b, a ^ b], 0)).toBe(a);
  });
});

describe('raid-rebuild widget', () => {
  it('fails a disk, shows even bars, and compares layouts', () => {
    const el = document.createElement('div');
    el.dataset.v = '7';
    document.body.append(el);
    mountRaid(el);
    expect(el.querySelectorAll('.raid-figure .disk')).toHaveLength(7);
    expect(el.querySelectorAll('.raid-figure .chunk-g')).toHaveLength(21);
    expect(el.querySelectorAll('.raid-figure .bar')).toHaveLength(0);

    el.querySelector<SVGGElement>('[data-disk="0"]')!.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    const reads = () => [...el.querySelectorAll('.raid-figure .bar')].map((b) => Number(b.getAttribute('data-reads')));
    expect(reads()).toEqual([1, 1, 1, 1, 1, 1]);
    expect(el.querySelector('.verdict')?.className).toContain('ok');
    expect(el.querySelector('.verdict')?.textContent).toContain('Every survivor reads 1 chunk. Rebuild takes 1 read-time.');
    expect(el.querySelector('.xor-note')?.textContent).toContain('They match');

    el.querySelector<HTMLButtonElement>('.layout-classic')!.click();
    expect(reads()).toEqual([3, 3, 0, 0, 0, 0]);
    expect(el.querySelector('.verdict')?.className).toContain('bad');

    el.querySelector<HTMLButtonElement>('.layout-random')!.click();
    expect(Math.min(...reads())).toBe(0);
    expect(Math.max(...reads())).toBeGreaterThanOrEqual(2);

    // Keyboard: Enter on the failed disk repairs it.
    el.querySelector<SVGGElement>('[data-disk="0"]')!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(el.querySelectorAll('.raid-figure .bar')).toHaveLength(0);
  });
});
