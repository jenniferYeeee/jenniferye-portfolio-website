import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { projectSchema, sidequestSchema } from './content/schema';

const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects' }),
  schema: projectSchema,
});

const sidequests = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/sidequests' }),
  schema: sidequestSchema,
});

export const collections = { projects, sidequests };
