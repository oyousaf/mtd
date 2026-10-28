import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      readingTime: z.number(),
      ogImage: image(),
      author: z.string(),
      tag: z.string(),
      motif: z.enum(['calendar', 'ledger', 'software', 'price', 'checklist', 'quarters', 'question', 'timeline']),
      tone: z.enum(['ink', 'navy', 'orange', 'lime', 'plaster', 'blueprint']),
    }),
});

export const collections = { blog };
