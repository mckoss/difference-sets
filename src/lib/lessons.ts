import { getCollection } from 'astro:content';
import type { LessonEntry } from '../site';

/** All lessons as plain outline entries, read from the content collection. */
export async function lessonEntries(): Promise<LessonEntry[]> {
  const lessons = await getCollection('lessons');
  return lessons.map((l) => ({ id: l.id, ...l.data }));
}
