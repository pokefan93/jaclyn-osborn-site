import type {
  Book,
  CatalogFilterTag,
  DirectSaleFormat,
  FormatKey,
  RetailerLink,
  Series,
} from '../types/catalog';

export const formatLabels: Record<FormatKey, string> = {
  ebook: 'eBook',
  paperback: 'Paperback',
  hardcover: 'Hardcover',
  audiobook: 'Audiobook',
};

export const genreVibeTags: CatalogFilterTag[] = [
  { slug: 'contemporary', label: 'Contemporary', kind: 'genre' },
  { slug: 'fantasy', label: 'Fantasy', kind: 'genre' },
  { slug: 'paranormal', label: 'Paranormal', kind: 'genre' },
  { slug: 'historical', label: 'Historical', kind: 'genre' },
  { slug: 'spooky', label: 'Spooky', kind: 'genre' },
];

const retailerLink = (
  id: string,
  retailer: string,
  label: string,
  format: FormatKey,
  purchaseUrl: string,
): RetailerLink => ({
  id,
  retailer,
  label,
  format,
  purchaseMode: 'external_retailer',
  purchaseUrl,
});

const stripePaymentLink = (
  id: string,
  label: string,
  format: FormatKey,
  purchaseUrl: string,
): DirectSaleFormat => ({
  id,
  label,
  format,
  purchaseMode: 'stripe_payment_link',
  purchaseUrl,
});

const unavailableDirectSale = (
  id: string,
  label: string,
  format: FormatKey,
): DirectSaleFormat => ({
  id,
  label,
  format,
  purchaseMode: 'unavailable',
});

const noPurchaseDetails = (): Book['purchase'] => ({
  availabilityStatus: 'in_stock',
  merchandisingFlags: [],
  signedCopy: false,
  directFromAuthor: false,
  retailerLinks: [],
  directSaleFormats: [],
});

export const series: Series[] = [
  {
    slug: 'sons-of-the-fallen',
    name: 'Sons of the Fallen',
    lane: 'Paranormal fantasy romance',
    tagline: 'Paranormal fantasy M/M romance.',
    description:
      'Start with Galen. Other titles in the series include Castor, Daman, Gray, Bellamy, Raiden, Alastair, and Beyond the Storm.',
    status: 'Ongoing',
    entryPoint: 'Galen',
    gradient: ['#2a1c2a', '#6f425e', '#c48273'],
    textColor: '#fff5f0',
    highlight: [],
  },
  {
    slug: 'sent-to-a-fantasy-world',
    name: 'Sent to a Fantasy World and Now All the Men Want Me',
    lane: 'Fantasy romance',
    tagline: 'Fantasy M/M romance.',
    description:
      'Start with Volume 1 and continue in order from there.',
    status: 'Ongoing',
    entryPoint: 'Volume 1',
    gradient: ['#2a2345', '#4a6ba5', '#e2b96f'],
    textColor: '#fdf8ef',
    highlight: [],
  },
  {
    slug: 'ivy-grove',
    name: 'Ivy Grove',
    lane: 'Paranormal romance',
    tagline: 'Paranormal M/M romance.',
    description:
      'Start with The Ghost of Ellwood. Other titles include The Curse of Redwood and The Haunting of Lockton.',
    status: 'Ongoing',
    entryPoint: 'The Ghost of Ellwood',
    gradient: ['#23403d', '#7ea495', '#efd8bc'],
    textColor: '#f8f4ef',
    highlight: [],
  },
  {
    slug: 'unexpected-love',
    name: 'Unexpected Love',
    lane: 'Contemporary romance',
    tagline: 'Contemporary M/M romance.',
    description:
      'Start with His Temptation. Other titles include His Surrender and His Courage.',
    status: 'Complete',
    entryPoint: 'His Temptation',
    gradient: ['#5d3640', '#cf8a7b', '#f2dfd3'],
    textColor: '#fff7f1',
    highlight: [],
  },
  {
    slug: 'blue-harbor',
    name: 'Blue Harbor',
    lane: 'Contemporary romance',
    tagline: 'Contemporary M/M romance.',
    description:
      'Start with Topping the Jock, followed by Dating the Boss.',
    status: 'Ongoing',
    entryPoint: 'Topping the Jock',
    gradient: ['#1d3a46', '#6fa4b7', '#d8e7e6'],
    textColor: '#f4fbfb',
    highlight: [],
  },
  {
    slug: 'tales-of-fate',
    name: 'Tales of Fate',
    lane: 'Historical fantasy romance',
    tagline: 'Historical fantasy M/M romance.',
    description:
      'Start with Found at Sea. Other titles include The Nymph Prince and A Warrior\'s Heart.',
    status: 'Complete',
    entryPoint: 'Found at Sea',
    gradient: ['#2a2435', '#7f5f5d', '#caa56c'],
    textColor: '#fff7ea',
    highlight: [],
  },
  {
    slug: 'axios',
    name: 'Axios',
    lane: 'Fantasy romance',
    tagline: 'Fantasy M/M romance.',
    description:
      'Start with Axios: A Spartan Tale, followed by Eryx: A Spartan Tale.',
    status: 'Ongoing',
    entryPoint: 'Axios: A Spartan Tale',
    gradient: ['#172433', '#3d5f73', '#b98b76'],
    textColor: '#f6f7fb',
    highlight: [],
  },
];

export const books: Book[] = [
  {
    id: 'galen',
    slug: 'galen',
    title: 'Galen',
    seriesSlug: 'sons-of-the-fallen',
    seriesOrder: 1,
    releaseDate: '2026-02-18',
    shortHook:
      'Book 1 in the Sons of the Fallen series.',
    description:
      'M/M paranormal fantasy romance. Book 1 in the Sons of the Fallen series.',
    genres: ['paranormal', 'fantasy'],
    vibes: ['darkly-devoted', 'protective-devotion'],
    tropes: ['enemies to lovers', 'fallen angel', 'protective hero'],
    formats: ['ebook', 'paperback', 'hardcover', 'audiobook'],
    featured: true,
    coverPalette: 'plum',
    purchase: {
      availabilityStatus: 'in_stock',
      merchandisingFlags: ['new_release', 'signed_copy', 'direct_from_author'],
      signedCopy: true,
      directFromAuthor: true,
      retailerLinks: [
        retailerLink(
          'fallen-heir-kindle',
          'Amazon Kindle',
          'Kindle',
          'ebook',
          'https://example.com/retail/the-fallen-heir/kindle',
        ),
        retailerLink(
          'fallen-heir-kobo',
          'Kobo',
          'Kobo',
          'ebook',
          'https://example.com/retail/the-fallen-heir/kobo',
        ),
        retailerLink(
          'fallen-heir-libro',
          'Libro.fm',
          'Libro.fm audio',
          'audiobook',
          'https://example.com/retail/the-fallen-heir/libro-fm',
        ),
      ],
      directSaleFormats: [
        stripePaymentLink(
          'galen-signed-paperback',
          'Signed',
          'paperback',
          'https://buy.stripe.com/test_fallen_heir_signed_paperback',
        ),
        stripePaymentLink(
          'galen-annotated-hardcover',
          'Annotated',
          'hardcover',
          'https://buy.stripe.com/test_fallen_heir_annotated_hardcover',
        ),
      ],
    },
  },
  {
    id: 'castor',
    slug: 'castor',
    title: 'Castor',
    seriesSlug: 'sons-of-the-fallen',
    seriesOrder: 2,
    releaseDate: '2025-07-09',
    shortHook:
      'Book 2 in the Sons of the Fallen series.',
    description:
      'M/M paranormal fantasy romance. Book 2 in the Sons of the Fallen series.',
    genres: ['paranormal', 'fantasy'],
    vibes: ['darkly-devoted', 'spooky-sweet'],
    tropes: ['forced proximity', 'slow burn'],
    formats: ['ebook', 'paperback', 'hardcover'],
    featured: false,
    coverPalette: 'ember',
    purchase: {
      availabilityStatus: 'limited',
      availabilityLabel: 'Limited signed stock',
      merchandisingFlags: ['signed_copy', 'direct_from_author'],
      signedCopy: true,
      directFromAuthor: true,
      retailerLinks: [
        retailerLink(
          'castor-kindle',
          'Amazon Kindle',
          'Kindle',
          'ebook',
          'https://example.com/retail/castor/kindle',
        ),
        retailerLink(
          'castor-bookshop',
          'Bookshop',
          'Bookshop paperback',
          'paperback',
          'https://example.com/retail/castor/bookshop',
        ),
      ],
      directSaleFormats: [
        stripePaymentLink(
          'castor-signed-paperback',
          'Signed',
          'paperback',
          'https://buy.stripe.com/test_ashes_after_midnight_signed_paperback',
        ),
        stripePaymentLink(
          'castor-foiled-hardcover',
          'Foiled',
          'hardcover',
          'https://buy.stripe.com/test_ashes_after_midnight_foiled_hardcover',
        ),
      ],
    },
  },
  {
    id: 'daman',
    slug: 'daman',
    title: 'Daman',
    seriesSlug: 'sons-of-the-fallen',
    seriesOrder: 3,
    releaseDate: '',
    shortHook:
      'Book 3 in the Sons of the Fallen series.',
    description:
      'M/M paranormal fantasy romance. Book 3 in the Sons of the Fallen series.',
    genres: ['paranormal', 'fantasy'],
    vibes: [],
    tropes: [],
    formats: [],
    featured: false,
    coverPalette: 'cobalt',
    purchase: noPurchaseDetails(),
  },
  {
    id: 'gray',
    slug: 'gray',
    title: 'Gray',
    seriesSlug: 'sons-of-the-fallen',
    seriesOrder: 4,
    releaseDate: '',
    shortHook:
      'Book 4 in the Sons of the Fallen series.',
    description:
      'M/M paranormal fantasy romance. Book 4 in the Sons of the Fallen series.',
    genres: ['paranormal', 'fantasy'],
    vibes: [],
    tropes: [],
    formats: [],
    featured: false,
    coverPalette: 'sage',
    purchase: noPurchaseDetails(),
  },
  {
    id: 'bellamy',
    slug: 'bellamy',
    title: 'Bellamy',
    seriesSlug: 'sons-of-the-fallen',
    seriesOrder: 5,
    releaseDate: '',
    shortHook:
      'Book 5 in the Sons of the Fallen series.',
    description:
      'M/M paranormal fantasy romance. Book 5 in the Sons of the Fallen series.',
    genres: ['paranormal', 'fantasy'],
    vibes: [],
    tropes: [],
    formats: [],
    featured: false,
    coverPalette: 'rose',
    purchase: noPurchaseDetails(),
  },
  {
    id: 'raiden',
    slug: 'raiden',
    title: 'Raiden',
    seriesSlug: 'sons-of-the-fallen',
    seriesOrder: 6,
    releaseDate: '',
    shortHook:
      'Book 6 in the Sons of the Fallen series.',
    description:
      'M/M paranormal fantasy romance. Book 6 in the Sons of the Fallen series.',
    genres: ['paranormal', 'fantasy'],
    vibes: [],
    tropes: [],
    formats: [],
    featured: false,
    coverPalette: 'gold',
    purchase: noPurchaseDetails(),
  },
  {
    id: 'alastair',
    slug: 'alastair',
    title: 'Alastair',
    seriesSlug: 'sons-of-the-fallen',
    seriesOrder: 7,
    releaseDate: '',
    shortHook:
      'Book 7 in the Sons of the Fallen series.',
    description:
      'M/M paranormal fantasy romance. Book 7 in the Sons of the Fallen series.',
    genres: ['paranormal', 'fantasy'],
    vibes: [],
    tropes: [],
    formats: [],
    featured: false,
    coverPalette: 'teal',
    purchase: noPurchaseDetails(),
  },
  {
    id: 'beyond-the-storm',
    slug: 'beyond-the-storm',
    title: 'Beyond the Storm',
    seriesSlug: 'sons-of-the-fallen',
    seriesOrder: 8,
    releaseDate: '',
    shortHook:
      'Book 8 in the Sons of the Fallen series.',
    description:
      'M/M paranormal fantasy romance. Book 8 in the Sons of the Fallen series.',
    genres: ['paranormal', 'fantasy'],
    vibes: [],
    tropes: [],
    formats: [],
    featured: false,
    coverPalette: 'plum',
    purchase: noPurchaseDetails(),
  },
  {
    id: 'sent-fantasy-world-vol1',
    slug: 'sent-to-a-fantasy-world-volume-1',
    title: 'Volume 1',
    seriesSlug: 'sent-to-a-fantasy-world',
    seriesOrder: 1,
    releaseDate: '2026-01-08',
    shortHook:
      'Book 1 in the Sent to a Fantasy World series.',
    description:
      'M/M portal fantasy romance. Book 1 in the Sent to a Fantasy World and Now All the Men Want Me series.',
    genres: ['fantasy'],
    vibes: ['portal-fantasy-chaos', 'soft-and-swoony'],
    tropes: ['fish out of water', 'portal fantasy'],
    formats: ['ebook', 'paperback'],
    featured: true,
    coverPalette: 'cobalt',
    purchase: {
      availabilityStatus: 'in_stock',
      merchandisingFlags: ['new_release', 'direct_from_author'],
      signedCopy: false,
      directFromAuthor: true,
      retailerLinks: [
        retailerLink(
          'sfaw-vol1-kindle',
          'Amazon Kindle',
          'Kindle',
          'ebook',
          'https://example.com/retail/sent-to-a-fantasy-world-vol1/kindle',
        ),
        retailerLink(
          'sfaw-vol1-apple',
          'Apple Books',
          'Apple Books',
          'ebook',
          'https://example.com/retail/sent-to-a-fantasy-world-vol1/apple-books',
        ),
      ],
      directSaleFormats: [
        stripePaymentLink(
          'sfaw-vol1-paperback',
          'Direct',
          'paperback',
          'https://buy.stripe.com/test_wyvern_king_direct_paperback',
        ),
      ],
    },
  },
  {
    id: 'sent-fantasy-world-vol2',
    slug: 'sent-to-a-fantasy-world-volume-2',
    title: 'Volume 2',
    seriesSlug: 'sent-to-a-fantasy-world',
    seriesOrder: 2,
    releaseDate: '2025-05-14',
    shortHook:
      'Book 2 in the Sent to a Fantasy World series.',
    description:
      'M/M portal fantasy romance. Book 2 in the Sent to a Fantasy World and Now All the Men Want Me series.',
    genres: ['fantasy'],
    vibes: ['portal-fantasy-chaos', 'found-family'],
    tropes: ['portal fantasy', 'found family'],
    formats: ['ebook', 'paperback', 'audiobook'],
    featured: false,
    coverPalette: 'gold',
    purchase: {
      availabilityStatus: 'in_stock',
      merchandisingFlags: [],
      signedCopy: false,
      directFromAuthor: false,
      retailerLinks: [
        retailerLink(
          'sfaw-vol2-kindle',
          'Amazon Kindle',
          'Kindle',
          'ebook',
          'https://example.com/retail/sent-to-a-fantasy-world-vol2/kindle',
        ),
        retailerLink(
          'sfaw-vol2-bn',
          'Barnes & Noble',
          'Nook',
          'ebook',
          'https://example.com/retail/sent-to-a-fantasy-world-vol2/nook',
        ),
        retailerLink(
          'sfaw-vol2-audio',
          'Libro.fm',
          'Libro.fm audio',
          'audiobook',
          'https://example.com/retail/sent-to-a-fantasy-world-vol2/libro-fm',
        ),
      ],
      directSaleFormats: [],
    },
  },
  {
    id: 'the-ghost-of-ellwood',
    slug: 'the-ghost-of-ellwood',
    title: 'The Ghost of Ellwood',
    seriesSlug: 'ivy-grove',
    seriesOrder: 1,
    releaseDate: '2024-10-15',
    shortHook:
      'Book 1 in the Ivy Grove series.',
    description:
      'M/M cozy paranormal romance. Book 1 in the Ivy Grove series.',
    genres: ['paranormal', 'spooky', 'contemporary'],
    vibes: ['cozy-small-town', 'spooky-sweet'],
    tropes: ['second chance', 'haunted house', 'forced proximity'],
    formats: ['ebook', 'paperback', 'audiobook'],
    featured: false,
    coverPalette: 'sage',
    purchase: {
      availabilityStatus: 'in_stock',
      merchandisingFlags: [],
      signedCopy: false,
      directFromAuthor: false,
      retailerLinks: [
        retailerLink(
          'ghost-of-ellwood-kindle',
          'Amazon Kindle',
          'Kindle',
          'ebook',
          'https://example.com/retail/the-ghost-of-ellwood/kindle',
        ),
        retailerLink(
          'ghost-of-ellwood-paperback',
          'Bookshop',
          'Bookshop paperback',
          'paperback',
          'https://example.com/retail/the-ghost-of-ellwood/bookshop',
        ),
        retailerLink(
          'ghost-of-ellwood-audio',
          'Libro.fm',
          'Libro.fm audio',
          'audiobook',
          'https://example.com/retail/the-ghost-of-ellwood/libro-fm',
        ),
      ],
      directSaleFormats: [],
    },
  },
  {
    id: 'the-curse-of-redwood',
    slug: 'the-curse-of-redwood',
    title: 'The Curse of Redwood',
    seriesSlug: 'ivy-grove',
    seriesOrder: 2,
    releaseDate: '2026-10-01',
    shortHook:
      'Book 2 in the Ivy Grove series.',
    description:
      'M/M cozy paranormal romance. Book 2 in the Ivy Grove series.',
    genres: ['paranormal', 'contemporary', 'spooky'],
    vibes: ['cozy-small-town', 'spooky-sweet'],
    tropes: ['small-town romance', 'found family'],
    formats: ['ebook', 'paperback', 'hardcover'],
    featured: true,
    coverPalette: 'rose',
    purchase: {
      availabilityStatus: 'preorder',
      availabilityLabel: 'Preorder signed copies',
      merchandisingFlags: ['preorder', 'signed_copy', 'direct_from_author'],
      signedCopy: true,
      directFromAuthor: true,
      retailerLinks: [
        retailerLink(
          'curse-of-redwood-kindle',
          'Amazon Kindle',
          'Kindle preorder',
          'ebook',
          'https://example.com/retail/the-curse-of-redwood/kindle',
        ),
        retailerLink(
          'curse-of-redwood-kobo',
          'Kobo',
          'Kobo preorder',
          'ebook',
          'https://example.com/retail/the-curse-of-redwood/kobo',
        ),
      ],
      directSaleFormats: [
        stripePaymentLink(
          'curse-of-redwood-signed-paperback',
          'Signed preorder',
          'paperback',
          'https://buy.stripe.com/test_hexes_honey_cakes_signed_paperback',
        ),
        stripePaymentLink(
          'curse-of-redwood-signed-hardcover',
          'Signed preorder',
          'hardcover',
          'https://buy.stripe.com/test_hexes_honey_cakes_signed_hardcover',
        ),
      ],
    },
  },
  {
    id: 'the-haunting-of-lockton',
    slug: 'the-haunting-of-lockton',
    title: 'The Haunting of Lockton',
    seriesSlug: 'ivy-grove',
    seriesOrder: 3,
    releaseDate: '',
    shortHook:
      'Book 3 in the Ivy Grove series.',
    description:
      'Paranormal M/M romance. Book 3 in the Ivy Grove series.',
    genres: ['paranormal', 'spooky'],
    vibes: [],
    tropes: [],
    formats: [],
    featured: false,
    coverPalette: 'teal',
    purchase: noPurchaseDetails(),
  },
  {
    id: 'his-temptation',
    slug: 'his-temptation',
    title: 'His Temptation',
    seriesSlug: 'unexpected-love',
    seriesOrder: 1,
    releaseDate: '2023-06-13',
    shortHook:
      'Book 1 in the Unexpected Love series.',
    description:
      'M/M contemporary romance. Book 1 in the Unexpected Love series.',
    genres: ['contemporary'],
    vibes: ['soft-and-swoony', 'cozy-small-town'],
    tropes: ['contemporary romance', 'emotional connection'],
    formats: ['ebook', 'paperback'],
    featured: false,
    coverPalette: 'rose',
    purchase: {
      availabilityStatus: 'in_stock',
      merchandisingFlags: [],
      signedCopy: false,
      directFromAuthor: false,
      retailerLinks: [
        retailerLink(
          'his-temptation-kindle',
          'Amazon Kindle',
          'Kindle',
          'ebook',
          'https://example.com/retail/his-temptation/kindle',
        ),
        retailerLink(
          'his-temptation-bookshop',
          'Bookshop',
          'Bookshop paperback',
          'paperback',
          'https://example.com/retail/his-temptation/bookshop',
        ),
      ],
      directSaleFormats: [],
    },
  },
  {
    id: 'his-surrender',
    slug: 'his-surrender',
    title: 'His Surrender',
    seriesSlug: 'unexpected-love',
    seriesOrder: 2,
    releaseDate: '2022-11-08',
    shortHook:
      'Book 2 in the Unexpected Love series.',
    description:
      'M/M contemporary romance. Book 2 in the Unexpected Love series.',
    genres: ['contemporary'],
    vibes: ['soft-and-swoony', 'found-family'],
    tropes: ['contemporary romance', 'friends to lovers'],
    formats: ['ebook', 'audiobook'],
    featured: false,
    coverPalette: 'gold',
    purchase: {
      availabilityStatus: 'in_stock',
      merchandisingFlags: [],
      signedCopy: false,
      directFromAuthor: false,
      retailerLinks: [
        retailerLink(
          'his-surrender-kindle',
          'Amazon Kindle',
          'Kindle',
          'ebook',
          'https://example.com/retail/his-surrender/kindle',
        ),
        retailerLink(
          'his-surrender-audio',
          'Libro.fm',
          'Libro.fm audio',
          'audiobook',
          'https://example.com/retail/his-surrender/libro-fm',
        ),
      ],
      directSaleFormats: [],
    },
  },
  {
    id: 'his-courage',
    slug: 'his-courage',
    title: 'His Courage',
    seriesSlug: 'unexpected-love',
    seriesOrder: 3,
    releaseDate: '',
    shortHook:
      'Book 3 in the Unexpected Love series.',
    description:
      'Contemporary M/M romance. Book 3 in the Unexpected Love series.',
    genres: ['contemporary'],
    vibes: [],
    tropes: [],
    formats: [],
    featured: false,
    coverPalette: 'cobalt',
    purchase: noPurchaseDetails(),
  },
  {
    id: 'topping-the-jock',
    slug: 'topping-the-jock',
    title: 'Topping the Jock',
    seriesSlug: 'blue-harbor',
    seriesOrder: 1,
    releaseDate: '2025-04-22',
    shortHook:
      'Book 1 in the Blue Harbor series.',
    description:
      'M/M contemporary romance. Book 1 in the Blue Harbor series.',
    genres: ['contemporary'],
    vibes: ['coastal-comfort', 'soft-and-swoony'],
    tropes: ['contemporary romance', 'small-town'],
    formats: ['ebook', 'paperback', 'hardcover', 'audiobook'],
    featured: false,
    coverPalette: 'teal',
    purchase: {
      availabilityStatus: 'limited',
      availabilityLabel: 'Limited signed hardcovers',
      merchandisingFlags: ['signed_copy', 'direct_from_author'],
      signedCopy: true,
      directFromAuthor: true,
      retailerLinks: [
        retailerLink(
          'topping-the-jock-kindle',
          'Amazon Kindle',
          'Kindle',
          'ebook',
          'https://example.com/retail/topping-the-jock/kindle',
        ),
        retailerLink(
          'topping-the-jock-paperback',
          'Bookshop',
          'Bookshop paperback',
          'paperback',
          'https://example.com/retail/topping-the-jock/bookshop',
        ),
        retailerLink(
          'topping-the-jock-audio',
          'Libro.fm',
          'Libro.fm audio',
          'audiobook',
          'https://example.com/retail/topping-the-jock/libro-fm',
        ),
      ],
      directSaleFormats: [
        stripePaymentLink(
          'topping-the-jock-signed-hardcover',
          'Signed',
          'hardcover',
          'https://buy.stripe.com/test_harboring_you_signed_hardcover',
        ),
      ],
    },
  },
  {
    id: 'dating-the-boss',
    slug: 'dating-the-boss',
    title: 'Dating the Boss',
    seriesSlug: 'blue-harbor',
    seriesOrder: 2,
    releaseDate: '2024-06-04',
    shortHook:
      'Book 2 in the Blue Harbor series.',
    description:
      'M/M contemporary romance. Book 2 in the Blue Harbor series.',
    genres: ['contemporary'],
    vibes: ['coastal-comfort', 'protective-devotion'],
    tropes: ['contemporary romance', 'second chance'],
    formats: ['ebook', 'paperback', 'hardcover'],
    featured: false,
    coverPalette: 'cobalt',
    purchase: {
      availabilityStatus: 'sold_out',
      availabilityLabel: 'Signed hardcovers sold out',
      merchandisingFlags: ['signed_copy', 'direct_from_author'],
      signedCopy: true,
      directFromAuthor: true,
      retailerLinks: [
        retailerLink(
          'dating-the-boss-kindle',
          'Amazon Kindle',
          'Kindle',
          'ebook',
          'https://example.com/retail/dating-the-boss/kindle',
        ),
        retailerLink(
          'dating-the-boss-bookshop',
          'Bookshop',
          'Bookshop paperback',
          'paperback',
          'https://example.com/retail/dating-the-boss/bookshop',
        ),
      ],
      directSaleFormats: [
        unavailableDirectSale(
          'dating-the-boss-hardcover',
          'Signed sold out',
          'hardcover',
        ),
      ],
    },
  },
  {
    id: 'found-at-sea',
    slug: 'found-at-sea',
    title: 'Found at Sea',
    seriesSlug: 'tales-of-fate',
    seriesOrder: 1,
    releaseDate: '2023-09-19',
    shortHook:
      'Book 1 in the Tales of Fate series.',
    description:
      'M/M historical fantasy romance. Book 1 in the Tales of Fate series.',
    genres: ['fantasy', 'historical'],
    vibes: ['protective-devotion'],
    tropes: ['historical romance', 'forbidden romance'],
    formats: ['ebook', 'paperback', 'hardcover'],
    featured: false,
    coverPalette: 'gold',
    purchase: {
      availabilityStatus: 'limited',
      availabilityLabel: 'Limited foil hardcovers',
      merchandisingFlags: ['signed_copy', 'direct_from_author'],
      signedCopy: true,
      directFromAuthor: true,
      retailerLinks: [
        retailerLink(
          'found-at-sea-kobo',
          'Kobo',
          'Kobo',
          'ebook',
          'https://example.com/retail/found-at-sea/kobo',
        ),
        retailerLink(
          'found-at-sea-bookshop',
          'Bookshop',
          'Bookshop paperback',
          'paperback',
          'https://example.com/retail/found-at-sea/bookshop',
        ),
      ],
      directSaleFormats: [
        stripePaymentLink(
          'found-at-sea-hardcover',
          'Foil signed',
          'hardcover',
          'https://buy.stripe.com/test_threaded_in_gold_foil_hardcover',
        ),
      ],
    },
  },
  {
    id: 'the-nymph-prince',
    slug: 'the-nymph-prince',
    title: 'The Nymph Prince',
    seriesSlug: 'tales-of-fate',
    seriesOrder: 2,
    releaseDate: '2022-02-15',
    shortHook:
      'Book 2 in the Tales of Fate series.',
    description:
      'M/M historical fantasy romance. Book 2 in the Tales of Fate series.',
    genres: ['fantasy', 'historical'],
    vibes: ['darkly-devoted'],
    tropes: ['historical romance'],
    formats: ['ebook', 'audiobook'],
    featured: false,
    coverPalette: 'plum',
    purchase: {
      availabilityStatus: 'in_stock',
      merchandisingFlags: [],
      signedCopy: false,
      directFromAuthor: false,
      retailerLinks: [
        retailerLink(
          'nymph-prince-kobo',
          'Kobo',
          'Kobo',
          'ebook',
          'https://example.com/retail/the-nymph-prince/kobo',
        ),
        retailerLink(
          'nymph-prince-audio',
          'Libro.fm',
          'Libro.fm audio',
          'audiobook',
          'https://example.com/retail/the-nymph-prince/libro-fm',
        ),
      ],
      directSaleFormats: [],
    },
  },
  {
    id: 'a-warriors-heart',
    slug: 'a-warriors-heart',
    title: "A Warrior's Heart",
    seriesSlug: 'tales-of-fate',
    seriesOrder: 3,
    releaseDate: '',
    shortHook:
      'Book 3 in the Tales of Fate series.',
    description:
      'Historical fantasy M/M romance. Book 3 in the Tales of Fate series.',
    genres: ['fantasy', 'historical'],
    vibes: [],
    tropes: [],
    formats: [],
    featured: false,
    coverPalette: 'ember',
    purchase: noPurchaseDetails(),
  },
  {
    id: 'axios-a-spartan-tale',
    slug: 'axios-a-spartan-tale',
    title: 'Axios: A Spartan Tale',
    seriesSlug: 'axios',
    seriesOrder: 1,
    releaseDate: '2024-03-12',
    shortHook:
      'Book 1 in the Axios series.',
    description:
      'M/M fantasy romance. Book 1 in the Axios series.',
    genres: ['fantasy', 'paranormal', 'spooky'],
    vibes: ['darkly-devoted', 'protective-devotion'],
    tropes: ['slow burn', 'protective hero'],
    formats: ['ebook', 'paperback', 'hardcover'],
    featured: false,
    coverPalette: 'cobalt',
    purchase: {
      availabilityStatus: 'sold_out',
      availabilityLabel: 'Signed direct edition sold out',
      merchandisingFlags: ['signed_copy', 'direct_from_author'],
      signedCopy: true,
      directFromAuthor: true,
      retailerLinks: [
        retailerLink(
          'axios-spartan-kindle',
          'Amazon Kindle',
          'Kindle',
          'ebook',
          'https://example.com/retail/axios-a-spartan-tale/kindle',
        ),
        retailerLink(
          'axios-spartan-paperback',
          'Bookshop',
          'Bookshop paperback',
          'paperback',
          'https://example.com/retail/axios-a-spartan-tale/bookshop',
        ),
      ],
      directSaleFormats: [
        unavailableDirectSale(
          'axios-spartan-hardcover',
          'Signed sold out',
          'hardcover',
        ),
      ],
    },
  },
  {
    id: 'eryx-a-spartan-tale',
    slug: 'eryx-a-spartan-tale',
    title: 'Eryx: A Spartan Tale',
    seriesSlug: 'axios',
    seriesOrder: 2,
    releaseDate: '2025-02-11',
    shortHook:
      'Book 2 in the Axios series.',
    description:
      'M/M fantasy romance. Book 2 in the Axios series.',
    genres: ['fantasy', 'paranormal'],
    vibes: ['protective-devotion', 'darkly-devoted'],
    tropes: ['second chance', 'slow burn'],
    formats: ['ebook', 'paperback', 'audiobook'],
    featured: false,
    coverPalette: 'ember',
    purchase: {
      availabilityStatus: 'in_stock',
      merchandisingFlags: ['direct_from_author'],
      signedCopy: false,
      directFromAuthor: true,
      retailerLinks: [
        retailerLink(
          'eryx-spartan-kindle',
          'Amazon Kindle',
          'Kindle',
          'ebook',
          'https://example.com/retail/eryx-a-spartan-tale/kindle',
        ),
        retailerLink(
          'eryx-spartan-audio',
          'Libro.fm',
          'Libro.fm audio',
          'audiobook',
          'https://example.com/retail/eryx-a-spartan-tale/libro-fm',
        ),
      ],
      directSaleFormats: [
        stripePaymentLink(
          'eryx-spartan-paperback',
          'Direct',
          'paperback',
          'https://buy.stripe.com/test_steelheart_oath_direct_paperback',
        ),
      ],
    },
  },
];

export const seriesMap = new Map(series.map((item) => [item.slug, item]));

export const booksBySeries = series.map((item) => ({
  ...item,
  books: books
    .filter((book) => book.seriesSlug === item.slug)
    .sort((a, b) => a.seriesOrder - b.seriesOrder),
}));

export const featuredBooks = books
  .filter((book) => book.featured)
  .sort(
    (a, b) =>
      new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime(),
  );

export const catalogStats = {
  bookCount: books.length,
  seriesCount: series.length,
  formatCount: Object.keys(formatLabels).length,
};
