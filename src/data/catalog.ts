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
  { slug: 'darkly-devoted', label: 'Darkly devoted', kind: 'vibe' },
  { slug: 'cozy-small-town', label: 'Cozy small-town', kind: 'vibe' },
  { slug: 'spooky-sweet', label: 'Spooky sweet', kind: 'vibe' },
  { slug: 'portal-fantasy-chaos', label: 'Portal fantasy chaos', kind: 'vibe' },
  { slug: 'court-intrigue', label: 'Court intrigue', kind: 'vibe' },
  { slug: 'coastal-comfort', label: 'Coastal comfort', kind: 'vibe' },
  { slug: 'soft-and-swoony', label: 'Soft and swoony', kind: 'vibe' },
  { slug: 'found-family', label: 'Found family', kind: 'vibe' },
  { slug: 'protective-devotion', label: 'Protective devotion', kind: 'vibe' },
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

export const series: Series[] = [
  {
    slug: 'sons-of-the-fallen',
    name: 'Sons of the Fallen',
    lane: 'Paranormal fantasy romance',
    tagline: 'Fallen angels, ruthless bargains, and love sharpened by ruin.',
    description:
      'The sharpest paranormal lane in the catalog: celestial politics, dangerous protectors, and tenderness that keeps surviving the apocalypse.',
    status: 'Ongoing',
    entryPoint: 'The Fallen Heir',
    gradient: ['#2a1c2a', '#6f425e', '#c48273'],
    textColor: '#fff5f0',
    highlight: ['fallen angels', 'cursed bonds', 'touch him and die'],
  },
  {
    slug: 'sent-to-a-fantasy-world',
    name: 'Sent to a Fantasy World and Now All the Men Want Me',
    lane: 'Portal fantasy romance',
    tagline: 'Chaotic wish-fulfillment energy with real yearning under the comedy.',
    description:
      'For readers who want portal fantasy mayhem, magical suitors, and a lead trying very hard to stay normal while the world absolutely refuses.',
    status: 'Ongoing',
    entryPoint: 'Wanted by the Wyvern King',
    gradient: ['#2a2345', '#4a6ba5', '#e2b96f'],
    textColor: '#fdf8ef',
    highlight: ['fish out of water', 'monster courtship', 'banter-heavy'],
  },
  {
    slug: 'ivy-grove',
    name: 'Ivy Grove',
    lane: 'Cozy paranormal romance',
    tagline: 'A warm small town where the ghosts linger and the pastries still matter.',
    description:
      'A softer supernatural space: haunted inns, witchy bakeries, comforting community, and romance that glows rather than broods.',
    status: 'Ongoing',
    entryPoint: 'Moonlight at Ivy Grove Inn',
    gradient: ['#23403d', '#7ea495', '#efd8bc'],
    textColor: '#f8f4ef',
    highlight: ['witchy comfort', 'haunted inns', 'small-town warmth'],
  },
  {
    slug: 'unexpected-love',
    name: 'Unexpected Love',
    lane: 'Contemporary romance',
    tagline: 'Soft modern love stories that prioritize chemistry, care, and emotional payoff.',
    description:
      'These books lean contemporary and intimate: fake dating, quiet crushes, and generous relationship arcs that still feel sharply romantic.',
    status: 'Complete',
    entryPoint: 'Only for the Weekend',
    gradient: ['#5d3640', '#cf8a7b', '#f2dfd3'],
    textColor: '#fff7f1',
    highlight: ['fake dating', 'caretaking', 'found family'],
  },
  {
    slug: 'blue-harbor',
    name: 'Blue Harbor',
    lane: 'Coastal contemporary romance',
    tagline: 'Salt air, second chances, and the kind of comfort that sneaks up on you.',
    description:
      'The most luminous contemporary lane on the site: harbor towns, emotional recovery, and characters building safer futures without losing the heat.',
    status: 'Ongoing',
    entryPoint: 'Harboring You',
    gradient: ['#1d3a46', '#6fa4b7', '#d8e7e6'],
    textColor: '#f4fbfb',
    highlight: ['coastal comfort', 'healing arcs', 'slow glow'],
  },
  {
    slug: 'tales-of-fate',
    name: 'Tales of Fate',
    lane: 'Historical fantasy romance',
    tagline: 'Prophecy, court pressure, and impossible devotion dressed in gold thread.',
    description:
      'This is the lush, high-drama lane: royal stakes, destiny mechanics, and romance that has to fight against the shape of history.',
    status: 'Complete',
    entryPoint: 'Threaded in Gold',
    gradient: ['#2a2435', '#7f5f5d', '#caa56c'],
    textColor: '#fff7ea',
    highlight: ['fated mates', 'court intrigue', 'historical fantasy'],
  },
  {
    slug: 'axios',
    name: 'Axios',
    lane: 'Action-forward fantasy romance',
    tagline: 'Rebellion, haunted cities, and a love story built under pressure.',
    description:
      'Axios pushes the catalog into more kinetic territory while keeping the emotional center intact: battle magic, ghost tech, and fierce protective bonds.',
    status: 'Ongoing',
    entryPoint: 'Ghost Circuit Hearts',
    gradient: ['#172433', '#3d5f73', '#b98b76'],
    textColor: '#f6f7fb',
    highlight: ['rebellion', 'haunted cities', 'second chance tension'],
  },
];

export const books: Book[] = [
  {
    id: 'fallen-heir',
    slug: 'the-fallen-heir',
    title: 'The Fallen Heir',
    seriesSlug: 'sons-of-the-fallen',
    seriesOrder: 1,
    releaseDate: '2026-02-18',
    shortHook:
      'A disgraced seraph and the hunter ordered to end him keep choosing mercy over war.',
    description:
      'High-stakes celestial romance with enemies-to-lovers tension, dangerous tenderness, and a bruised hero worth burning the heavens for.',
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
          'fallen-heir-signed-paperback',
          'Signed',
          'paperback',
          'https://buy.stripe.com/test_fallen_heir_signed_paperback',
        ),
        stripePaymentLink(
          'fallen-heir-annotated-hardcover',
          'Annotated',
          'hardcover',
          'https://buy.stripe.com/test_fallen_heir_annotated_hardcover',
        ),
      ],
    },
  },
  {
    id: 'ashes-after-midnight',
    slug: 'ashes-after-midnight',
    title: 'Ashes After Midnight',
    seriesSlug: 'sons-of-the-fallen',
    seriesOrder: 2,
    releaseDate: '2025-07-09',
    shortHook:
      'A demon broker and a grieving medium strike a bargain that refuses to stay professional.',
    description:
      'A moodier follow-up with grief healing, supernatural contracts, and a romance that keeps getting more dangerous the softer it becomes.',
    genres: ['paranormal', 'fantasy'],
    vibes: ['darkly-devoted', 'spooky-sweet'],
    tropes: ['forced proximity', 'grief healing', 'deal with a demon'],
    formats: ['ebook', 'paperback', 'hardcover'],
    featured: false,
    coverPalette: 'ember',
    purchase: {
      availabilityStatus: 'limited',
      availabilityLabel: 'Limited signed stock',
      merchandisingFlags: ['signed_copy', 'direct_from_author'],
      signedCopy: true,
      directFromAuthor: true,
      fulfillmentNote: 'Current fulfillment mock: signed orders pack within 7 to 10 business days.',
      retailerLinks: [
        retailerLink(
          'ashes-after-midnight-kindle',
          'Amazon Kindle',
          'Kindle',
          'ebook',
          'https://example.com/retail/ashes-after-midnight/kindle',
        ),
        retailerLink(
          'ashes-after-midnight-bookshop',
          'Bookshop',
          'Bookshop paperback',
          'paperback',
          'https://example.com/retail/ashes-after-midnight/bookshop',
        ),
      ],
      directSaleFormats: [
        stripePaymentLink(
          'ashes-after-midnight-signed-paperback',
          'Signed',
          'paperback',
          'https://buy.stripe.com/test_ashes_after_midnight_signed_paperback',
        ),
        stripePaymentLink(
          'ashes-after-midnight-foiled-hardcover',
          'Foiled',
          'hardcover',
          'https://buy.stripe.com/test_ashes_after_midnight_foiled_hardcover',
        ),
      ],
    },
  },
  {
    id: 'wanted-by-the-wyvern-king',
    slug: 'wanted-by-the-wyvern-king',
    title: 'Wanted by the Wyvern King',
    seriesSlug: 'sent-to-a-fantasy-world',
    seriesOrder: 1,
    releaseDate: '2026-01-08',
    shortHook:
      'An overworked office drone lands in a fantasy realm and accidentally starts a mating-season scandal.',
    description:
      'Big portal-fantasy energy with monster courtship, snappy humor, and a hero who keeps winning allies by being bewilderingly kind.',
    genres: ['fantasy'],
    vibes: ['portal-fantasy-chaos', 'soft-and-swoony'],
    tropes: ['fish out of water', 'monster king', 'chaotic yearning'],
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
          'wyvern-king-kindle',
          'Amazon Kindle',
          'Kindle',
          'ebook',
          'https://example.com/retail/wanted-by-the-wyvern-king/kindle',
        ),
        retailerLink(
          'wyvern-king-apple',
          'Apple Books',
          'Apple Books',
          'ebook',
          'https://example.com/retail/wanted-by-the-wyvern-king/apple-books',
        ),
      ],
      directSaleFormats: [
        stripePaymentLink(
          'wyvern-king-paperback',
          'Direct',
          'paperback',
          'https://buy.stripe.com/test_wyvern_king_direct_paperback',
        ),
      ],
    },
  },
  {
    id: 'questing-for-three-husbands',
    slug: 'questing-for-three-husbands',
    title: 'Questing for Three Husbands',
    seriesSlug: 'sent-to-a-fantasy-world',
    seriesOrder: 2,
    releaseDate: '2025-05-14',
    shortHook:
      'Saving the kingdom would be easier if his bodyguards stopped flirting every time a prophecy went sideways.',
    description:
      'A playful fantasy-romance follow-up with enchanted road trips, magical bodyguards, and escalating why-is-everyone-looking-at-me energy.',
    genres: ['fantasy'],
    vibes: ['portal-fantasy-chaos', 'found-family'],
    tropes: ['bodyguards', 'prophecy trouble', 'chosen one chaos'],
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
          'three-husbands-kindle',
          'Amazon Kindle',
          'Kindle',
          'ebook',
          'https://example.com/retail/questing-for-three-husbands/kindle',
        ),
        retailerLink(
          'three-husbands-bn',
          'Barnes & Noble',
          'Nook',
          'ebook',
          'https://example.com/retail/questing-for-three-husbands/nook',
        ),
        retailerLink(
          'three-husbands-audio',
          'Libro.fm',
          'Libro.fm audio',
          'audiobook',
          'https://example.com/retail/questing-for-three-husbands/libro-fm',
        ),
      ],
      directSaleFormats: [],
    },
  },
  {
    id: 'moonlight-at-ivy-grove-inn',
    slug: 'moonlight-at-ivy-grove-inn',
    title: 'Moonlight at Ivy Grove Inn',
    seriesSlug: 'ivy-grove',
    seriesOrder: 1,
    releaseDate: '2024-10-15',
    shortHook:
      'A haunted inn, a stormy weekend, and a second chance that keeps rattling the chandeliers.',
    description:
      'The entry point for readers who want spooky atmosphere, emotional safety, and a romance that leans into autumnal comfort.',
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
          'ivy-grove-inn-kindle',
          'Amazon Kindle',
          'Kindle',
          'ebook',
          'https://example.com/retail/moonlight-at-ivy-grove-inn/kindle',
        ),
        retailerLink(
          'ivy-grove-inn-paperback',
          'Bookshop',
          'Bookshop paperback',
          'paperback',
          'https://example.com/retail/moonlight-at-ivy-grove-inn/bookshop',
        ),
        retailerLink(
          'ivy-grove-inn-audio',
          'Libro.fm',
          'Libro.fm audio',
          'audiobook',
          'https://example.com/retail/moonlight-at-ivy-grove-inn/libro-fm',
        ),
      ],
      directSaleFormats: [],
    },
  },
  {
    id: 'hexes-and-honey-cakes',
    slug: 'hexes-and-honey-cakes',
    title: 'Hexes & Honey Cakes',
    seriesSlug: 'ivy-grove',
    seriesOrder: 2,
    releaseDate: '2026-10-01',
    shortHook:
      'A witch bakery owner falls for the ghost whisperer renting the room above the shop.',
    description:
      'Warm, flour-dusted magic with neighbor tension, community coziness, and just enough haunting to keep the candles flickering.',
    genres: ['paranormal', 'contemporary', 'spooky'],
    vibes: ['cozy-small-town', 'spooky-sweet'],
    tropes: ['neighbors to lovers', 'witchy bakery', 'found family'],
    formats: ['ebook', 'paperback', 'hardcover'],
    featured: true,
    coverPalette: 'rose',
    purchase: {
      availabilityStatus: 'preorder',
      availabilityLabel: 'Preorder signed copies',
      merchandisingFlags: ['preorder', 'signed_copy', 'direct_from_author'],
      signedCopy: true,
      directFromAuthor: true,
      shippingNote: 'Shipping placeholder: update domestic and international preorder shipping rules before launch.',
      whereToBuyNote:
        'Signed preorder editions use Stripe-hosted checkout, while the standard digital edition can still point readers to retailers.',
      retailerLinks: [
        retailerLink(
          'hexes-honey-cakes-kindle',
          'Amazon Kindle',
          'Kindle preorder',
          'ebook',
          'https://example.com/retail/hexes-and-honey-cakes/kindle',
        ),
        retailerLink(
          'hexes-honey-cakes-kobo',
          'Kobo',
          'Kobo preorder',
          'ebook',
          'https://example.com/retail/hexes-and-honey-cakes/kobo',
        ),
      ],
      directSaleFormats: [
        stripePaymentLink(
          'hexes-honey-cakes-signed-paperback',
          'Signed preorder',
          'paperback',
          'https://buy.stripe.com/test_hexes_honey_cakes_signed_paperback',
        ),
        stripePaymentLink(
          'hexes-honey-cakes-signed-hardcover',
          'Signed preorder',
          'hardcover',
          'https://buy.stripe.com/test_hexes_honey_cakes_signed_hardcover',
        ),
      ],
    },
  },
  {
    id: 'only-for-the-weekend',
    slug: 'only-for-the-weekend',
    title: 'Only for the Weekend',
    seriesSlug: 'unexpected-love',
    seriesOrder: 1,
    releaseDate: '2023-06-13',
    shortHook:
      'A fake getaway boyfriend turns into the one person who makes real life feel possible.',
    description:
      'A clean entry for contemporary readers: bright chemistry, strong emotional payoff, and a relationship arc built on care.',
    genres: ['contemporary'],
    vibes: ['soft-and-swoony', 'cozy-small-town'],
    tropes: ['fake dating', 'weekend escape', 'caretaking'],
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
          'only-weekend-kindle',
          'Amazon Kindle',
          'Kindle',
          'ebook',
          'https://example.com/retail/only-for-the-weekend/kindle',
        ),
        retailerLink(
          'only-weekend-bookshop',
          'Bookshop',
          'Bookshop paperback',
          'paperback',
          'https://example.com/retail/only-for-the-weekend/bookshop',
        ),
      ],
      directSaleFormats: [],
    },
  },
  {
    id: 'coffee-before-confessions',
    slug: 'coffee-before-confessions',
    title: 'Coffee Before Confessions',
    seriesSlug: 'unexpected-love',
    seriesOrder: 2,
    releaseDate: '2022-11-08',
    shortHook:
      'A barista with a secret crush agrees to one tiny favor and gets an entire found family instead.',
    description:
      'A softer modern romance with coffee-shop intimacy, casual yearning, and the kind of emotional landing readers revisit when they want comfort.',
    genres: ['contemporary'],
    vibes: ['soft-and-swoony', 'found-family'],
    tropes: ['secret crush', 'coffee shop', 'friends to lovers'],
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
          'coffee-confessions-kindle',
          'Amazon Kindle',
          'Kindle',
          'ebook',
          'https://example.com/retail/coffee-before-confessions/kindle',
        ),
        retailerLink(
          'coffee-confessions-audio',
          'Libro.fm',
          'Libro.fm audio',
          'audiobook',
          'https://example.com/retail/coffee-before-confessions/libro-fm',
        ),
      ],
      directSaleFormats: [],
    },
  },
  {
    id: 'harboring-you',
    slug: 'harboring-you',
    title: 'Harboring You',
    seriesSlug: 'blue-harbor',
    seriesOrder: 1,
    releaseDate: '2025-04-22',
    shortHook:
      'A celebrity chef hiding from burnout finds a harbor pilot who sees straight through the performance.',
    description:
      'Salt-air contemporary romance with grounded vulnerability, mature chemistry, and a setting built for readers who love destination comfort.',
    genres: ['contemporary'],
    vibes: ['coastal-comfort', 'soft-and-swoony'],
    tropes: ['starting over', 'grumpy/sunshine', 'small-town harbor'],
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
          'harboring-you-kindle',
          'Amazon Kindle',
          'Kindle',
          'ebook',
          'https://example.com/retail/harboring-you/kindle',
        ),
        retailerLink(
          'harboring-you-paperback',
          'Bookshop',
          'Bookshop paperback',
          'paperback',
          'https://example.com/retail/harboring-you/bookshop',
        ),
        retailerLink(
          'harboring-you-audio',
          'Libro.fm',
          'Libro.fm audio',
          'audiobook',
          'https://example.com/retail/harboring-you/libro-fm',
        ),
      ],
      directSaleFormats: [
        stripePaymentLink(
          'harboring-you-signed-hardcover',
          'Signed',
          'hardcover',
          'https://buy.stripe.com/test_harboring_you_signed_hardcover',
        ),
      ],
    },
  },
  {
    id: 'the-lighthouse-between-us',
    slug: 'the-lighthouse-between-us',
    title: 'The Lighthouse Between Us',
    seriesSlug: 'blue-harbor',
    seriesOrder: 2,
    releaseDate: '2024-06-04',
    shortHook:
      'Two ex-best friends inherit the same lighthouse and one impossible summer.',
    description:
      'Second-chance tenderness with coastal melancholy, shared history, and a visual identity that wants to sell the whole summer mood.',
    genres: ['contemporary'],
    vibes: ['coastal-comfort', 'protective-devotion'],
    tropes: ['second chance', 'shared inheritance', 'one summer'],
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
          'lighthouse-between-us-kindle',
          'Amazon Kindle',
          'Kindle',
          'ebook',
          'https://example.com/retail/the-lighthouse-between-us/kindle',
        ),
        retailerLink(
          'lighthouse-between-us-bookshop',
          'Bookshop',
          'Bookshop paperback',
          'paperback',
          'https://example.com/retail/the-lighthouse-between-us/bookshop',
        ),
      ],
      directSaleFormats: [
        unavailableDirectSale(
          'lighthouse-between-us-hardcover',
          'Signed sold out',
          'hardcover',
        ),
      ],
    },
  },
  {
    id: 'threaded-in-gold',
    slug: 'threaded-in-gold',
    title: 'Threaded in Gold',
    seriesSlug: 'tales-of-fate',
    seriesOrder: 1,
    releaseDate: '2023-09-19',
    shortHook:
      'A court tailor who can read destiny stitches himself into the prince’s undoing.',
    description:
      'A richer fantasy-historical lane with prophetic magic, court pressure, and romance built against the machinery of monarchy.',
    genres: ['fantasy', 'historical'],
    vibes: ['court-intrigue', 'protective-devotion'],
    tropes: ['royal intrigue', 'forbidden romance', 'fated mates'],
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
          'threaded-gold-kobo',
          'Kobo',
          'Kobo',
          'ebook',
          'https://example.com/retail/threaded-in-gold/kobo',
        ),
        retailerLink(
          'threaded-gold-bookshop',
          'Bookshop',
          'Bookshop paperback',
          'paperback',
          'https://example.com/retail/threaded-in-gold/bookshop',
        ),
      ],
      directSaleFormats: [
        stripePaymentLink(
          'threaded-gold-hardcover',
          'Foil signed',
          'hardcover',
          'https://buy.stripe.com/test_threaded_in_gold_foil_hardcover',
        ),
      ],
    },
  },
  {
    id: 'the-foxglove-prince',
    slug: 'the-foxglove-prince',
    title: 'The Foxglove Prince',
    seriesSlug: 'tales-of-fate',
    seriesOrder: 2,
    releaseDate: '2022-02-15',
    shortHook:
      'A healer marked by prophecy is betrothed to a prince who would rather break fate than obey it.',
    description:
      'A dramatic, romantically loaded fantasy with prophecy mechanics, emotional grandeur, and a clear appeal for readers who love courtly longing.',
    genres: ['fantasy', 'historical'],
    vibes: ['court-intrigue', 'darkly-devoted'],
    tropes: ['prophecy', 'betrothal', 'fate versus choice'],
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
          'foxglove-prince-kobo',
          'Kobo',
          'Kobo',
          'ebook',
          'https://example.com/retail/the-foxglove-prince/kobo',
        ),
        retailerLink(
          'foxglove-prince-audio',
          'Libro.fm',
          'Libro.fm audio',
          'audiobook',
          'https://example.com/retail/the-foxglove-prince/libro-fm',
        ),
      ],
      directSaleFormats: [],
    },
  },
  {
    id: 'ghost-circuit-hearts',
    slug: 'ghost-circuit-hearts',
    title: 'Ghost Circuit Hearts',
    seriesSlug: 'axios',
    seriesOrder: 1,
    releaseDate: '2024-03-12',
    shortHook:
      'A haunted city, a sentient archive, and two men trying not to fall in love while saving it.',
    description:
      'A sleeker fantasy-paranormal lane with spectral mystery, urban danger, and a romance that unfolds under constant pressure.',
    genres: ['fantasy', 'paranormal', 'spooky'],
    vibes: ['darkly-devoted', 'protective-devotion'],
    tropes: ['forced alliance', 'haunted city', 'slow burn'],
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
          'ghost-circuit-hearts-kindle',
          'Amazon Kindle',
          'Kindle',
          'ebook',
          'https://example.com/retail/ghost-circuit-hearts/kindle',
        ),
        retailerLink(
          'ghost-circuit-hearts-paperback',
          'Bookshop',
          'Bookshop paperback',
          'paperback',
          'https://example.com/retail/ghost-circuit-hearts/bookshop',
        ),
      ],
      directSaleFormats: [
        unavailableDirectSale(
          'ghost-circuit-hearts-hardcover',
          'Signed sold out',
          'hardcover',
        ),
      ],
    },
  },
  {
    id: 'steelheart-oath',
    slug: 'steelheart-oath',
    title: 'Steelheart Oath',
    seriesSlug: 'axios',
    seriesOrder: 2,
    releaseDate: '2025-02-11',
    shortHook:
      'A battle mage and the prince he failed are forced back into the same rebellion.',
    description:
      'A higher-intensity follow-up with action, political fallout, and second-chance devotion sharpened into a war story.',
    genres: ['fantasy', 'paranormal'],
    vibes: ['protective-devotion', 'darkly-devoted'],
    tropes: ['second chance', 'rebellion', 'bodyguard energy'],
    formats: ['ebook', 'paperback', 'audiobook'],
    featured: false,
    coverPalette: 'ember',
    purchase: {
      availabilityStatus: 'in_stock',
      merchandisingFlags: ['direct_from_author'],
      signedCopy: false,
      directFromAuthor: true,
      whereToBuyNote:
        'Direct paperback checkout stays on Stripe, while ebook and audio can route to your preferred retailers.',
      retailerLinks: [
        retailerLink(
          'steelheart-oath-kindle',
          'Amazon Kindle',
          'Kindle',
          'ebook',
          'https://example.com/retail/steelheart-oath/kindle',
        ),
        retailerLink(
          'steelheart-oath-audio',
          'Libro.fm',
          'Libro.fm audio',
          'audiobook',
          'https://example.com/retail/steelheart-oath/libro-fm',
        ),
      ],
      directSaleFormats: [
        stripePaymentLink(
          'steelheart-oath-paperback',
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
