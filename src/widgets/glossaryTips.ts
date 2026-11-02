// Hover popups for glossary terms in lesson text. rehypeGlossary turns the
// first use of each term into <a class="gloss" data-term data-def>; hovering or
// focusing it shows the definition. A tap on a touch screen shows it too, and a
// second tap (or the link inside the popup) opens the glossary entry.

import { defParts } from '../glossary';

const SHOW_DELAY = 250;
const HIDE_DELAY = 200;
const MARGIN = 8;

export function initGlossaryTips(root: Document = document): void {
  const terms = root.querySelectorAll<HTMLAnchorElement>('a.gloss');
  if (terms.length === 0) return;

  const tip = root.createElement('div');
  tip.className = 'gloss-tip';
  tip.id = 'gloss-tip';
  tip.setAttribute('role', 'tooltip');
  tip.hidden = true;
  root.body.append(tip);

  let current: HTMLAnchorElement | null = null;
  let showTimer = 0;
  let hideTimer = 0;

  function place(a: HTMLAnchorElement) {
    const win = root.defaultView!;
    const r = a.getBoundingClientRect();
    const vw = root.documentElement.clientWidth;
    tip.style.maxWidth = `${Math.min(352, vw - 2 * MARGIN)}px`;
    const w = tip.offsetWidth;
    const h = tip.offsetHeight;
    const left = Math.max(MARGIN, Math.min(r.left, vw - w - MARGIN));
    const below = r.bottom + 6;
    const top = below + h > win.innerHeight - MARGIN && r.top - h - 6 > MARGIN ? r.top - h - 6 : below;
    tip.style.left = `${left + win.scrollX}px`;
    tip.style.top = `${top + win.scrollY}px`;
  }

  function show(a: HTMLAnchorElement) {
    clearTimeout(hideTimer);
    if (current === a && !tip.hidden) return;
    current?.removeAttribute('aria-describedby');
    current = a;
    tip.replaceChildren();
    const term = root.createElement('strong');
    term.textContent = a.dataset.term ?? a.textContent ?? '';
    const def = root.createElement('span');
    def.append(' ');
    for (const part of defParts(a.dataset.def ?? '')) {
      if (typeof part === 'string') def.append(part);
      else {
        const sup = root.createElement('sup');
        sup.textContent = part.sup;
        def.append(sup);
      }
    }
    def.append(' ');
    const more = root.createElement('a');
    more.href = a.href;
    more.className = 'gloss-tip-more';
    more.textContent = 'Glossary →';
    tip.append(term, def, more);
    tip.hidden = false;
    a.setAttribute('aria-describedby', tip.id);
    place(a);
  }

  function hide() {
    clearTimeout(showTimer);
    tip.hidden = true;
    current?.removeAttribute('aria-describedby');
    current = null;
  }

  const hideSoon = () => {
    clearTimeout(showTimer);
    hideTimer = window.setTimeout(hide, HIDE_DELAY);
  };

  for (const a of terms) {
    a.addEventListener('mouseenter', () => {
      clearTimeout(hideTimer);
      showTimer = window.setTimeout(() => show(a), SHOW_DELAY);
    });
    a.addEventListener('mouseleave', hideSoon);
    a.addEventListener('focus', () => show(a));
    a.addEventListener('blur', (e) => {
      if (!tip.contains(e.relatedTarget as Node | null)) hideSoon();
    });
    // Follow the link only once its definition is showing; the first tap on a
    // touch screen (or a click faster than the hover delay) just shows it.
    a.addEventListener('click', (e) => {
      if (current !== a || tip.hidden) {
        e.preventDefault();
        show(a);
      }
    });
  }

  tip.addEventListener('mouseenter', () => clearTimeout(hideTimer));
  tip.addEventListener('mouseleave', hideSoon);
  tip.addEventListener('focusout', (e) => {
    if (e.relatedTarget !== current && !tip.contains(e.relatedTarget as Node | null)) hideSoon();
  });
  root.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !tip.hidden) hide();
  });
  root.addEventListener('pointerdown', (e) => {
    const t = e.target as Node;
    if (!tip.hidden && !tip.contains(t) && !current?.contains(t)) hide();
  });
  root.defaultView?.addEventListener('resize', hide);
}
