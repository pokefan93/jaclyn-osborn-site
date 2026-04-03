import { z } from 'zod';

const urlPattern = /^(https?:\/\/|\/)/i;

function trimString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function booleanish(value: unknown) {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'number') {
    return value === 1;
  }

  if (typeof value === 'string') {
    return ['1', 'true', 'yes', 'on'].includes(value.trim().toLowerCase());
  }

  return false;
}

function nullableNumber(value: unknown) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : value;
}

function requiredNumber(value: unknown) {
  if (value === null || value === undefined || value === '') {
    return 0;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : value;
}

const optionalUrlField = z
  .preprocess(trimString, z.string())
  .refine(
    (value) => value.length === 0 || urlPattern.test(value),
    'Use a full https:// URL or a site-relative /path.',
  );

export const adminBookInputSchema = z.object({
  title: z.preprocess(trimString, z.string().min(1, 'Title is required.').max(200)),
  seriesId: z.preprocess(nullableNumber, z.number().int().positive().nullable()),
  seriesOrder: z.preprocess(
    requiredNumber,
    z.number().min(0, 'Series order cannot be negative.').max(9999),
  ),
  publishYear: z.preprocess(
    nullableNumber,
    z.number().int().min(1900).max(2100).nullable(),
  ),
  coverImageUrl: optionalUrlField,
  coverAlt: z.preprocess(trimString, z.string().max(240)),
  shortBlurb: z.preprocess(
    trimString,
    z.string().min(1, 'Short blurb is required.').max(600),
  ),
  availabilityStatus: z.enum(['in_stock', 'limited', 'sold_out', 'preorder']),
  availabilityLabel: z.preprocess(trimString, z.string().max(120)),
  amazonLink: optionalUrlField,
  retailerLink: optionalUrlField,
  stripePaymentLink: optionalUrlField,
  displayPrice: z.preprocess(trimString, z.string().max(50)),
  signedCopy: z.preprocess(booleanish, z.boolean()),
  directFromAuthor: z.preprocess(booleanish, z.boolean()),
  visible: z.preprocess(booleanish, z.boolean()),
  sortPriority: z.preprocess(
    requiredNumber,
    z.number().int().min(-999999).max(999999),
  ),
  description: z.preprocess(trimString, z.string().max(5000)).optional(),
});

export const reorderBookSchema = z.object({
  bookId: z.preprocess(
    nullableNumber,
    z.number().int().positive('A valid book id is required.'),
  ),
  direction: z.enum(['up', 'down']),
});

export type AdminBookInput = z.infer<typeof adminBookInputSchema>;
export type ReorderBookInput = z.infer<typeof reorderBookSchema>;

export function getValidationMessage(error: z.ZodError) {
  return error.issues[0]?.message ?? 'Please check the form and try again.';
}
