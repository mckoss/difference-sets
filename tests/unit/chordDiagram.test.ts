// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { chordDiagram } from '../../src/viz/chordDiagram';
import { diagramGallery } from '../../src/viz/gallery';
import notebookSvgs from '../fixtures/notebook-svgs.json';

interface NotebookSvg {
  members: number[];
  texts: { x: number; y: number; text: string }[];
  lines: number[][];
  circles: number;
}

const attrs = (el: Element, names: string[]) => names.map((n) => Number(el.getAttribute(n)));

describe('chordDiagram', () => {
  it('draws one rim, v points, and a chord per pair', () => {
    const svg = chordDiagram([0, 1, 3]);
    expect(svg.querySelectorAll('circle.rim')).toHaveLength(1);
    expect(svg.querySelectorAll('circle.member')).toHaveLength(3);
    expect(svg.querySelectorAll('circle.point')).toHaveLength(4);
    expect(svg.querySelectorAll('line.chord')).toHaveLength(3);
    expect([...svg.querySelectorAll('.diff-label')].map((t) => t.textContent)).toEqual(['1,6', '3,4', '2,5']);
    expect(svg.querySelector('title')?.textContent).toBe('Difference set {0, 1, 3} mod 7');
  });

  it('labels each nonzero difference exactly once for a planar set', () => {
    const ds = [0, 1, 4, 14, 16];
    const seen = [...chordDiagram(ds).querySelectorAll('.diff-label')].flatMap((t) =>
      t.textContent!.split(',').map(Number),
    );
    expect(seen.sort((a, b) => a - b)).toEqual(Array.from({ length: 20 }, (_, i) => i + 1));
  });

  // The notebook's own rendered SVGs for q = 2…8: geometry and label placement must match.
  it.each((notebookSvgs as NotebookSvg[]).map((s) => [s.members.join(','), s] as const))(
    'matches the notebook rendering of {%s}',
    (_, expected) => {
      const svg = chordDiagram(expected.members);
      expect(svg.querySelectorAll('circle')).toHaveLength(expected.circles);

      const lines = [...svg.querySelectorAll('line')].map((l) => attrs(l, ['x1', 'y1', 'x2', 'y2']));
      expect(lines).toHaveLength(expected.lines.length);
      lines.forEach((l, i) => l.forEach((v, j) => expect(v).toBeCloseTo(expected.lines[i][j], 6)));

      const texts = [...svg.querySelectorAll('text')];
      expect(texts.map((t) => t.textContent)).toEqual(expected.texts.map((t) => t.text));
      texts.forEach((t, i) => {
        const [x, y] = attrs(t, ['x', 'y']);
        expect(x).toBeCloseTo(expected.texts[i].x, 6);
        expect(y).toBeCloseTo(expected.texts[i].y, 6);
      });
    },
  );
});

describe('diagramGallery', () => {
  it('captions one figure per set', () => {
    const gallery = diagramGallery([
      [0, 1, 3, 9],
      [0, 1, 4, 6],
    ]);
    expect(gallery.querySelectorAll('figure svg')).toHaveLength(2);
    expect([...gallery.querySelectorAll('figcaption')].map((c) => c.textContent)).toEqual([
      '{0, 1, 3, 9}',
      '{0, 1, 4, 6}',
    ]);
  });
});
