// The incidence structure whose points are ℤ/vℤ and whose lines are the
// translates D + j of a set D. When D is a planar difference set this is a
// cyclic projective plane (Lesson 4); for D = {0, 1, 3} and v = 7 it is the
// Fano plane (Lesson 3).

import { allTranslates, intersection } from './difference';

export interface Incidence {
  /** Points are 0 … v − 1. */
  v: number;
  /** Each line is a sorted list of points. */
  lines: number[][];
}

/** Points ℤ/vℤ, with line j = D + j. */
export function cyclicPlane(set: readonly number[], v: number): Incidence {
  return { v, lines: allTranslates(set, v) };
}

/** Indices of the lines that contain every one of `points`. */
export function linesThrough(plane: Incidence, ...points: number[]): number[] {
  return plane.lines.flatMap((line, j) => (points.every((p) => line.includes(p)) ? [j] : []));
}

/** The points shared by lines i and j. */
export function meet(plane: Incidence, i: number, j: number): number[] {
  return intersection(plane.lines[i], plane.lines[j]);
}

/**
 * Check the projective plane axioms: every two points lie on exactly one
 * line, every two lines meet in exactly one point, and some four points
 * have no three on a line. Returns the order n (lines have n + 1 points)
 * or null.
 */
export function projectivePlaneOrder(plane: Incidence): number | null {
  const { v, lines } = plane;
  for (let a = 0; a < v; a++) {
    for (let b = a + 1; b < v; b++) if (linesThrough(plane, a, b).length !== 1) return null;
  }
  for (let i = 0; i < lines.length; i++) {
    for (let j = i + 1; j < lines.length; j++) if (meet(plane, i, j).length !== 1) return null;
  }
  if (!hasQuadrangle(plane)) return null;
  return lines[0].length - 1;
}

function hasQuadrangle({ v, lines }: Incidence): boolean {
  const collinear = (a: number, b: number, c: number) =>
    lines.some((l) => l.includes(a) && l.includes(b) && l.includes(c));
  for (let a = 0; a < v; a++)
    for (let b = a + 1; b < v; b++)
      for (let c = b + 1; c < v; c++) {
        if (collinear(a, b, c)) continue;
        for (let d = c + 1; d < v; d++) {
          if (!collinear(a, b, d) && !collinear(a, c, d) && !collinear(b, c, d)) return true;
        }
      }
  return false;
}
