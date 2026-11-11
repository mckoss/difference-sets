// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { lessonSections, simplifyTex, type SearchEntry } from '../../src/lib/searchIndex';
import { searchEntries, snippet } from '../../src/widgets/topicSearch';

describe('simplifyTex', () => {
  it('reads common TeX back as text', () => {
    expect(simplifyTex('\\mathrm{GF}(q^3)')).toBe('GF(q^3)');
    expect(simplifyTex('a \\equiv b \\pmod 7')).toBe('a ≡ b (mod 7)');
    expect(simplifyTex('\\mathbb{Z}/v\\mathbb{Z}')).toBe('Z/vZ');
    expect(simplifyTex('\\alpha^{i}')).toBe('α^i');
  });
});

describe('lessonSections', () => {
  const html = [
    '<p>Intro text.</p>',
    '<h2 id="clocks">Clocks</h2><p>Hours <span class="katex"><span class="katex-mathml"><math><semantics><mrow></mrow><annotation encoding="application/x-tex">\\mathbb{Z}</annotation></semantics></math></span><span class="katex-html">Z junk</span></span> here.</p>',
    '<h3 id="sub">Sub</h3><p>More.</p>',
    '<h2 id="sources">Sources</h2><p>Citations.</p>',
    '<section class="footnotes"><h2 id="footnote-label">Footnotes</h2><ol><li>A note.</li></ol></section>',
  ].join('');
  const s = lessonSections(html, { order: 5, title: 'Fields', path: 'lessons/05-x/' });

  it('cuts at headings and keeps anchors', () => {
    expect(s.map((e) => [e.title, e.href])).toEqual([
      ['Fields', 'lessons/05-x/'],
      ['Clocks', 'lessons/05-x/#clocks'],
      ['Sub', 'lessons/05-x/#sub'],
      ['Footnotes', 'lessons/05-x/#footnote-label'],
    ]);
    expect(s[0].where).toBe('Lesson 5 · Fields');
  });

  it('reads math from its TeX, not the rendered glyphs', () => {
    expect(s[1].text).toBe('Hours Z here.');
  });

  it('keeps footnotes but drops the Sources list', () => {
    expect(s[3].text).toBe('A note.');
    expect(s.some((e) => e.text.includes('Citations'))).toBe(false);
  });
});

describe('searchEntries', () => {
  const entries: SearchEntry[] = [
    { title: 'Multiplying is jumping', where: 'Lesson 6', href: 'a', text: 'The trace appears once here.' },
    { title: 'The trace', where: 'Lesson 15', href: 'b', text: 'The trace of x is x + x^q. Trace zero.' },
    { title: 'trace', where: 'Glossary', href: 'c', text: 'Tr(x) = x + x^q + x^q².' },
    { title: 'Clocks', where: 'Lesson 1', href: 'd', text: 'Nothing to see.' },
  ];

  it('needs every word and ranks titles first', () => {
    const r = searchEntries(entries, 'Trace');
    expect(r.map((m) => m.entry.href)).toEqual(['c', 'b', 'a']);
    expect(searchEntries(entries, 'trace once').map((m) => m.entry.href)).toEqual(['a']);
    expect(searchEntries(entries, '  ')).toEqual([]);
  });

  it('ignores accents and apostrophes', () => {
    const r = searchEntries([{ title: 'Galois’s field', where: '', href: 'g', text: 'Évariste' }], 'galoiss evariste');
    expect(r).toHaveLength(1);
  });
});

describe('snippet', () => {
  const text = 'one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty';
  it('shows the words around a match', () => {
    const s = snippet(text, text.indexOf('twelve'));
    expect(s.startsWith('… ')).toBe(true);
    expect(s).toContain('twelve');
  });
  it('starts at the beginning when there is no match in the text', () => {
    expect(snippet(text, -1).startsWith('one two')).toBe(true);
  });
});
