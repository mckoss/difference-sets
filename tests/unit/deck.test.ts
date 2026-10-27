import { describe, expect, it } from 'vitest';
import manifest from '../../public/symbols/manifest.json';
import { assignSymbols, checkDeck, DECKS, layoutCard, makeDeck, parseDeckParams, PRINT_SIZES, SLOT_COUNTS, shared } from '../../src/math/deck';

describe('match-N decks', () => {
  for (const { id, v, k, lambda } of DECKS) {
    it(`${id}: ${v} cards of ${k}, every pair shares exactly ${lambda}`, () => {
      const deck = makeDeck(id);
      expect(deck.set).toHaveLength(k);
      expect(k * (k - 1)).toBe(lambda * (v - 1));
      expect(deck.cards).toHaveLength(v);
      expect(deck.cards.every((c) => c.length === k)).toBe(true);
      const check = checkDeck(deck.cards, deck.v, lambda);
      expect(check.pairs).toBe((v * (v - 1)) / 2);
      expect(check.bad).toEqual([]);
      expect(new Set(check.appearances)).toEqual(new Set([k]));
    });
  }

  it('offers match 1 through match 4, including the three known cyclic biplanes', () => {
    expect([...new Set(DECKS.map((d) => d.lambda))]).toEqual([1, 2, 3, 4]);
    expect(DECKS.filter((d) => d.lambda === 2).map((d) => [d.v, d.k])).toEqual([[7, 4], [11, 5], [37, 9]]);
    expect(makeDeck('b11').set).toEqual([1, 3, 4, 5, 9]);
  });

  it('finds the shared symbol', () => {
    const { cards } = makeDeck('q2');
    expect(shared(cards[0], cards[1])).toHaveLength(1);
    expect(shared([0, 1, 3], [1, 2, 4])).toEqual([1]);
  });

  it('flags a broken deck', () => {
    expect(checkDeck([[0, 1, 2], [1, 2, 3], [4, 5, 6]], 7).bad).toEqual([[0, 1], [0, 2], [1, 2]]);
  });
});

describe('symbols', () => {
  it('has 155 symbols, each with a file, 32 of them vehicles', () => {
    expect(manifest).toHaveLength(155);
    expect(new Set(manifest.map((s) => s.file)).size).toBe(155);
    expect(manifest.filter((s) => s.theme === 'vehicle')).toHaveLength(32);
  });

  it('assigns distinct symbols, theme first, reproducibly', () => {
    const a = assignSymbols(manifest, 21, 42, ['vehicle'], ['other']);
    expect(new Set(a.map((s) => s.slug)).size).toBe(21);
    expect(a.every((s) => s.theme === 'vehicle')).toBe(true);
    expect(assignSymbols(manifest, 21, 42, ['vehicle'], ['other'])).toEqual(a);
    expect(assignSymbols(manifest, 21, 43, ['vehicle'], ['other'])).not.toEqual(a);
    const big = assignSymbols(manifest, 57, 1, ['vehicle'], ['other']);
    expect(big.filter((s) => s.theme === 'vehicle')).toHaveLength(32);
    // A q = 5 deck (31 cards, 6 per card) can be all vehicles.
    expect(assignSymbols(manifest, 31, 1, ['vehicle']).every((s) => s.theme === 'vehicle')).toBe(true);
    expect(new Set(assignSymbols(manifest, 133, 7, ['other', 'vehicle']).map((s) => s.slug)).size).toBe(133);
  });
});

describe('card layout', () => {
  it('has a layout for every deck size', () => {
    expect(SLOT_COUNTS).toEqual([...new Set(DECKS.map((d) => d.k))].sort((a, b) => a - b));
  });

  for (const n of SLOT_COUNTS) {
    it(`${n} equal squares fit on the card without overlap, symmetric about the center`, () => {
      const ps = layoutCard(n);
      expect(ps).toHaveLength(n);
      const size = ps[0].size;
      for (const p of ps) {
        expect(p.size).toBe(size);
        expect(p.x).toBeGreaterThanOrEqual(0);
        expect(p.y).toBeGreaterThanOrEqual(0);
        expect(p.x + p.size).toBeLessThanOrEqual(1 + 1e-9);
        expect(p.y + p.size).toBeLessThanOrEqual(1 + 1e-9);
      }
      for (let i = 0; i < n; i++)
        for (let j = i + 1; j < n; j++) {
          const apart = Math.abs(ps[i].x - ps[j].x) >= size - 1e-9 || Math.abs(ps[i].y - ps[j].y) >= size - 1e-9;
          expect(apart).toBe(true);
        }
      // Left-right mirror symmetry: each slot's mirror image is also a slot.
      const key = (x: number, y: number) => `${x.toFixed(6)},${y.toFixed(6)}`;
      const keys = new Set(ps.map((p) => key(p.x, p.y)));
      for (const p of ps) expect(keys.has(key(1 - p.x - size, p.y))).toBe(true);
    });
  }

  it('puts each symbol in each slot exactly once across the deck', () => {
    for (const { id } of DECKS) {
      const { v, k, cards } = makeDeck(id);
      const slots = Array.from({ length: v }, () => new Set<number>());
      for (const c of cards) c.forEach((p, i) => slots[p].add(i));
      for (const s of slots) expect(s.size).toBe(k);
    }
  });
});

describe('print sizes', () => {
  // Printable area shared by US Letter and A4 with 10 mm margins.
  for (const [name, { mm, cols, rows }] of Object.entries(PRINT_SIZES)) {
    it(`${name} pages fit on Letter and A4`, () => {
      expect(cols * mm + 0.25).toBeLessThanOrEqual(190);
      expect(rows * mm + 0.25).toBeLessThanOrEqual(259);
    });
  }
});

describe('URL parameters', () => {
  it('reads deck, theme, and size with defaults, accepting old q= links and ignoring an old seed', () => {
    expect(parseDeckParams('?q=3&theme=vehicles&seed=12')).toEqual({ deck: 'q3', theme: 'vehicles', size: 'medium' });
    expect(parseDeckParams('?q=6&theme=x&seed=-1')).toEqual({ deck: 'q7', theme: 'all', size: 'medium' });
    expect(parseDeckParams('')).toEqual({ deck: 'q7', theme: 'all', size: 'medium' });
    expect(parseDeckParams('?deck=b37&q=3').deck).toBe('b37');
    expect(parseDeckParams('?deck=zz').deck).toBe('q7');
    expect(parseDeckParams('?size=small').size).toBe('small');
    expect(parseDeckParams('?size=huge').size).toBe('medium');
  });
});
