import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { buildOutline, href, type LessonEntry, neighbors, PARTS, sortLessons } from '../../src/site';

const lesson = (order: number, part: number): LessonEntry => ({
  id: `${String(order).padStart(2, '0')}-l`,
  title: `Lesson ${order}`,
  order,
  part,
  summary: '',
  status: 'planned',
});

describe('outline', () => {
  const lessons = [lesson(3, 2), lesson(1, 1), lesson(2, 1)];

  it('sorts lessons and groups them by part', () => {
    const outline = buildOutline(lessons);
    expect(outline.map((p) => p.numeral)).toEqual(['I', 'II']);
    expect(outline[0].lessons.map((l) => l.order)).toEqual([1, 2]);
    expect(outline[1].lessons.map((l) => l.order)).toEqual([3]);
  });

  it('rejects gaps, repeats, and unknown parts', () => {
    expect(() => sortLessons([lesson(1, 1), lesson(3, 1)])).toThrow(/expected 2/);
    expect(() => sortLessons([lesson(1, 1), lesson(1, 1)])).toThrow(/expected 2/);
    expect(() => sortLessons([lesson(1, 99)])).toThrow(/unknown part/);
  });

  it('finds previous and next lessons', () => {
    expect(neighbors(lessons, '01-l')).toEqual({ prev: undefined, next: lessons[2] });
    expect(neighbors(lessons, '02-l').next?.order).toBe(3);
    expect(neighbors(lessons, '03-l').next).toBeUndefined();
    expect(() => neighbors(lessons, 'nope')).toThrow();
  });

  it('joins paths onto the base', () => {
    expect(href('/difference-sets/')).toBe('/difference-sets/');
    expect(href('/difference-sets', 'lessons/x/')).toBe('/difference-sets/lessons/x/');
    expect(href('/difference-sets/', '/playgrounds/y/')).toBe('/difference-sets/playgrounds/y/');
  });
});

describe('lesson files', () => {
  const dir = 'src/content/lessons';
  const files = readdirSync(dir).filter((f) => f.endsWith('.md'));
  const front = (f: string) => {
    const text = readFileSync(`${dir}/${f}`, 'utf8');
    const num = (key: string) => Number(text.match(new RegExp(`^${key}: (\\d+)$`, 'm'))?.[1]);
    return { file: f, order: num('order'), part: num('part') };
  };

  it('number 1…n with filename prefixes matching their order', () => {
    const entries = files.map(front).sort((a, b) => a.order - b.order);
    entries.forEach((e, i) => {
      expect(e.order).toBe(i + 1);
      expect(e.file.startsWith(`${String(e.order).padStart(2, '0')}-`)).toBe(true);
    });
  });

  it('only use known parts, in nondecreasing order', () => {
    const parts = files.map(front).sort((a, b) => a.order - b.order).map((e) => e.part);
    expect(parts.every((p) => PARTS.some((x) => x.part === p))).toBe(true);
    expect([...parts].sort((a, b) => a - b)).toEqual(parts);
  });
});
