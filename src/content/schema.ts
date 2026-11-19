import { z } from 'astro/zod';

/**
 * Media is either explicitly pending (renders a placeholder) or ready
 * (must point at a real file under /public). There is no third state:
 * a half-filled video entry fails the build instead of rendering broken.
 */
export const mediaSchema = z.discriminatedUnion('status', [
  z.object({
    status: z.literal('pending'),
  }),
  z.object({
    status: z.literal('ready'),
    /** Path relative to /public, e.g. "media/surgical-ar/demo.mp4". No leading slash. */
    src: z.string().regex(/^media\/[a-z0-9\-/]+\.(mp4|webm|png|jpg|jpeg|webp|svg)$/),
    /** Optional poster image, same path rules. */
    poster: z
      .string()
      .regex(/^media\/[a-z0-9\-/]+\.(png|jpg|jpeg|webp)$/)
      .optional(),
    /** Describes what the media shows, for screen readers. */
    alt: z.string().min(10),
  }),
]);

/** "YYYY-MM" */
const month = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/);

export const projectSchema = z
  .object({
    title: z.string().min(2).max(48),
    /** One sentence shown on tiles and under the page title. */
    summary: z.string().min(20).max(140),
    org: z.string().min(2),
    role: z.string().min(2),
    start: month,
    /** null = ongoing */
    end: month.nullable(),
    /** Lower comes first. Must be unique across projects. */
    order: z.number().int().nonnegative(),
    /** Featured projects get large tiles on the home page. */
    featured: z.boolean(),
    stack: z.array(z.string().min(1)).min(1).max(10),
    /** Concrete outcomes, one sentence each. */
    highlights: z.array(z.string().min(10)).min(1).max(5),
    video: mediaSchema,
    diagram: mediaSchema,
  })
  .refine((p) => p.end === null || p.end >= p.start, {
    message: 'end must not be before start',
    path: ['end'],
  });

export type Project = z.infer<typeof projectSchema>;
export type Media = z.infer<typeof mediaSchema>;
