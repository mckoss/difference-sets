// The sidebar's topic search. On first use it fetches search-index.json (every
// lesson section, glossary term, and playground) and lists the sections that
// contain all the typed words, each linking straight to its anchor.

import type { SearchEntry } from '../lib/searchIndex';

const MAX_RESULTS = 12;
const SNIPPET = 90;

export interface Match {
  entry: SearchEntry;
  score: number;
  /** Where the first query word appears in the text, or -1. */
  at: number;
}

const fold = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[’']/g, '');

/** Rank entries containing every query word; headings and glossary terms first. */
export function searchEntries(entries: readonly SearchEntry[], query: string): Match[] {
  const words = fold(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const phrase = words.join(' ');
  const out: Match[] = [];
  for (const entry of entries) {
    const title = fold(entry.title);
    const text = fold(entry.text);
    if (!words.every((w) => title.includes(w) || text.includes(w))) continue;
    let score = 0;
    if (title === phrase) score += 40;
    else if (title.includes(phrase)) score += 20;
    for (const w of words) {
      if (title.includes(w)) score += 6;
      let n = 0;
      for (let i = text.indexOf(w); i >= 0 && n < 8; i = text.indexOf(w, i + w.length)) n++;
      score += n;
    }
    if (entry.where === 'Glossary' && title.includes(phrase)) score += 10;
    const at = text.indexOf(phrase) >= 0 ? text.indexOf(phrase) : text.indexOf(words[0]);
    out.push({ entry, score, at });
  }
  return out.sort((a, b) => b.score - a.score).slice(0, MAX_RESULTS);
}

/** A short run of text around position `at`, cut at word boundaries. */
export function snippet(text: string, at: number): string {
  if (at < 0) return text.length > SNIPPET ? `${text.slice(0, SNIPPET).replace(/\s\S*$/, '')} …` : text;
  const start = Math.max(0, at - 30);
  let s = text.slice(start, start + SNIPPET);
  if (start > 0) s = `… ${s.replace(/^\S*\s/, '')}`;
  if (start + SNIPPET < text.length) s = `${s.replace(/\s\S*$/, '')} …`;
  return s;
}

/** fold(), one character at a time, remembering where each folded character came from. */
function foldMapped(text: string): { folded: string; from: number[] } {
  let folded = '';
  const from: number[] = [];
  for (let i = 0; i < text.length; i++) {
    const f = fold(text[i]);
    for (const c of f) {
      folded += c;
      from.push(i);
    }
  }
  from.push(text.length);
  return { folded, from };
}

function highlight(el: HTMLElement, text: string, words: string[]) {
  const { folded, from } = foldMapped(text);
  const marks: [number, number][] = [];
  for (const w of words) {
    for (let i = folded.indexOf(w); i >= 0; i = folded.indexOf(w, i + w.length)) marks.push([from[i], from[i + w.length - 1] + 1]);
  }
  marks.sort((a, b) => a[0] - b[0]);
  let at = 0;
  for (const [s, e] of marks) {
    if (s < at) continue;
    el.append(text.slice(at, s));
    const m = document.createElement('mark');
    m.textContent = text.slice(s, e);
    el.append(m);
    at = e;
  }
  el.append(text.slice(at));
}

export function initTopicSearch(root: Document = document): void {
  const box = root.querySelector<HTMLElement>('.topic-search');
  const input = box?.querySelector<HTMLInputElement>('input');
  const list = box?.querySelector<HTMLUListElement>('ul');
  if (!box || !input || !list) return;
  const base = box.dataset.base ?? '/';

  let entries: SearchEntry[] | null = null;
  let loading: Promise<void> | null = null;
  let active = -1;

  const load = () =>
    (loading ??= fetch(box.dataset.index!)
      .then((r) => r.json() as Promise<SearchEntry[]>)
      .then((e) => {
        entries = e;
      })
      .catch(() => {
        entries = [];
      }));

  function setActive(i: number) {
    const items = list!.querySelectorAll<HTMLElement>('[role="option"]');
    items.forEach((li, j) => li.setAttribute('aria-selected', String(j === i)));
    active = i;
    if (i >= 0) {
      input!.setAttribute('aria-activedescendant', items[i].id);
      items[i].scrollIntoView({ block: 'nearest' });
    } else input!.removeAttribute('aria-activedescendant');
  }

  function render() {
    const q = input!.value.trim();
    list!.replaceChildren();
    active = -1;
    input!.removeAttribute('aria-activedescendant');
    if (!q) {
      list!.hidden = true;
      input!.setAttribute('aria-expanded', 'false');
      return;
    }
    const words = fold(q).split(/\s+/).filter(Boolean);
    const matches = entries ? searchEntries(entries, q) : [];
    if (entries && matches.length === 0) {
      const li = root.createElement('li');
      li.className = 'topic-search-empty';
      li.textContent = 'No sections match.';
      list!.append(li);
    }
    matches.forEach(({ entry, at }, i) => {
      const li = root.createElement('li');
      li.id = `topic-result-${i}`;
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', 'false');
      const a = root.createElement('a');
      a.href = base + entry.href;
      a.tabIndex = -1;
      const title = root.createElement('span');
      title.className = 'topic-result-title';
      highlight(title, entry.title, words);
      const where = root.createElement('span');
      where.className = 'topic-result-where';
      where.textContent = entry.where;
      const snip = root.createElement('span');
      snip.className = 'topic-result-snippet';
      highlight(snip, snippet(entry.text, at), words);
      a.append(title, where, snip);
      li.append(a);
      list!.append(li);
    });
    list!.hidden = false;
    input!.setAttribute('aria-expanded', 'true');
  }

  input.addEventListener('focus', () => void load());
  input.addEventListener('input', () => {
    if (entries) render();
    else void load().then(render);
  });
  input.addEventListener('keydown', (e) => {
    const n = list.querySelectorAll('[role="option"]').length;
    if (e.key === 'ArrowDown' && n > 0) {
      e.preventDefault();
      setActive((active + 1) % n);
    } else if (e.key === 'ArrowUp' && n > 0) {
      e.preventDefault();
      setActive((active - 1 + n) % n);
    } else if (e.key === 'Enter') {
      const i = active >= 0 ? active : 0;
      const a = list.querySelectorAll<HTMLAnchorElement>('[role="option"] a')[i];
      if (a) {
        e.preventDefault();
        a.click();
      }
    } else if (e.key === 'Escape') {
      input.value = '';
      render();
    }
  });
}
