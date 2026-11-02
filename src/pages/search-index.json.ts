// The topic search index, fetched by the sidebar search box on first use.

import { getCollection } from 'astro:content';
import { GLOSSARY, termSlug } from '../glossary';
import { lessonSections, type SearchEntry } from '../lib/searchIndex';
import { lessonPath, PLAYGROUNDS, playgroundPath, sortLessons } from '../site';

export async function GET() {
  const lessons = await getCollection('lessons');
  const byId = new Map(lessons.map((l) => [l.id, l]));
  const entries: SearchEntry[] = [];
  for (const l of sortLessons(lessons.map((l) => ({ id: l.id, ...l.data })))) {
    const html = byId.get(l.id)?.rendered?.html ?? '';
    entries.push(...lessonSections(html, { order: l.order, title: l.title, path: lessonPath(l.id) }));
  }
  for (const t of GLOSSARY) {
    entries.push({ title: t.term, where: 'Glossary', href: `glossary/#${termSlug(t.term)}`, text: t.def });
  }
  for (const pg of PLAYGROUNDS) {
    entries.push({ title: pg.title, where: 'Playground', href: playgroundPath(pg.slug), text: pg.summary });
  }
  return new Response(JSON.stringify(entries), { headers: { 'Content-Type': 'application/json' } });
}
