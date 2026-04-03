export function getDefaultCoverImagePath(slug: string) {
  return `/covers/${slug}.jpg`;
}

export function resolveCoverImagePath(input: {
  slug: string;
  coverImageUrl?: string | null;
}) {
  const coverImageUrl =
    typeof input.coverImageUrl === 'string' ? input.coverImageUrl.trim() : '';

  return coverImageUrl || getDefaultCoverImagePath(input.slug);
}

export function getDefaultCoverAlt(title: string) {
  return `Cover of ${title} by Jaclyn Osborn`;
}

export function resolveCoverAlt(input: {
  title: string;
  coverAlt?: string | null;
}) {
  const coverAlt = typeof input.coverAlt === 'string' ? input.coverAlt.trim() : '';

  return coverAlt || getDefaultCoverAlt(input.title);
}
