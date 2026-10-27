import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const lessons = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/lessons' }),
  schema: z.object({
    title: z.string(),
    order: z.number().int().positive(),
    part: z.number().int().positive(),
    summary: z.string(),
    status: z.enum(['planned', 'draft', 'ready']).default('planned'),
  }),
});

export const collections = { lessons };
