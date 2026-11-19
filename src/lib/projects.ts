import { getCollection, type CollectionEntry } from 'astro:content';

export type ProjectEntry = CollectionEntry<'projects'>;

export async function getProjects(): Promise<ProjectEntry[]> {
  const all = await getCollection('projects');
  return all.sort((a, b) => a.data.order - b.data.order);
}

/** Wraps around so the last project links back to the first. */
export function nextProject(all: ProjectEntry[], id: string): ProjectEntry {
  const i = all.findIndex((p) => p.id === id);
  if (i === -1) throw new Error(`Unknown project: ${id}`);
  const next = all[(i + 1) % all.length];
  if (!next) throw new Error('No projects');
  return next;
}
