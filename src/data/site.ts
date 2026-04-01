export const siteMeta = {
  name: 'Jaclyn Osborn',
  title: 'Jaclyn Osborn | Romantic Worlds With Teeth and Heart',
  description:
    'A polished static concept site for Jaclyn Osborn: M/M romance, cozy contemporary tenderness, and paranormal/fantasy atmosphere.',
  shortTagline: 'Author, coffee addict, & anime lover.',
  heroTitle: 'Romance with soft hearts, supernatural teeth, and a second cup of coffee.',
  heroCopy:
    'This concept storefront is built to help readers find their lane fast, whether they want cozy contemporary comfort, small-town magic, portal fantasy chaos, or paranormal devotion with bite.',
  longBio:
    'Jaclyn Osborn writes M/M romance across contemporary, fantasy, paranormal, historical, and spooky lanes. The brand space is big on yearning, warmth, danger, and character-first chemistry, with room for coffee-fueled tenderness, anime-level emotional stakes, and a backlist built for bingeing.',
  instagramUrl: 'https://instagram.com/jaclynosbornauthor',
  newsletterUrl: 'https://example.com/jaclyn-osborn-newsletter',
  newsletterFormAction: 'https://example.com/jaclyn-osborn-newsletter/signup',
  email: 'hello@jaclynosbornbooks.com',
  mediaEmail: 'media@jaclynosbornbooks.com',
  rightsEmail: 'rights@jaclynosbornbooks.com',
  arcEmail: 'arc@jaclynosbornbooks.com',
  directSales: {
    thankYouPath: '/thank-you/',
    stripeBuyButtonPublishableKey: '',
    signedCopyNote:
      'Signed copies and special direct editions are packed manually from Jaclyn’s stock.',
    shippingNote:
      'Shipping placeholder: add destinations, packaging details, and any exclusions before launch.',
    fulfillmentNote:
      'Fulfillment placeholder: add the current packing window so readers know when direct-sale orders ship.',
    whereToBuyNote:
      'Direct editions use Stripe-hosted checkout. Standard editions and audio can also be bought from the retailers listed here.',
  },
};

export const navItems = [
  { href: '/', label: 'Home' },
  { href: '/books/', label: 'Books' },
  { href: '/series/', label: 'Series' },
  { href: '/about/', label: 'About' },
  { href: '/newsletter/', label: 'Newsletter' },
  { href: '/contact/', label: 'Contact' },
  { href: '/faq/', label: 'FAQ' },
];

export const vibeCards = [
  {
    slug: 'darkly-devoted',
    title: 'Darkly devoted',
    description:
      'Protective monsters, fallen angels, haunted bargains, and obsession handled with a soft center.',
  },
  {
    slug: 'cozy-small-town',
    title: 'Cozy small-town',
    description:
      'Bake sales, harbors, inns, and everyday tenderness with enough longing to power a weekend binge.',
  },
  {
    slug: 'spooky-sweet',
    title: 'Spooky sweet',
    description:
      'Ghosts, witches, storm-lit mansions, and warmth-forward romance that still lets the shadows flirt.',
  },
  {
    slug: 'portal-fantasy-chaos',
    title: 'Portal fantasy chaos',
    description:
      'Fish-out-of-water leads, magical politics, and irreverent humor braided into high-romance fantasy.',
  },
  {
    slug: 'court-intrigue',
    title: 'Court intrigue',
    description:
      'Royal pressure, prophetic threads, and historical fantasy yearning built for readers who want scale.',
  },
  {
    slug: 'coastal-comfort',
    title: 'Coastal comfort',
    description:
      'Salt air, second chances, healing arcs, and modern love stories with a slow, luminous pulse.',
  },
];

export const newsletterBenefits = [
  'Release alerts and preorder news',
  'Reading-order guides and backlist spotlights',
  'Bonus epilogues, cover reveals, and seasonal mood boards',
];

export const socialPreviewCards = [
  {
    title: 'Desk Rituals',
    copy: 'Coffee, annotations, late-night drafting, and the quiet chaos behind every release week.',
    accent: 'from-[#e9cbb6] via-[#f5e4d8] to-[#d5b4b2]',
  },
  {
    title: 'Anime Energy',
    copy: 'Character playlists, emotional damage rankings, and the scenes that absolutely deserved a dramatic soundtrack.',
    accent: 'from-[#b0d7d6] via-[#dfeeed] to-[#f7f2ed]',
  },
  {
    title: 'Cover Teases',
    copy: 'Fresh release graphics, trope stacks, signed-copy drops, and a steady stream of reader bait.',
    accent: 'from-[#6d4456] via-[#b97e79] to-[#f0d7c4]',
  },
];

export const newsletterArchive = [
  {
    title: 'A moody spring reading stack',
    copy: 'A curator-style note linking cozy comfort reads with paranormal bite and direct entry points.',
  },
  {
    title: 'Signed copies + preorder extras',
    copy: 'A launch-week message that mixes storefront urgency with warm personal voice and clear next actions.',
  },
  {
    title: 'Behind the series map',
    copy: 'A reader-letter concept that explains where to start across Jaclyn’s worlds and what mood each one delivers.',
  },
];

export const faqItems = [
  {
    question: 'Where should a new reader start?',
    answer:
      'Start with the series page and use the entry-point callouts. Blue Harbor is the softest contemporary entry, Ivy Grove is the coziest paranormal entry, and Sons of the Fallen is the high-stakes paranormal/fantasy lane.',
  },
  {
    question: 'Is this site fully static?',
    answer:
      'Yes. The build is designed for GitHub Pages with no server-side runtime. Catalog filtering happens client-side, and newsletter/contact actions are structured so they can point to external providers later.',
  },
  {
    question: 'Can signed copies live here without a backend?',
    answer:
      'Yes. This version is designed around Stripe Payment Links for direct sales, which keeps checkout hosted by Stripe and avoids shipping any secret keys or custom cart logic to GitHub Pages.',
  },
  {
    question: 'How should the newsletter be wired up later?',
    answer:
      'Swap the placeholder `newsletterFormAction` in the seed content for a MailerLite, ConvertKit, Buttondown, or Beehiiv embed endpoint. The page markup is already structured for an external form action.',
  },
  {
    question: 'Is the book metadata real?',
    answer:
      'The structure is production-minded, but the current titles, hooks, purchase links, and availability labels are representative seed content built around the named series. Replace anything placeholder before launch.',
  },
];

export const contactCards = [
  {
    title: 'Reader mail',
    copy: 'Questions, event invites, and general hello messages.',
    label: 'Email Jaclyn',
    href: `mailto:${siteMeta.email}`,
  },
  {
    title: 'Media & podcast',
    copy: 'Interviews, guest posts, conventions, and branded collaboration requests.',
    label: 'Media contact',
    href: `mailto:${siteMeta.mediaEmail}`,
  },
  {
    title: 'Rights & translation',
    copy: 'Foreign rights, audio inquiries, and format expansion conversations.',
    label: 'Rights contact',
    href: `mailto:${siteMeta.rightsEmail}`,
  },
  {
    title: 'ARC & promo',
    copy: 'Street team, early review coordination, and launch support questions.',
    label: 'ARC contact',
    href: `mailto:${siteMeta.arcEmail}`,
  },
];
