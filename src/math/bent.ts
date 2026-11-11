// Boolean functions on n-bit inputs, bent functions, and difference sets in
// the group of n-bit strings under XOR (Lesson 29).
//
// An input x is an n-bit number. Bit x1 is the most significant bit, so the
// input written 0110 has x1 = 0, x2 = 1, x3 = 1, x4 = 0. A function f is its
// truth table: f[x] is 0 or 1 for x = 0 … 2^n − 1.

export type TruthTable = readonly number[];

/** Bit x_i of the n-bit input x (i = 1 … n, x1 the leftmost). */
export function bit(x: number, i: number, n: number): number {
  return (x >> (n - i)) & 1;
}

/** The input x written as n bits, x1 first: bits(6, 4) = '0110'. */
export function bits(x: number, n: number): string {
  return x.toString(2).padStart(n, '0');
}

/** The parity of the bits of x: 1 when x has an odd number of 1s. */
export function parity(x: number): number {
  let p = 0;
  for (let y = x; y; y &= y - 1) p ^= 1;
  return p;
}

/** The linear rule a·x: the XOR of the bits x_i with a_i = 1. */
export function dot(a: number, x: number): number {
  return parity(a & x);
}

/** The rule a·x written out, e.g. 'x1 ⊕ x3'; the empty rule (a = 0) is '0'. */
export function ruleName(a: number, n: number): string {
  const terms: string[] = [];
  for (let i = 1; i <= n; i++) if (bit(a, i, n)) terms.push(`x${i}`);
  return terms.length ? terms.join(' ⊕ ') : '0';
}

/** The support {x : f(x) = 1}, in increasing order. */
export function support(f: TruthTable): number[] {
  const out: number[] = [];
  f.forEach((y, x) => {
    if (y) out.push(x);
  });
  return out;
}

/** The truth table of length 2^n whose support is `set`. */
export function fromSupport(set: readonly number[], n: number): number[] {
  const f = new Array<number>(1 << n).fill(0);
  for (const x of set) f[x] = 1;
  return f;
}

/** The truth table of a rule given as a function of the bits x1 … xn. */
export function fromRule(n: number, rule: (x: number[]) => number): number[] {
  return Array.from({ length: 1 << n }, (_, x) => rule(Array.from({ length: n }, (_, i) => bit(x, i + 1, n))) & 1);
}

/**
 * counts[a] = the number of ordered pairs (x, y) of members of D with
 * x ⊕ y = a, which is also |D ∩ (D ⊕ a)|. counts[0] is 0.
 */
export function xorDifferenceCounts(set: readonly number[], n: number): number[] {
  const counts = new Array<number>(1 << n).fill(0);
  for (const x of set) for (const y of set) if (x !== y) counts[x ^ y]++;
  return counts;
}

/** λ when every nonzero a occurs λ times as x ⊕ y in D, otherwise null. */
export function xorDifferenceSetLambda(set: readonly number[], n: number): number | null {
  const counts = xorDifferenceCounts(set, n);
  for (let a = 2; a < counts.length; a++) if (counts[a] !== counts[1]) return null;
  return counts[1];
}

/**
 * The Walsh values W(a) = Σ_x (−1)^(f(x) ⊕ a·x): the number of inputs where f
 * agrees with the rule a·x, minus the number where it disagrees.
 */
export function walsh(f: TruthTable): number[] {
  return f.map((_, a) => f.reduce((s, y, x) => s + (y ^ dot(a, x) ? -1 : 1), 0));
}

/** For each a, the number of the 2^n inputs on which f(x) = a·x. */
export function agreements(f: TruthTable): number[] {
  return walsh(f).map((w) => (f.length + w) / 2);
}

/** The fewest inputs on which f differs from some affine rule a·x or a·x ⊕ 1. */
export function nonlinearity(f: TruthTable): number {
  return f.length / 2 - Math.max(...walsh(f).map(Math.abs)) / 2;
}

/** f is bent when every Walsh value is ±2^(n/2). */
export function isBent(f: TruthTable): boolean {
  const s = Math.sqrt(f.length);
  return Number.isInteger(s) && walsh(f).every((w) => Math.abs(w) === s);
}

export interface BestRule {
  /** The linear part a. */
  a: number;
  /** True for the rule a·x ⊕ 1 (f mostly disagrees with a·x). */
  flipped: boolean;
  /** How many inputs the rule matches f on. */
  matches: number;
  /** The rule written out, e.g. 'x1 ⊕ x3 ⊕ 1'. */
  name: string;
}

/** The affine rule a·x or a·x ⊕ 1 that matches f on the most inputs (first such a on ties). */
export function bestAffineRule(f: TruthTable): BestRule {
  const n = Math.log2(f.length);
  const w = walsh(f);
  let a = 0;
  for (let b = 1; b < w.length; b++) if (Math.abs(w[b]) > Math.abs(w[a])) a = b;
  const flipped = w[a] < 0;
  const matches = (f.length + Math.abs(w[a])) / 2;
  const base = ruleName(a, n);
  const name = flipped ? (a === 0 ? '1' : `${base} ⊕ 1`) : base;
  return { a, flipped, matches, name };
}

export interface BentPreset {
  id: string;
  label: string;
  f: number[];
}

const N = 4;

/** At least three of the four bits are 1. */
const majority = (x: number[]) => (x.reduce((s, b) => s + b, 0) >= 3 ? 1 : 0);

export const BENT_PRESETS: BentPreset[] = [
  { id: 'x1x2+x3x4', label: 'x1x2 ⊕ x3x4 (bent)', f: fromRule(N, ([a, b, c, d]) => (a & b) ^ (c & d)) },
  { id: 'x1x4+x2x3+1', label: 'x1x4 ⊕ x2x3 ⊕ 1 (bent)', f: fromRule(N, ([a, b, c, d]) => (a & d) ^ (b & c) ^ 1) },
  { id: 'x1+x3', label: 'x1 ⊕ x3 (linear)', f: fromRule(N, ([a, , c]) => a ^ c) },
  { id: 'majority', label: 'at least three 1s (majority-like)', f: fromRule(N, majority) },
];

/** A random truth table on n bits. */
export function randomFunction(n: number, rng: () => number): number[] {
  return Array.from({ length: 1 << n }, () => (rng() < 0.5 ? 1 : 0));
}
