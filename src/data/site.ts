export const siteMeta = {
  name: 'Jaclyn Osborn',
  title: 'Jaclyn Osborn | M/M Romance',
  description:
    'M/M romance by Jaclyn Osborn across contemporary, fantasy, paranormal, and historical worlds.',
  shortTagline: 'Author, coffee addict, & anime lover.',
  heroTitle: 'Romance with soft hearts, supernatural teeth, and a second cup of coffee.',
  heroCopy:
    'M/M romance across contemporary, fantasy, paranormal, and historical worlds. Find a series you love and settle in.',
  longBio:
    'Jaclyn Osborn writes M/M romance - contemporary, fantasy, paranormal, historical, and everything in between. She believes in happy endings, emotional connection, and the kind of story you stay up too late to finish. When she\'s not writing, she\'s probably drinking coffee and rewatching her favorite anime.',
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
      'Signed copies are packed manually from Jaclyn\'s personal stock.',
    shippingNote:
      'Shipping details coming soon.',
    fulfillmentNote:
      'Signed orders ship from Jaclyn\'s personal stock. Check the listing for current packing windows.',
    whereToBuyNote:
      'Signed and direct editions use Stripe-hosted checkout. Standard editions and audio are also available from the retailers listed below.',
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

export const newsletterArchive: { title: string; copy: string }[] = [];

export const faqItems = [
  {
    question: 'Where should a new reader start?',
    answer:
      'Check the series page for entry-point recommendations. Blue Harbor and Unexpected Love are great starting places for contemporary romance. Ivy Grove is a warm entry into paranormal. Sons of the Fallen is the place to start for high-stakes paranormal fantasy.',
  },
  {
    question: 'Do I need to read the series in order?',
    answer:
      'Most series follow different main characters per book and can be enjoyed on their own, but reading in order gives you the richest experience. Each series page shows the recommended reading order.',
  },
  {
    question: 'Are signed copies available?',
    answer:
      'Signed copies are available directly from Jaclyn for select titles. Check the individual book listing for current availability - stock is limited and ships manually from Jaclyn\'s personal supply.',
  },
  {
    question: 'How do I sign up for the newsletter?',
    answer:
      'Head to the newsletter page and add your email. You\'ll hear about new releases, cover reveals, signed copy restocks, and the occasional personal note from Jaclyn.',
  },
  {
    question: 'Where can I buy the books?',
    answer:
      'All titles are available from major retailers including Amazon, Kobo, Bookshop.org, and Apple Books. Select titles also have audiobook editions on Libro.fm. Signed and direct copies are available here when in stock.',
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
