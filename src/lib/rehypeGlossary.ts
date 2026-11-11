// Rehype plugin that ties lesson text to the glossary. On each lesson page,
// the first use of each glossary term becomes a quiet link to its glossary
// entry, carrying the definition for the hover popup (src/widgets/glossaryTips.ts).
// In the lesson that introduces a term, the term isn't linked; its defining use
// (the first bold one, else the first) gets an anchor instead, so the glossary,
// search, and printed index can point at the spot where it is explained.

import type { Element, ElementContent, Root, RootContent, Text } from 'hast';
import { toText } from 'hast-util-to-text';
import { visitParents } from 'unist-util-visit-parents';
import { GLOSSARY, linkForms, termSlug, type GlossaryTerm } from '../glossary';

export interface GlossaryOptions {
  /** Deploy base, e.g. "/difference-sets/". */
  base: string;
  terms?: readonly GlossaryTerm[];
}

const SKIP_TAGS = new Set(['a', 'code', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'summary', 'script', 'style', 'svg', 'math', 'sup']);

function skipped(el: Element): boolean {
  if (SKIP_TAGS.has(el.tagName)) return true;
  const cls = el.properties?.className;
  // <span class="no-gloss"> marks an everyday use of a word, like a farmer's field.
  return Array.isArray(cls) && cls.some((c) => String(c).startsWith('katex') || c === 'no-gloss');
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** One regex for all forms, longest first, so "prime power" beats "prime". */
export function glossaryMatcher(terms: readonly GlossaryTerm[]): { re: RegExp; termOf: Map<string, GlossaryTerm> } {
  const termOf = new Map<string, GlossaryTerm>();
  for (const t of terms) for (const f of linkForms(t)) termOf.set(f.toLowerCase(), t);
  const forms = [...termOf.keys()].sort((a, b) => b.length - a.length).map(escapeRegExp);
  // Whole words only; a trailing "s" or "es" covers plurals.
  const re = new RegExp(`(?<![\\p{L}\\p{N}-])(${forms.join('|')})(?:e?s)?(?![\\p{L}\\p{N}-])`, 'giu');
  return { re, termOf };
}

/** Lesson order from a source path like ".../06-which-clocks-are-fields.md". */
export function lessonOrderOf(path: string | undefined): number | undefined {
  const m = path?.match(/(?:^|[/\\])(\d+)-[^/\\]*\.md$/);
  return m ? Number(m[1]) : undefined;
}

interface Hit {
  node: Text;
  parent: Element | Root;
  start: number;
  end: number;
  term: GlossaryTerm;
  bold: boolean;
}

export default function rehypeGlossary(options: GlossaryOptions) {
  const terms = options.terms ?? GLOSSARY;
  const { re, termOf } = glossaryMatcher(terms);
  const glossaryHref = `${options.base.replace(/\/?$/, '/')}glossary/`;

  return (tree: Root, file: { path?: string; history?: string[] }) => {
    const lesson = lessonOrderOf(file.path ?? file.history?.[0]);
    const hits: Hit[] = [];
    // Leave the "Sources" list at the end of a lesson alone.
    const sources = tree.children.findIndex((c) => c.type === 'element' && c.tagName === 'h2' && toText(c).trim() === 'Sources');
    const after = new Set(sources < 0 ? [] : tree.children.slice(sources));
    visitParents(tree, 'text', (node: Text, ancestors) => {
      if (after.has(ancestors[1] as ElementContent) || after.has(node)) return;
      const els = ancestors.filter((a): a is Element => a.type === 'element');
      if (els.some(skipped)) return;
      // Inline HTML in markdown arrives as raw siblings: <span class="no-gloss">, text, </span>.
      const siblings = ancestors[ancestors.length - 1].children as RootContent[];
      const prev = siblings[siblings.indexOf(node) - 1] as { type: string; value?: string } | undefined;
      if (prev?.type === 'raw' && prev.value?.includes('no-gloss')) return;
      const bold = els.some((e) => e.tagName === 'strong' || e.tagName === 'b');
      for (const m of node.value.matchAll(re)) {
        const term = termOf.get(m[1].toLowerCase())!;
        hits.push({ node, parent: ancestors[ancestors.length - 1] as Element | Root, start: m.index, end: m.index + m[0].length, term, bold });
      }
    });

    // Choose one hit per term: the defining use in its own lesson, the first use elsewhere.
    const chosen = new Map<GlossaryTerm, Hit>();
    for (const hit of hits) {
      const prev = chosen.get(hit.term);
      if (!prev) chosen.set(hit.term, hit);
      else if (hit.term.lesson === lesson && hit.bold && !prev.bold) chosen.set(hit.term, hit);
    }

    // Split each affected text node, last match first so offsets stay valid.
    const byNode = new Map<Text, Hit[]>();
    for (const hit of chosen.values()) byNode.set(hit.node, [...(byNode.get(hit.node) ?? []), hit]);
    for (const [node, nodeHits] of byNode) {
      const parent = nodeHits[0].parent;
      const pieces: ElementContent[] = [];
      let at = 0;
      for (const hit of nodeHits.sort((a, b) => a.start - b.start)) {
        if (hit.start > at) pieces.push({ type: 'text', value: node.value.slice(at, hit.start) });
        const text: Text = { type: 'text', value: node.value.slice(hit.start, hit.end) };
        const slug = termSlug(hit.term.term);
        pieces.push(
          hit.term.lesson === lesson
            ? { type: 'element', tagName: 'span', properties: { className: ['gloss-def'], id: `def-${slug}` }, children: [text] }
            : {
                type: 'element',
                tagName: 'a',
                properties: {
                  className: ['gloss'],
                  href: `${glossaryHref}#${slug}`,
                  // Unique across lessons, so the printed index can point at each use.
                  id: lesson === undefined ? undefined : `use-${slug}-${lesson}`,
                  dataTerm: hit.term.term,
                  dataDef: hit.term.def,
                },
                children: [text],
              },
        );
        at = hit.end;
      }
      if (at < node.value.length) pieces.push({ type: 'text', value: node.value.slice(at) });
      const i = parent.children.indexOf(node as ElementContent);
      parent.children.splice(i, 1, ...pieces);
    }
  };
}
