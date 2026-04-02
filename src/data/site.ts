export const siteMeta = {
  name: 'Jaclyn Osborn',
  title: 'Jaclyn Osborn | M/M Romance',
  description:
    'M/M romance by Jaclyn Osborn across contemporary, fantasy, paranormal, and historical stories.',
  shortTagline: 'Author, coffee addict, & anime lover.',
  heroTitle: 'M/M romance by Jaclyn Osborn.',
  heroCopy:
    'Explore contemporary, fantasy, paranormal, and historical stories, along with series reading order, book details, and updates.',
  longBio:
    'Jaclyn Osborn is a bestselling M/M romance author writing across contemporary, fantasy, paranormal, and historical stories. When she is not writing, she is usually drinking coffee or watching anime.',
  instagramUrl: 'https://instagram.com/jaclynosbornauthor',
  newsletterUrl: 'mailto:hello@jaclynosbornbooks.com?subject=Newsletter%20Signup',
  email: 'hello@jaclynosbornbooks.com',
  mediaEmail: 'media@jaclynosbornbooks.com',
  rightsEmail: 'rights@jaclynosbornbooks.com',
  arcEmail: 'arc@jaclynosbornbooks.com',
  directSales: {
    thankYouPath: '/thank-you/',
    stripeBuyButtonPublishableKey: '',
    signedCopyNote:
      'Signed copy updates will be shared on the site and in the newsletter.',
    shippingNote: '',
    fulfillmentNote: '',
    whereToBuyNote: '',
  },
};

export const navItems = [
  { href: '/', label: 'Home' },
  { href: '/books/', label: 'Books' },
  { href: '/series/', label: 'Series' },
  { href: '/about/', label: 'About' },
  { href: '/newsletter/', label: 'Newsletter' },
];

export const newsletterBenefits = [
  'Release news and preorder announcements',
  'Cover reveals and signed copy updates',
  'Occasional notes from Jaclyn',
];

export const socialPreviewCards = [
  {
    title: 'Writing Updates',
    copy: 'Writing progress, desk moments, and plenty of coffee.',
    accent: 'from-[#e9cbb6] via-[#f5e4d8] to-[#d5b4b2]',
  },
  {
    title: 'Cover Reveals',
    copy: 'New release graphics, early peeks, and bookish updates.',
    accent: 'from-[#b0d7d6] via-[#dfeeed] to-[#f7f2ed]',
  },
  {
    title: 'Everyday Favorites',
    copy: 'Anime, reading life, and the little things in between.',
    accent: 'from-[#6d4456] via-[#b97e79] to-[#f0d7c4]',
  },
];

export const faqItems = [
  {
    question: 'Where should a new reader start?',
    answer:
      'If you want contemporary romance, Blue Harbor and Unexpected Love are great places to begin. If you want paranormal romance, start with Ivy Grove or Sons of the Fallen. If you want historical fantasy, try Tales of Fate.',
  },
  {
    question: 'Do I need to read the series in order?',
    answer:
      'The books are easiest to follow in series order. The series page lists each series in reading order and points you to the best place to start.',
  },
  {
    question: 'Are signed copies available?',
    answer:
      'Signed copy and direct shop updates will be shared here on the site and in the newsletter.',
  },
  {
    question: 'How do I sign up for the newsletter?',
    answer:
      'Visit the newsletter page and add your email to get release news, cover reveals, and signed copy updates.',
  },
  {
    question: 'Where can I buy the books?',
    answer:
      'Retailer links and direct shop updates will be added here as they are ready. The newsletter is also a good place to hear about new links.',
  },
];

export const contactCards = [
  {
    title: 'Reader mail',
    copy: 'Questions, kind notes, and general hello messages.',
    label: 'Email Jaclyn',
    href: `mailto:${siteMeta.email}`,
  },
  {
    title: 'Media & events',
    copy: 'Interviews, guest spots, event invitations, and appearance requests.',
    label: 'Media contact',
    href: `mailto:${siteMeta.mediaEmail}`,
  },
  {
    title: 'Rights & business',
    copy: 'Rights, translation, audio, and other business inquiries.',
    label: 'Business contact',
    href: `mailto:${siteMeta.rightsEmail}`,
  },
];
