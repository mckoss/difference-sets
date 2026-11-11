// The site's table of contents: lesson parts, playgrounds, and the helpers
// that turn lesson frontmatter into the numbered sidebar outline.

export type Status = 'planned' | 'draft' | 'ready';

export interface Part {
  part: number;
  numeral: string;
  title: string;
}

export interface LessonEntry {
  id: string;
  title: string;
  order: number;
  part: number;
  summary: string;
  status: Status;
}

export interface Playground {
  slug: string;
  title: string;
  summary: string;
}

export const PARTS: Part[] = [
  { part: 1, numeral: 'I', title: 'The puzzle' },
  { part: 2, numeral: 'II', title: 'Projective planes' },
  { part: 3, numeral: 'III', title: 'Finite fields' },
  { part: 4, numeral: 'IV', title: 'Planes from fields' },
  { part: 5, numeral: 'V', title: "Singer's algorithm" },
  { part: 6, numeral: 'VI', title: 'The frontier' },
  { part: 7, numeral: 'VII', title: 'Applications' },
];

export const PLAYGROUNDS: Playground[] = [
  {
    slug: 'difference-workbench',
    title: 'Difference set workbench',
    summary: 'Build a set on a clock of any size and watch its differences, translates, and verdict.',
  },
  {
    slug: 'singer-stepper',
    title: 'Singer construction stepper',
    summary: 'Build a Singer difference set one power of α at a time: compute each trace and keep the zeros.',
  },
  {
    slug: 'singer-classes',
    title: 'Singer classes gallery',
    summary: 'Every distinct Singer difference set for a chosen q, drawn as chord diagrams.',
  },
  {
    slug: 'search-vs-construction',
    title: 'Search versus construction',
    summary: 'Search every planar difference set of a small order and check each one against the Singer sets.',
  },
  {
    slug: 'explorer',
    title: 'Large-q explorer',
    summary: 'A Singer difference set for any prime power q up to 1024, drawn, checked, and ready to download.',
  },
  {
    slug: 'deck-maker',
    title: 'Match deck maker',
    summary: 'Deal a deck of picture cards in which every two cards share exactly one symbol (or 2, 3, or 4), then play or print it.',
  },
  {
    slug: 'field-calculator',
    title: 'Finite field calculator',
    summary: 'Clock arithmetic ℤ/vℤ and the fields GF(pᵉ): tables, inverses, powers, logs, and isomorphisms.',
  },
  {
    slug: 'pg2-explorer',
    title: 'PG(2, q) explorer',
    summary: 'The projective plane over GF(q): coordinates, lines by dot product, and the Singer numbering by powers of α.',
  },
];

/**
 * Lessons whose address changed when Lessons 4, 17, and 24 were each split in
 * two (v0.18.0) and Lesson 2 was renamed. Each old address still answers, with
 * a page that sends the reader on to the new one.
 */
export const MOVED_LESSONS: Readonly<Record<string, string>> = {
  '02-rotations': '02-translates',
  '05-which-clocks-are-fields': '06-which-clocks-are-fields',
  '06-fields-of-prime-order': '07-fields-of-prime-order',
  '07-prime-power-fields': '08-prime-power-fields',
  '08-primitive-elements': '09-primitive-elements',
  '09-fields-inside-fields': '10-fields-inside-fields',
  '10-vectors-over-a-finite-field': '11-vectors-over-a-finite-field',
  '11-coordinates': '12-coordinates',
  '12-field-inside-the-plane': '13-field-inside-the-plane',
  '13-singer-cycle': '14-singer-cycle',
  '14-writing-down-a-difference-set': '15-writing-down-a-difference-set',
  '15-many-sets-few-shapes': '16-many-sets-few-shapes',
  '16-beyond-the-plane': '17-beyond-the-plane',
  '17-every-planar-set-singer': '18-every-planar-set-singer',
  '18-a-card-game-from-a-plane': '20-a-card-game-from-a-plane',
  '19-pictures-without-a-lens': '21-pictures-without-a-lens',
  '20-finding-an-echo': '22-finding-an-echo',
  '21-majority-rules': '23-majority-rules',
  '22-always-meet': '24-always-meet',
  '23-a-ruler-with-no-repeats': '25-a-ruler-with-no-repeats',
  '24-a-fair-race': '26-a-fair-race',
  '25-rebuilding-a-disk': '28-rebuilding-a-disk',
  '26-secrets-that-look-like-noise': '29-secrets-that-look-like-noise',
};

export interface OutlinePart extends Part {
  lessons: LessonEntry[];
}

/** Lessons sorted by order, after checking that they number 1…n without gaps or repeats. */
export function sortLessons(lessons: readonly LessonEntry[]): LessonEntry[] {
  const sorted = [...lessons].sort((a, b) => a.order - b.order);
  sorted.forEach((lesson, i) => {
    if (lesson.order !== i + 1) {
      throw new Error(`Lesson "${lesson.id}" has order ${lesson.order}; expected ${i + 1}`);
    }
    if (!PARTS.some((p) => p.part === lesson.part)) {
      throw new Error(`Lesson "${lesson.id}" names unknown part ${lesson.part}`);
    }
  });
  return sorted;
}

/** Group lessons under their parts, in order; parts without lessons are dropped. */
export function buildOutline(lessons: readonly LessonEntry[]): OutlinePart[] {
  const sorted = sortLessons(lessons);
  return PARTS.map((p) => ({ ...p, lessons: sorted.filter((l) => l.part === p.part) })).filter(
    (p) => p.lessons.length > 0,
  );
}

export function neighbors(
  lessons: readonly LessonEntry[],
  id: string,
): { prev?: LessonEntry; next?: LessonEntry } {
  const sorted = sortLessons(lessons);
  const i = sorted.findIndex((l) => l.id === id);
  if (i < 0) throw new Error(`Unknown lesson "${id}"`);
  return { prev: sorted[i - 1], next: sorted[i + 1] };
}

/** Join a site-relative path onto the deploy base, keeping trailing slashes. */
export function href(base: string, path = ''): string {
  const root = base.endsWith('/') ? base : `${base}/`;
  return root + path.replace(/^\//, '');
}

export const lessonPath = (id: string) => `lessons/${id}/`;
export const playgroundPath = (slug: string) => `playgrounds/${slug}/`;
