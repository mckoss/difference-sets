// Match-N card decks from cyclic difference sets: points are symbols, and
// with D a (v, k, λ) difference set mod v, card j holds the symbols at the
// points D + j. Every two cards then share exactly λ symbols (Lesson 4's
// theorem), so λ = 1 is Spot It and larger λ asks players to find more.

import { mod } from './numbers';
import { mulberry32, shuffled } from './random';
import { singerSet, singerV } from './singer';
import { singerSetPG } from './singerPG';

/** The orders q of the match-one (planar) decks: prime powers with at most 133 symbols. */
export const DECK_Q = [2, 3, 4, 5, 7, 8, 9, 11] as const;

export interface DeckSpec {
  /** URL id, e.g. "q7" for the plane of order 7. */
  id: string;
  v: number;
  k: number;
  /** Every two cards share exactly this many symbols. */
  lambda: number;
  /** Where the difference set comes from, for the verify panel. */
  source: string;
  set: () => number[];
}

const complement = (set: readonly number[], v: number) => {
  const inSet = new Set(set);
  return Array.from({ length: v }, (_, i) => i).filter((i) => !inSet.has(i));
};
const powersMod = (e: number, p: number) =>
  [...new Set(Array.from({ length: p - 1 }, (_, i) => Number(BigInt(i + 1) ** BigInt(e) % BigInt(p))))].sort(
    (a, b) => a - b,
  );

/** Every deck the deck maker offers, grouped by λ. */
export const DECKS: DeckSpec[] = [
  ...DECK_Q.map((q) => ({
    id: `q${q}`,
    v: singerV(q),
    k: q + 1,
    lambda: 1,
    source: `Singer's construction for the projective plane of order q = ${q}`,
    set: () => singerSet(q),
  })),
  {
    id: 'b7',
    v: 7,
    k: 4,
    lambda: 2,
    source: 'the complement of the Singer set {1, 2, 4} for the Fano plane',
    set: () => complement(singerSet(2), 7),
  },
  { id: 'b11', v: 11, k: 5, lambda: 2, source: 'the nonzero squares mod 11', set: () => powersMod(2, 11) },
  { id: 'b37', v: 37, k: 9, lambda: 2, source: 'the nonzero fourth powers mod 37', set: () => powersMod(4, 37) },
  {
    id: 's2',
    v: 15,
    k: 7,
    lambda: 3,
    source: "Singer's construction for the planes of PG(3, 2), three-dimensional space over GF(2)",
    set: () => singerSetPG(2, 3),
  },
  {
    id: 's3',
    v: 40,
    k: 13,
    lambda: 4,
    source: "Singer's construction for the planes of PG(3, 3), three-dimensional space over GF(3)",
    set: () => singerSetPG(3, 3),
  },
];

export const deckSpec = (id: string): DeckSpec => {
  const spec = DECKS.find((d) => d.id === id);
  if (!spec) throw new Error(`No deck ${id}`);
  return spec;
};

export interface Deck {
  spec: DeckSpec;
  v: number;
  k: number;
  lambda: number;
  /** The difference set D, so card j is D + j. */
  set: number[];
  /** cards[j] lists the points of D + j, in the order of D. */
  cards: number[][];
}

export function makeDeck(id: string): Deck {
  const spec = deckSpec(id);
  const set = spec.set();
  const { v, k, lambda } = spec;
  return { spec, v, k, lambda, set, cards: Array.from({ length: v }, (_, j) => set.map((d) => mod(d + j, v))) };
}

/** The points two cards share. */
export function shared(a: readonly number[], b: readonly number[]): number[] {
  const inB = new Set(b);
  return a.filter((x) => inB.has(x));
}

export interface DeckCheck {
  pairs: number;
  /** Pairs of card indices that do not share exactly λ symbols. */
  bad: [number, number][];
  /** How many cards each symbol is on (k for a difference set deck). */
  appearances: number[];
}

/** Check every pair of cards shares exactly λ points. */
export function checkDeck(cards: readonly (readonly number[])[], v: number, lambda = 1): DeckCheck {
  const bad: [number, number][] = [];
  let pairs = 0;
  for (let i = 0; i < cards.length; i++) {
    for (let j = i + 1; j < cards.length; j++) {
      pairs++;
      if (shared(cards[i], cards[j]).length !== lambda) bad.push([i, j]);
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
  /** Shown in small grey text under the picture (portraits of people). */
  caption?: string;
  /** False keeps an image in the collection but out of every deck. */
  deck?: boolean;
}

export type DeckTheme = 'all' | 'vehicles' | 'presidents' | 'stars' | 'scientists' | 'people';

/**
 * The deck maker's themes. A deck uses pictures from `primary` first and
 * fills any shortfall from `fallback`.
 */
export const DECK_THEMES: Record<DeckTheme, { label: string; primary: string[]; fallback: string[] }> = {
  all: { label: 'Everything', primary: ['other', 'vehicle'], fallback: [] },
  vehicles: { label: 'Vehicles', primary: ['vehicle'], fallback: ['other'] },
  presidents: { label: 'US Presidents', primary: ['president'], fallback: ['star', 'scientist'] },
  stars: { label: 'Classic movie stars', primary: ['star'], fallback: ['president', 'scientist'] },
  scientists: { label: 'Famous scientists', primary: ['scientist'], fallback: ['president', 'star'] },
  people: { label: 'Famous people', primary: ['president', 'star', 'scientist'], fallback: [] },
};

/**
 * Pick v symbols for the points 0 … v − 1, shuffled by the seed: symbols
 * whose theme is in `primary` come first, and those in `fallback` fill any
 * shortfall.
 */
export function assignSymbols<T extends { theme: string; deck?: boolean }>(
  symbols: readonly T[],
  v: number,
  seed: number,
  primary: readonly string[],
  fallback: readonly string[] = [],
): T[] {
  const usable = symbols.filter((s) => s.deck !== false);
  const inTheme = usable.filter((s) => primary.includes(s.theme));
  const rest = usable.filter((s) => fallback.includes(s.theme));
  if (inTheme.length + rest.length < v) throw new Error(`Need ${v} symbols, have ${inTheme.length + rest.length}`);
  const rng = mulberry32(seed);
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
  7: { g: 3, cells: [[0.5, 0], [1.5, 0], [0, 1], [1, 1], [2, 1], [0.5, 2], [1.5, 2]] },
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
  13: { g: 4, cells: [...ring(4), [1.5, 1.5]] },
};

/** The card sizes the deck maker can lay out: k for each deck in DECKS. */
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

/**
 * Parse "?deck=b37&theme=vehicles&size=small" into deck settings, with
 * defaults. Older links name a planar deck by its order, as "?q=7".
 */
export function parseDeckParams(search: string): {
  deck: string;
  theme: DeckTheme;
  size: PrintSize;
} {
  const p = new URLSearchParams(search);
  const q = Number(p.get('q'));
  return {
    deck: DECKS.some((d) => d.id === p.get('deck'))
      ? p.get('deck')!
      : (DECK_Q as readonly number[]).includes(q)
        ? `q${q}`
        : 'q7',
    theme: (Object.keys(DECK_THEMES) as string[]).includes(p.get('theme') ?? '') ? (p.get('theme') as DeckTheme) : 'all',
    size: (Object.keys(PRINT_SIZES) as string[]).includes(p.get('size') ?? '') ? (p.get('size') as PrintSize) : 'medium',
  };
}
