// A match-one card deck from a planar difference set: points are symbols,
// lines are cards. With D a (v, q + 1, 1) difference set mod v = q² + q + 1,
// card j holds the symbols at the points D + j, so every two cards share
// exactly one symbol and every two symbols appear together on one card.

import { mod } from './numbers';
import { mulberry32, shuffled } from './random';
import { singerSet, singerV } from './singer';

/** The orders q the deck maker offers: prime powers with at most 133 symbols. */
export const DECK_Q = [2, 3, 4, 5, 7, 8, 9, 11] as const;

export interface Deck {
  q: number;
  v: number;
  /** The difference set D, so card j is D + j. */
  set: number[];
  /** cards[j] lists the points of D + j, in the order of D. */
  cards: number[][];
}

export function makeDeck(q: number): Deck {
  const v = singerV(q);
  const set = singerSet(q);
  return { q, v, set, cards: Array.from({ length: v }, (_, j) => set.map((d) => mod(d + j, v))) };
}

/** The points two cards share. */
export function shared(a: readonly number[], b: readonly number[]): number[] {
  const inB = new Set(b);
  return a.filter((x) => inB.has(x));
}

export interface DeckCheck {
  pairs: number;
  /** Pairs of card indices that do not share exactly one symbol. */
  bad: [number, number][];
  /** How many cards each symbol is on (q + 1 for every symbol in a plane). */
  appearances: number[];
}

/** Check every pair of cards shares exactly one point. */
export function checkDeck(cards: readonly (readonly number[])[], v: number): DeckCheck {
  const bad: [number, number][] = [];
  let pairs = 0;
  for (let i = 0; i < cards.length; i++) {
    for (let j = i + 1; j < cards.length; j++) {
      pairs++;
      if (shared(cards[i], cards[j]).length !== 1) bad.push([i, j]);
    }
  }
  const appearances = new Array<number>(v).fill(0);
  for (const c of cards) for (const x of c) appearances[x]++;
  return { pairs, bad, appearances };
}

export interface SymbolInfo {
  slug: string;
  name: string;
  file: string;
  theme: string;
}

/**
 * Pick v symbols for the points 0 … v − 1, shuffled by the seed. With a
 * theme, symbols from that theme come first and the rest fill any shortfall.
 */
export function assignSymbols<T extends { theme: string }>(
  symbols: readonly T[],
  v: number,
  seed: number,
  theme: string | null = null,
): T[] {
  if (symbols.length < v) throw new Error(`Need ${v} symbols, have ${symbols.length}`);
  const rng = mulberry32(seed);
  const inTheme = theme ? symbols.filter((s) => s.theme === theme) : [];
  const rest = theme ? symbols.filter((s) => s.theme !== theme) : [...symbols];
  const a = shuffled(inTheme, rng);
  const b = shuffled(rest, rng);
  const picked = [...a, ...b].slice(0, v);
  return shuffled(picked, rng);
}

export interface Placement {
  /** Top-left corner, as a fraction of the card's side (0…1). */
  x: number;
  y: number;
  /** Side of the symbol's square, as a fraction of the card's side. */
  size: number;
}

/**
 * Slot positions on a g × g grid, in slot order. Rings run clockwise from the
 * top-left corner; the other patterns read left to right, top to bottom.
 * Fractional cells offset a row (or column) by half a cell to keep the
 * pattern symmetric.
 */
const ring = (g: number): [number, number][] => {
  const top = Array.from({ length: g }, (_, i): [number, number] => [i, 0]);
  const right = Array.from({ length: g - 2 }, (_, i): [number, number] => [g - 1, i + 1]);
  const bottom = Array.from({ length: g }, (_, i): [number, number] => [g - 1 - i, g - 1]);
  const left = Array.from({ length: g - 2 }, (_, i): [number, number] => [0, g - 2 - i]);
  return [...top, ...right, ...bottom, ...left];
};

const SLOTS: Record<number, { g: number; cells: [number, number][] }> = {
  3: { g: 2, cells: [[0.5, 0], [0, 1], [1, 1]] },
  4: { g: 2, cells: [[0, 0], [1, 0], [0, 1], [1, 1]] },
  5: { g: 3, cells: [[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]] },
  6: { g: 3, cells: [[0, 0.5], [1, 0.5], [2, 0.5], [0, 1.5], [1, 1.5], [2, 1.5]] },
  8: { g: 3, cells: ring(3) },
  9: { g: 3, cells: Array.from({ length: 9 }, (_, i): [number, number] => [i % 3, Math.floor(i / 3)]) },
  10: {
    g: 4,
    cells: [
      ...[0.5, 1.5, 2.5].map((x): [number, number] => [x, 0.5]),
      ...[0, 1, 2, 3].map((x): [number, number] => [x, 1.5]),
      ...[0.5, 1.5, 2.5].map((x): [number, number] => [x, 2.5]),
    ],
  },
  12: { g: 4, cells: ring(4) },
};

/** The card sizes the deck maker can lay out: q + 1 for each q in DECK_Q. */
export const SLOT_COUNTS = Object.keys(SLOTS).map(Number);

/**
 * Lay out n equal, upright squares on a square card in a fixed symmetric
 * pattern, leaving bands at the top and bottom for the card number and the site's address. Slot i holds the i-th point of the card, which on card D + j is
 * d_i + j; so across the deck each symbol sits in each slot exactly once.
 */
export function layoutCard(n: number): Placement[] {
  const slots = SLOTS[n];
  if (!slots) throw new Error(`No card layout for ${n} symbols`);
  const band = 0.05; // top and bottom bands for the card number and the site's address
  const margin = 0.015; // between a band and the squares, and at the sides
  const gap = 0.03; // between neighboring squares
  const inset = band + margin;
  const cell = (1 - 2 * inset + gap) / slots.g;
  const size = cell - gap;
  return slots.cells.map(([c, r]) => ({ x: inset + c * cell, y: inset + r * cell, size }));
}

/** Seed that fixes which picture stands for each point, so every deck is reproducible. */
export const DECK_SEED = 57;

export type PrintSize = 'small' | 'medium' | 'large';

/**
 * Printed card sizes. Each page is a whole grid of cards that fits inside
 * both US Letter and A4 with 10 mm margins (190 × 259 mm), so no card is
 * ever split across a page break.
 */
export const PRINT_SIZES: Record<PrintSize, { label: string; mm: number; cols: number; rows: number }> = {
  small: { label: 'Small', mm: 63, cols: 3, rows: 4 },
  medium: { label: 'Medium', mm: 82, cols: 2, rows: 3 },
  large: { label: 'Large', mm: 94, cols: 2, rows: 2 },
};

/** Parse "?q=7&theme=vehicles&size=small" into deck settings, with defaults. */
export function parseDeckParams(search: string): {
  q: number;
  theme: 'all' | 'vehicles';
  size: PrintSize;
} {
  const p = new URLSearchParams(search);
  const q = Number(p.get('q'));
  return {
    q: (DECK_Q as readonly number[]).includes(q) ? q : 7,
    theme: p.get('theme') === 'vehicles' ? 'vehicles' : 'all',
    size: (Object.keys(PRINT_SIZES) as string[]).includes(p.get('size') ?? '') ? (p.get('size') as PrintSize) : 'medium',
  };
}
