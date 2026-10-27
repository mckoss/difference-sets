import { describe, expect, it } from 'vitest';
import manifest from '../../public/symbols/manifest.json';
import { assignSymbols, checkDeck, DECK_Q, layoutCard, makeDeck, parseDeckParams, shared } from '../../src/math/deck';

describe('match-one decks', () => {
  for (const q of DECK_Q) {
    it(`q = ${q}: ${q * q + q + 1} cards, every pair shares exactly one symbol`, () => {
      const deck = makeDeck(q);
      expect(deck.cards).toHaveLength(deck.v);
      expect(deck.cards.every((c) => c.length === q + 1)).toBe(true);
      const check = checkDeck(deck.cards, deck.v);
      expect(check.pairs).toBe((deck.v * (deck.v - 1)) / 2);
      expect(check.bad).toEqual([]);
      expect(new Set(check.appearances)).toEqual(new Set([q + 1]));
    });
  }

  it('finds the shared symbol', () => {
    const { cards } = makeDeck(2);
    expect(shared(cards[0], cards[1])).toHaveLength(1);
    expect(shared([0, 1, 3], [1, 2, 4])).toEqual([1]);
  });

  it('flags a broken deck', () => {
    expect(checkDeck([[0, 1, 2], [1, 2, 3], [4, 5, 6]], 7).bad).toEqual([[0, 1], [0, 2], [1, 2]]);
  });
});

describe('symbols', () => {
  it('has 150 symbols, each with a file, 27 of them vehicles', () => {
    expect(manifest).toHaveLength(150);
    expect(new Set(manifest.map((s) => s.file)).size).toBe(150);
    expect(manifest.filter((s) => s.theme === 'vehicle')).toHaveLength(27);
  });

  it('assigns distinct symbols, theme first, reproducibly', () => {
    const a = assignSymbols(manifest, 21, 42, 'vehicle');
    expect(new Set(a.map((s) => s.slug)).size).toBe(21);
    expect(a.every((s) => s.theme === 'vehicle')).toBe(true);
    expect(assignSymbols(manifest, 21, 42, 'vehicle')).toEqual(a);
    expect(assignSymbols(manifest, 21, 43, 'vehicle')).not.toEqual(a);
    const big = assignSymbols(manifest, 57, 1, 'vehicle');
    expect(big.filter((s) => s.theme === 'vehicle')).toHaveLength(27);
    expect(new Set(assignSymbols(manifest, 133, 7).map((s) => s.slug)).size).toBe(133);
  });
});

describe('card layout', () => {
  for (const n of [3, 4, 5, 6, 8, 9, 10, 12]) {
    it(`${n} symbols fit on the card without overlap`, () => {
      for (let seed = 0; seed < 25; seed++) {
        const ps = layoutCard(n, seed);
        expect(ps).toHaveLength(n);
        for (const p of ps) expect(Math.hypot(p.x - 0.5, p.y - 0.5) + p.r).toBeLessThanOrEqual(0.47 + 1e-9);
        for (let i = 0; i < n; i++)
          for (let j = i + 1; j < n; j++)
            expect(Math.hypot(ps[i].x - ps[j].x, ps[i].y - ps[j].y)).toBeGreaterThanOrEqual(ps[i].r + ps[j].r);
        expect(layoutCard(n, seed)).toEqual(ps);
      }
    });
  }
});

describe('URL parameters', () => {
  it('reads q, theme, and seed with defaults', () => {
    expect(parseDeckParams('?q=3&theme=vehicles&seed=12')).toEqual({ q: 3, theme: 'vehicles', seed: 12 });
    expect(parseDeckParams('?q=6&theme=x&seed=-1')).toEqual({ q: 7, theme: 'all', seed: null });
    expect(parseDeckParams('')).toEqual({ q: 7, theme: 'all', seed: null });
  });
});
