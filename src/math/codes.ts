// Difference-set cyclic codes (Weldon 1966) and their majority-logic decoder.
//
// The bit positions 0 … v − 1 are the points of a cyclic projective plane
// whose lines are the translates D + t of a planar difference set D. Each line
// is a parity check: a word is a codeword when every line holds an even number
// of 1s. Because two lines through a point share nothing else (λ = 1), the
// n + 1 checks through a bit vote independently on whether that bit is wrong.

import { translate } from './difference';
import { mod } from './numbers';

export type Word = number[];

/** The v lines D + 0, …, D + (v − 1), each a sorted list of positions. */
export function lines(set: readonly number[], v: number): number[][] {
  return Array.from({ length: v }, (_, t) => translate(set, t, v));
}

/** The shifts t for which bit j lies on the line D + t, namely t = j − d for d in D. */
export function checksThrough(j: number, set: readonly number[], v: number): number[] {
  return set.map((d) => mod(j - d, v)).sort((a, b) => a - b);
}

/** The parity (XOR, addition mod 2) of the bits of `word` at `positions`. */
export function parity(word: readonly number[], positions: readonly number[]): number {
  let s = 0;
  for (const i of positions) s ^= word[i] & 1;
  return s;
}

/** The parity of every line: 0 when the check passes, 1 when it fails. */
export function syndrome(word: readonly number[], set: readonly number[], v: number): number[] {
  return lines(set, v).map((line) => parity(word, line));
}

export const isCodeword = (word: readonly number[], set: readonly number[], v: number) =>
  syndrome(word, set, v).every((s) => s === 0);

/** Reduced row echelon form over GF(2): the independent rows and their pivot columns. */
function echelon(rows: readonly (readonly number[])[], n: number): { rows: Uint8Array[]; pivots: number[] } {
  const m = rows.map((r) => Uint8Array.from(r));
  const pivots: number[] = [];
  let r = 0;
  for (let c = 0; c < n && r < m.length; c++) {
    let p = r;
    while (p < m.length && m[p][c] === 0) p++;
    if (p === m.length) continue;
    [m[r], m[p]] = [m[p], m[r]];
    for (let i = 0; i < m.length; i++) {
      if (i !== r && m[i][c] === 1) {
        const a = m[i];
        const b = m[r];
        for (let x = c; x < n; x++) a[x] ^= b[x];
      }
    }
    pivots.push(c);
    r++;
  }
  return { rows: m.slice(0, r), pivots };
}

/** The rank over GF(2) of a 0/1 matrix with n columns. */
export const rankGF2 = (rows: readonly (readonly number[])[], n: number) => echelon(rows, n).pivots.length;

/** The v × v line-incidence matrix: row t has 1s at the positions of D + t. */
export function incidenceMatrix(set: readonly number[], v: number): number[][] {
  return lines(set, v).map((line) => {
    const row = new Array<number>(v).fill(0);
    for (const i of line) row[i] = 1;
    return row;
  });
}

/** A basis of the code: every word that passes all v line checks. */
export function codeBasis(set: readonly number[], v: number): Word[] {
  const { rows, pivots } = echelon(incidenceMatrix(set, v), v);
  const isPivot = new Set(pivots);
  const basis: Word[] = [];
  for (let f = 0; f < v; f++) {
    if (isPivot.has(f)) continue;
    const w = new Array<number>(v).fill(0);
    w[f] = 1;
    rows.forEach((row, r) => {
      if (row[f]) w[pivots[r]] = 1;
    });
    basis.push(w);
  }
  return basis;
}

export interface CodeParams {
  /** Code length: the number of points, v. */
  length: number;
  /** Independent parity checks: the GF(2) rank of the incidence matrix. */
  parityBits: number;
  /** Free bits per codeword: length − parityBits. */
  messageBits: number;
  /** Checks through each bit: the number of lines through a point, n + 1 = |D|. */
  checksPerBit: number;
  /** Errors the one-step majority vote always fixes: (n + 1)/2 rounded down. */
  corrects: number;
}

export function codeParams(set: readonly number[], v: number): CodeParams {
  const parityBits = rankGF2(incidenceMatrix(set, v), v);
  return {
    length: v,
    parityBits,
    messageBits: v - parityBits,
    checksPerBit: set.length,
    corrects: Math.floor(set.length / 2),
  };
}

/** The sum (XOR) of the basis words picked out by the bits of `message`. */
export function encode(message: readonly number[], basis: readonly Word[]): Word {
  const v = basis[0]?.length ?? 0;
  const w = new Array<number>(v).fill(0);
  message.forEach((bit, i) => {
    if (bit) basis[i].forEach((b, x) => (w[x] ^= b));
  });
  return w;
}

/** The smallest number of 1s in a nonzero codeword, by trying all 2^(message bits) codewords. */
export function minimumDistance(basis: readonly Word[]): number {
  const dim = basis.length;
  if (dim > 20) throw new Error('Too many codewords to enumerate');
  const v = basis[0].length;
  // Gray code order: each step XORs in one basis word.
  const w = new Array<number>(v).fill(0);
  let weight = 0;
  let best = Infinity;
  for (let g = 1; g < 2 ** dim; g++) {
    const i = 31 - Math.clz32(g & -g);
    for (let x = 0; x < v; x++) {
      if (basis[i][x]) {
        weight += w[x] ? -1 : 1;
        w[x] ^= 1;
      }
    }
    best = Math.min(best, weight);
  }
  return best;
}

export interface BitVote {
  /** The shifts t of the lines D + t through this bit. */
  checks: number[];
  /** How many of those checks fail. */
  failing: number;
  /** True when more than half fail, so the vote flips the bit. */
  flip: boolean;
}

/** Every bit's vote, all taken from the same received word. */
export function votes(word: readonly number[], set: readonly number[], v: number): BitVote[] {
  const s = syndrome(word, set, v);
  return Array.from({ length: v }, (_, j) => {
    const checks = checksThrough(j, set, v);
    const failing = checks.filter((t) => s[t] === 1).length;
    return { checks, failing, flip: 2 * failing > checks.length };
  });
}

/** One-step majority-logic decoding: flip every bit that more than half of its checks blame. */
export function majorityDecode(word: readonly number[], set: readonly number[], v: number): { word: Word; flipped: number[] } {
  const vs = votes(word, set, v);
  const flipped = vs.flatMap((b, j) => (b.flip ? [j] : []));
  const out = [...word];
  for (const j of flipped) out[j] ^= 1;
  return { word: out, flipped };
}
