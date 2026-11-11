import { readdirSync, readFileSync } from 'node:fs';
import type { Element, Root, Text } from 'hast';
import { fromHtml } from 'hast-util-from-html';
import { toHtml } from 'hast-util-to-html';
import { describe, expect, it } from 'vitest';
import { defParts, GLOSSARY, linkForms, SYMBOLS, sortedGlossary, termSlug, type GlossaryTerm } from '../../src/glossary';
import rehypeGlossary, { glossaryMatcher, lessonOrderOf } from '../../src/lib/rehypeGlossary';

const lessonDir = 'src/content/lessons';
const lessonFiles = readdirSync(lessonDir).filter((f) => f.endsWith('.md')).sort();

describe('glossary data', () => {
  it('has unique terms and slugs', () => {
    const slugs = GLOSSARY.map((t) => termSlug(t.term));
    expect(new Set(slugs).size).toBe(GLOSSARY.length);
    expect(slugs.every((s) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(s))).toBe(true);
  });

  it('points every entry and symbol at a real lesson', () => {
    for (const t of [...GLOSSARY, ...SYMBOLS]) {
      expect(t.lesson).toBeGreaterThanOrEqual(1);
      expect(t.lesson).toBeLessThanOrEqual(lessonFiles.length);
    }
  });

  it('cross-references only terms that exist', () => {
    const terms = new Set(GLOSSARY.map((t) => t.term));
    for (const t of GLOSSARY) for (const s of t.see ?? []) expect(terms, `${t.term} → ${s}`).toContain(s);
  });

  it('finds each linked term in the lesson that introduces it', () => {
    for (const t of GLOSSARY) {
      const forms = linkForms(t);
      if (forms.length === 0) continue;
      const text = readFileSync(`${lessonDir}/${lessonFiles[t.lesson - 1]}`, 'utf8').toLowerCase().replace(/’/g, "'");
      expect(forms.some((f) => text.includes(f.toLowerCase().replace(/’/g, "'"))), t.term).toBe(true);
    }
  });

  // The reader model of PLAN.md: a symbol is explained once, where it is
  // introduced, and a term that has been taught is used from then on.
  it('spells out each Greek letter in one lesson only', () => {
    const where = new Map<string, string[]>();
    for (const f of lessonFiles) {
      const text = readFileSync(`${lessonDir}/${f}`, 'utf8');
      for (const m of text.matchAll(/Greek letter \*{0,2}([a-z]+)/g)) {
        where.set(m[1], [...new Set([...(where.get(m[1]) ?? []), f])]);
      }
    }
    for (const [letter, files] of where) expect(files, `"the Greek letter ${letter}"`).toHaveLength(1);
  });

  it('uses the taught term, not an informal stand-in', () => {
    const standIns: [RegExp, string][] = [
      [/shares? no (common )?factor with/i, 'coprime'],
      [/\b(a|the) (turn|slide)s? of (\$|its|the other)/i, 'translate'],
      [/\bturned cop(y|ies)\b|\brotations? of \{|\brotation chart/i, 'translate'],
      [/\bjust shuffles\b|\bshuffles the (nonzero|residues)/i, 'permutes'],
      [/you learned in school|school geometry/i, 'the name of the subject'],
    ];
    for (const f of lessonFiles) {
      const text = readFileSync(`${lessonDir}/${f}`, 'utf8');
      for (const [re, better] of standIns) expect(text.match(re)?.[0], `${f}: say "${better}"`).toBeUndefined();
    }
  });

  it('sorts alphabetically, ignoring case', () => {
    const names = sortedGlossary().map((t) => t.term);
    expect(names.indexOf('additive inverse')).toBe(0);
    expect(names.indexOf('XOR')).toBeGreaterThan(names.indexOf('vector'));
    expect(names.indexOf('Boolean function')).toBeGreaterThan(names.indexOf('bit'));
  });

  it('reads lesson orders from source paths', () => {
    expect(lessonOrderOf('/x/src/content/lessons/06-which-clocks-are-fields.md')).toBe(6);
    expect(lessonOrderOf('/x/README.md')).toBeUndefined();
  });
});

const TERMS: GlossaryTerm[] = [
  { term: 'prime', lesson: 5, def: 'A prime.' },
  { term: 'prime power', lesson: 6, def: 'A power of a prime.' },
  { term: 'field', lesson: 5, def: 'A field.' },
  { term: 'line', lesson: 2, def: 'A line.', forms: [] },
];

function run(html: string, lesson: number): Root {
  const tree = fromHtml(html, { fragment: true });
  rehypeGlossary({ base: '/ds/', terms: TERMS })(tree, { path: `src/content/lessons/${String(lesson).padStart(2, '0')}-x.md` });
  return tree;
}

const links = (tree: Root) => toHtml(tree).match(/<a class="gloss"[^>]*>[^<]*<\/a>/g) ?? [];

describe('rehypeGlossary', () => {
  it('links only the first use of each term, longest phrase first', () => {
    const tree = run('<p>A prime power is a power of a prime. Primes again, and a field.</p><p>Fields.</p>', 9);
    const html = toHtml(tree);
    expect(links(tree)).toHaveLength(3);
    expect(html).toContain('href="/ds/glossary/#prime-power"');
    expect(html).toMatch(/<a class="gloss" href="\/ds\/glossary\/#prime" id="use-prime-9" data-term="prime" data-def="A prime.">prime<\/a>\. Primes again/);
    expect(html).toContain('>field</a>.</p><p>Fields.</p>');
  });

  it('matches plurals and whole words only', () => {
    expect(links(run('<p>Primes, primeval.</p>', 9))[0]).toContain('>Primes</a>');
    expect(links(run('<p>primeval subfields</p>', 9))).toHaveLength(0);
  });

  it('leaves headings, links, code, math, and the Sources list alone', () => {
    const tree = run(
      '<h2>A prime</h2><p><a href="x">prime</a> <code>prime</code> <span class="katex">prime</span></p><p>field</p><h2>Sources</h2><p>prime</p>',
      9,
    );
    const html = toHtml(tree);
    expect(links(tree)).toHaveLength(1);
    expect(html).toContain('>field</a>');
    expect(html).toContain('<h2>Sources</h2><p>prime</p>');
  });

  it('skips words marked as everyday uses', () => {
    expect(links(run('<p>a <span class="no-gloss">field</span> of corn, then a field</p>', 9))).toHaveLength(1);
    // The same span as raw HTML siblings, the way unparsed inline HTML arrives.
    const raw = (value: string) => ({ type: 'raw', value }) as unknown as Text;
    const tree: Root = {
      type: 'root',
      children: [{ type: 'element', tagName: 'p', properties: {}, children: [raw('<span class="no-gloss">'), { type: 'text', value: 'field' }, raw('</span>')] }],
    };
    rehypeGlossary({ base: '/ds/', terms: TERMS })(tree, { path: 'src/content/lessons/09-x.md' });
    expect(links(tree)).toHaveLength(0);
  });

  it('never links forms-less terms', () => {
    expect(links(run('<p>a line</p>', 9))).toHaveLength(0);
  });

  it('anchors the defining (bold) use in the introducing lesson instead of linking', () => {
    const tree = run('<p>Every prime is odd or 2.</p><p>A <strong>prime</strong> has two factors.</p><p>A field.</p>', 5);
    const html = toHtml(tree);
    expect(links(tree)).toHaveLength(0);
    expect(html).toContain('<strong><span class="gloss-def" id="def-prime">prime</span></strong>');
    expect(html).toContain('<span class="gloss-def" id="def-field">field</span>');
    expect(html).toContain('<p>Every prime is odd or 2.</p>');
  });

  it('handles several hits in one text node', () => {
    const tree = run('<p>a prime and a field</p>', 9);
    const p = tree.children[0] as Element;
    expect(p.children.map((c) => c.type)).toEqual(['text', 'element', 'text', 'element']);
  });

  it('builds one matcher over every form', () => {
    const { re } = glossaryMatcher(GLOSSARY);
    expect('Singer’s theorem'.match(re)?.[0]).toBe('Singer’s theorem');
    expect('m-sequences'.match(re)?.[0]).toBe('m-sequences');
    expect('difference-set cyclic codes'.match(re)?.[0]).toBe('difference-set cyclic codes');
  });
});

describe('defParts', () => {
  it('lifts exponents into superscripts', () => {
    expect(defParts('x ↦ x^q and 2^(m+1) − 1, x^(q²).')).toEqual(['x ↦ x', { sup: 'q' }, ' and 2', { sup: 'm+1' }, ' − 1, x', { sup: 'q²' }, '.']);
    expect(defParts('no exponents')).toEqual(['no exponents']);
  });
});
