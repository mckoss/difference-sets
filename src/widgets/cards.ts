// Square picture cards for the match-one deck: shared by the deck maker
// playground and the Lesson 18 widget.

import manifest from '../../public/symbols/manifest.json';
import { assignSymbols, layoutCard, type SymbolInfo } from '../math/deck';

export const SYMBOLS: SymbolInfo[] = manifest;

/** URL of a symbol image under the site's base path. */
export const symbolUrl = (s: SymbolInfo) => `${import.meta.env.BASE_URL.replace(/\/?$/, '/')}symbols/${s.file}`;

/** The symbols for points 0 … v − 1. */
export function symbolsFor(v: number, seed: number, theme: 'all' | 'vehicles'): SymbolInfo[] {
  return assignSymbols(SYMBOLS, v, seed, theme === 'vehicles' ? 'vehicle' : null);
}

export interface CardOptions {
  /** The points on this card. */
  points: readonly number[];
  /** symbols[p] is the picture for point p. */
  symbols: readonly SymbolInfo[];
  /** Symbols become buttons (for play mode). */
  interactive?: boolean;
  /** Load images right away (for printing) instead of lazily. */
  eager?: boolean;
  label?: string;
}

/** A square card with its symbols upright and the same size, in fixed slots (slot i holds points[i]). */
export function renderCard({ points, symbols, interactive = false, eager = false, label }: CardOptions): HTMLElement {
  const card = document.createElement('div');
  card.className = 'match-card';
  const names = points.map((p) => symbols[p].name);
  card.setAttribute('role', interactive ? 'group' : 'img');
  card.setAttribute('aria-label', `${label ? `${label}: ` : ''}${names.join(', ')}`);
  const places = layoutCard(points.length);
  points.forEach((p, i) => {
    const s = symbols[p];
    const { x, y, size } = places[i];
    const sym = document.createElement(interactive ? 'button' : 'span');
    sym.className = 'sym';
    sym.dataset.point = String(p);
    sym.dataset.slot = String(i);
    if (interactive) {
      (sym as HTMLButtonElement).type = 'button';
      sym.setAttribute('aria-label', s.name);
    }
    sym.title = s.name;
    sym.style.left = `${x * 100}%`;
    sym.style.top = `${y * 100}%`;
    sym.style.width = sym.style.height = `${size * 100}%`;
    const img = document.createElement('img');
    img.src = symbolUrl(s);
    img.alt = interactive ? '' : s.name;
    img.width = img.height = 256;
    img.loading = eager ? 'eager' : 'lazy';
    img.decoding = 'async';
    img.draggable = false;
    sym.append(img);
    card.append(sym);
  });
  return card;
}
