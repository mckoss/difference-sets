// The topic search index: every lesson cut into sections at its h2 and h3
// headings, each with its anchor and plain text, plus the glossary terms and
// playgrounds. src/pages/search-index.json.ts serves it; src/widgets/topicSearch.ts
// searches it in the browser.

import type { Element, ElementContent, Root, RootContent } from 'hast';
import { fromHtml } from 'hast-util-from-html';

export interface SearchEntry {
  /** What the result is called: a section heading, glossary term, or playground. */
  title: string;
  /** Where it lives, e.g. "Lesson 10 · Fields inside fields" or "Glossary". */
  where: string;
  /** Site-relative link, with the section anchor. */
  href: string;
  text: string;
}

const BLOCK = new Set(['p', 'li', 'tr', 'td', 'th', 'div', 'section', 'aside', 'blockquote', 'figure', 'figcaption', 'details', 'summary', 'br', 'dt', 'dd']);
const SKIP = new Set(['script', 'style', 'svg', 'button', 'input', 'select', 'textarea']);

const TEX_SYMBOLS: Record<string, string> = {
  alpha: 'α', beta: 'β', omega: 'ω', lambda: 'λ', varphi: 'φ', phi: 'φ', sigma: 'σ', sum: 'Σ',
  cdot: '·', times: '×', equiv: '≡', mid: '|', mapsto: '↦', cap: '∩', cup: '∪', in: '∈',
  oplus: '⊕', neq: '≠', ne: '≠', le: '≤', ge: '≥', ldots: '…', dots: '…', cdots: '…', to: '→',
};

/** A readable approximation of a TeX formula, for searching and snippets. */
export function simplifyTex(tex: string): string {
  return tex
    .replace(/\\pmod\s*\{?([^}\s]+)\}?/g, '(mod $1)')
    .replace(/\\bmod/g, 'mod')
    .replace(/\\(?:mathrm|mathbb|text|mathbf|operatorname)\s*\{([^}]*)\}/g, '$1')
    .replace(/\\([a-zA-Z]+)/g, (_, name: string) => TEX_SYMBOLS[name] ?? ' ')
    .replace(/\\./g, ' ')
    .replace(/[{}_&]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function classes(el: Element): string[] {
  const c = el.properties?.className;
  return Array.isArray(c) ? c.map(String) : [];
}

/** Plain text of a node, with KaTeX read back from its TeX source. */
export function plainText(node: RootContent | ElementContent | Root): string {
  if (node.type === 'text') return node.value;
  if (node.type !== 'element' && node.type !== 'root') return '';
  if (node.type === 'element') {
    if (SKIP.has(node.tagName)) return '';
    const cls = classes(node);
    if (cls.includes('katex') || cls.includes('katex-display')) {
      const tex = findAnnotation(node);
      return tex ? ` ${simplifyTex(tex)} ` : '';
    }
  }
  const inner = node.children.map((c) => plainText(c as ElementContent)).join('');
  return node.type === 'element' && BLOCK.has(node.tagName) ? ` ${inner} ` : inner;
}

function findAnnotation(el: Element): string | undefined {
  for (const c of el.children) {
    if (c.type !== 'element') continue;
    if (c.tagName === 'annotation') return c.children.map((t) => (t.type === 'text' ? t.value : '')).join('');
    const found = findAnnotation(c);
    if (found !== undefined) return found;
  }
  return undefined;
}

const tidy = (s: string) => s.replace(/\s+/g, ' ').replace(/ ([,.;])/g, '$1').trim();

/**
 * Cut a lesson's rendered HTML into sections at h2/h3 headings. Text before the
 * first heading belongs to the lesson itself; the "Sources" list is left out.
 */
export function lessonSections(html: string, lesson: { order: number; title: string; path: string }): SearchEntry[] {
  const tree = fromHtml(html, { fragment: true });
  const where = `Lesson ${lesson.order} · ${lesson.title}`;
  const out: SearchEntry[] = [];
  let current: SearchEntry = { title: lesson.title, where, href: lesson.path, text: '' };
  let skipping = false;
  const flush = () => {
    current.text = tidy(current.text);
    if (!skipping && current.text) out.push(current);
  };
  for (const node of tree.children) {
    if (node.type === 'element' && (node.tagName === 'h2' || node.tagName === 'h3')) {
      const title = tidy(plainText(node));
      flush();
      if (node.tagName === 'h2') skipping = title === 'Sources';
      const id = node.properties?.id ? `#${String(node.properties.id)}` : '';
      current = { title, where, href: lesson.path + id, text: '' };
      continue;
    }
    if (node.type === 'element' && classes(node).includes('footnotes')) {
      flush();
      skipping = false;
      current = { title: 'Footnotes', where, href: `${lesson.path}#footnote-label`, text: plainText(node).replace(/^\s*Footnotes/, '') };
      continue;
    }
    current.text += plainText(node);
  }
  flush();
  return out;
}
