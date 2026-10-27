// A match-one card deck from a planar difference set: points are symbols,
// lines are cards. With D a (v, q + 1, 1) difference set mod v = q² + q + 1,
// card j holds the symbols at the points D + j, so every two cards share
// exactly one symbol and every two symbols appear together on one card.

import { mod } from './numbers';
import { mulberry32, type Rng, shuffled } from './random';
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
  /** Center, as a fraction of the card's diameter (0…1, card center at 0.5). */
  x: number;
  y: number;
  /** Radius of the symbol's circle, as a fraction of the card's diameter. */
  r: number;
  /** Rotation in degrees. */
  rotate: number;
}

const overlaps = (a: Placement, b: Placement, gap: number) =>
  Math.hypot(a.x - b.x, a.y - b.y) < a.r + b.r + gap;

/**
 * Place n symbol circles on a round card without overlap, at varied sizes and
 * rotations, deterministically from the seed. Symbols are placed largest
 * first by rejection sampling; a symbol that cannot fit shrinks and retries.
 */
export function layoutCard(n: number, seed: number): Placement[] {
  const rng: Rng = mulberry32(seed);
  const R = 0.47; // usable radius inside the card's rim
  const gap = 0.012;
  // Symbols fill a little over half the card on average.
  const base = R * Math.sqrt(0.6 / n);
  const sizes = Array.from({ length: n }, () => base * (0.75 + 0.5 * rng())).sort((a, b) => b - a);
  const placed: Placement[] = [];
  for (let s of sizes) {
    for (let attempt = 0; ; attempt++) {
      const ring = R - s;
      const t = 2 * Math.PI * rng();
      const d = ring * Math.sqrt(rng());
      const p: Placement = { x: 0.5 + d * Math.cos(t), y: 0.5 + d * Math.sin(t), r: s, rotate: Math.round(rng() * 360) };
      if (!placed.some((o) => overlaps(o, p, gap))) {
        placed.push(p);
        break;
      }
      if (attempt % 300 === 299) s *= 0.92;
    }
  }
  return shuffled(placed, rng);
}

/** Parse "?q=7&theme=vehicles&seed=123" into deck settings, with defaults. */
export function parseDeckParams(search: string): { q: number; theme: 'all' | 'vehicles'; seed: number | null } {
  const p = new URLSearchParams(search);
  const q = Number(p.get('q'));
  const seed = Number(p.get('seed'));
  return {
    q: (DECK_Q as readonly number[]).includes(q) ? q : 7,
    theme: p.get('theme') === 'vehicles' ? 'vehicles' : 'all',
    seed: p.get('seed') !== null && Number.isInteger(seed) && seed >= 0 ? seed : null,
  };
}
