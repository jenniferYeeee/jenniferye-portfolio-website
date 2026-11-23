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
    /** Optional short, small clip (a few seconds, ~1 MB) that plays on the home tile while hovered. */
    preview: z
      .string()
      .regex(/^media\/[a-z0-9\-/]+\.(mp4|webm)$/)
      .optional(),
    /** Describes what the media shows, for screen readers. */
    alt: z.string().min(10),
  }),
]);

/**
 * A project's diagram can also be left out on purpose ("none"): the page then has no
 * System design section at all, instead of a "coming soon" placeholder.
 */
export const diagramSchema = z.union([mediaSchema, z.object({ status: z.literal('none') })]);

/** "YYYY-MM" */
const month = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/);

/** An extra clip shown further down a project page, with a caption. */
export const extraVideoSchema = z.object({
  src: z.string().regex(/^media\/[a-z0-9\-/]+\.(mp4|webm)$/),
  poster: z
    .string()
    .regex(/^media\/[a-z0-9\-/]+\.(png|jpg|jpeg|webp)$/)
    .optional(),
  /** Section heading above the clip. */
  title: z.string().min(2).max(60),
  /** One or two sentences under the clip. */
  caption: z.string().min(20).max(400),
  /** Describes what the video shows, for screen readers. */
  alt: z.string().min(10),
});

/** A PDF shown in a scrollable viewer on the project page. */
export const reportSchema = z.object({
  src: z.string().regex(/^media\/[a-z0-9\-/]+\.pdf$/),
  /** Names the document for screen readers and the open-in-new-tab link. */
  title: z.string().min(5).max(120),
});

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
    diagram: diagramSchema,
    /** More clips for the project page, below the overview. */
    extras: z.array(extraVideoSchema).max(4).default([]),
    /** Optional write-up, embedded as a scrollable PDF on the project page. */
    report: reportSchema.optional(),
  })
  .refine((p) => p.end === null || p.end >= p.start, {
    message: 'end must not be before start',
    path: ['end'],
  });

export type Project = z.infer<typeof projectSchema>;
export type Media = z.infer<typeof mediaSchema>;

/**
 * A photo or video clip in a sidequest's carousel. Files live under public/media/sidequests/.
 * Videos play with controls; give them a poster so the frame isn't blank before playing.
 */
export const photoSchema = z.object({
  src: z.string().regex(/^media\/sidequests\/[a-z0-9\-/]+\.(png|jpg|jpeg|webp|mp4)$/),
  poster: z
    .string()
    .regex(/^media\/sidequests\/[a-z0-9\-/]+\.(png|jpg|jpeg|webp)$/)
    .optional(),
  /** What the photo or clip shows, for screen readers. */
  alt: z.string().min(10),
});

export const sidequestSchema = z.object({
  title: z.string().min(2).max(60),
  /** Where it happened, e.g. "NASA DAVINCI mission". */
  where: z.string().min(2),
  /** "YYYY-MM" */
  date: month,
  /** Lower comes first. Must be unique across sidequests. */
  order: z.number().int().nonnegative(),
  /** One or two sentences. */
  summary: z.string().min(20).max(280),
  /** Empty = placeholder frames until photos are added. */
  photos: z.array(photoSchema).max(12),
});

export type Sidequest = z.infer<typeof sidequestSchema>;
