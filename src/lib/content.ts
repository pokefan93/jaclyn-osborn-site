import { env } from 'cloudflare:workers';
import { z } from 'zod';
import { siteMeta, faqItems } from '../data/site';
import { customColorContrast } from './appearance';

const text = (max = 600) => z.string().trim().max(max);
const color = z.string().trim().regex(/^(?:#[0-9a-fA-F]{6})?$/, 'Choose a color or enter a six-digit hex color, such as #354434.').default('');
const https = z
  .string()
  .trim()
  .max(2000)
  .refine(
    (value) => !value || /^https:\/\/[^\s]+$/i.test(value),
    'Enter a full https:// URL.',
  );
const image = z
  .string()
  .trim()
  .max(2000)
  .refine(
    (value) =>
      /^\/(?!\/)[^\\]*$/.test(value) || /^https:\/\/[^\s]+$/i.test(value),
    'Use an image URL or a /path on this site.',
  );
export const contentSchema = z.object({
  name: text(100).min(1),
  title: text(100).min(1),
  description: text(300).min(1),
  shortTagline: text(150),
  heroTitle: text(150).min(1),
  heroCopy: text(),
  longBio: text(6000),
  authorPhoto: image,
  instagramUrl: https,
  newsletterUrl: https,
  email: z.email(),
  mediaEmail: z.email(),
  rightsEmail: z.email(),
  arcEmail: z.email(),
  directSales: z.object({
    thankYouPath: text(200).refine((value) => /^\/(?!\/)[^\\\s]*$/.test(value)),
    stripeBuyButtonPublishableKey: text(200),
    signedCopyNote: text(),
    shippingNote: text(),
    fulfillmentNote: text(),
    whereToBuyNote: text(),
  }),
  newsletterTitle: text(150),
  newsletterCopy: text(),
  featuredBookSlug: text(200),
  announcement: text(240),
  announcementUrl: https,
  booksTitle: text(150),
  booksCopy: text(),
  seriesTitle: text(150),
  seriesCopy: text(),
  aboutTitle: text(150),
  contactTitle: text(150),
  contactCopy: text(),
  discoverTitle: text(150),
  authorTitle: text(150),
  socialCopy: text(),
  palette: z.enum(['olive', 'ink', 'plum', 'clay']).default('olive'),
  customBackground: color,
  customText: color,
  customAccent: color,
  customDarkBackground: color,
  customDarkText: color,
  customDarkAccent: color,
  defaultTheme: z.enum(['system', 'light', 'dark']).default('system'),
  displayFont: z.enum(['literary', 'classic', 'clean']).default('literary'),
  coverStyle: z.enum(['angled', 'straight']).default('angled'),
  homeLayout: z.enum(['cover-right', 'cover-left', 'centered']).default('cover-right'),
  catalogDensity: z.enum(['airy', 'compact']).default('airy'),
  showSeries: z.enum(['show', 'hide']).default('show'),
  showAuthor: z.enum(['show', 'hide']).default('show'),
  showNewsletter: z.enum(['show', 'hide']).default('show'),
  faqs: z
    .array(z.object({ question: text(200).min(1), answer: text(1500).min(1) }))
    .max(30),
}).superRefine((content, ctx) => {
  if ([content.customBackground,content.customText,content.customAccent,content.customDarkBackground,content.customDarkText,content.customDarkAccent].some(value => !/^(?:#[0-9a-fA-F]{6})?$/.test(value))) return;
  for (const check of customColorContrast(content.palette, content)) {
    if (check.ratio < 4.5) ctx.addIssue({code:'custom',path:[check.field],message:check.label + ': choose a text color that is easier to read against the background.'});
  }
});
export type SiteContent = z.infer<typeof contentSchema>;
export const defaultContent: SiteContent = {
  ...siteMeta,
  heroTitle: 'A love worth getting lost in.',
  heroCopy:
    'Fallen angels. Haunted houses. A quiet town by the sea. Find your next M/M romance, wherever your heart takes you.',
  authorPhoto: '/photos/jaclynosbornpicture.jpg',
  newsletterUrl: '',
  newsletterTitle: 'A little closer to the stories.',
  newsletterCopy:
    'New books, cover reveals, and notes from Jaclyn. Find out what’s coming next.',
  featuredBookSlug: 'galen',
  announcement: '',
  announcementUrl: '',
  booksTitle: 'The bookshelf',
  booksCopy:
    'Find your next read. Explore every title, or narrow the shelf by series and genre.',
  seriesTitle: 'Find your next world.',
  seriesCopy:
    'Meet the characters. Start at the beginning. Follow each series in reading order.',
  aboutTitle: 'Meet Jaclyn',
  contactTitle: 'Say hello.',
  contactCopy:
    'Reader mail, event invitations, and business inquiries are always welcome.',
  discoverTitle: 'Where will you fall in love?',
  authorTitle: 'The author behind the stories.',
  socialCopy:
    'Book news, coffee, anime, and a glimpse of life between chapters.',
  faqs: faqItems,
  palette: 'olive',
  customBackground: '', customText: '', customAccent: '',
  customDarkBackground: '', customDarkText: '', customDarkAccent: '',
  defaultTheme: 'system', displayFont: 'literary', coverStyle: 'angled',
  homeLayout: 'cover-right',
  catalogDensity: 'airy',
  showSeries: 'show',
  showAuthor: 'show',
  showNewsletter: 'show',
};

export async function getSiteContent(): Promise<SiteContent> {
  const row = await env.DB.prepare(
    "SELECT value FROM site_settings WHERE key = 'site_content'",
  ).first<{ value: string }>();
  if (!row) return defaultContent;
  const parsed = contentSchema.safeParse({
    ...defaultContent,
    ...JSON.parse(row.value),
  });
  if (!parsed.success) throw new Error('Saved site content is invalid.');
  return parsed.data;
}
