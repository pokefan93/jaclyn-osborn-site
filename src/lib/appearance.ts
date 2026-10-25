// A small, deliberate set of accessible editorial palettes. Values are trusted
// constants; author input selects a key and never becomes executable CSS.
export const appearanceOptions = {
  palette: [['olive', 'Olive & cream'], ['ink', 'Ink & paper'], ['plum', 'Plum & linen'], ['clay', 'Clay & ivory']],
  homeLayout: [['cover-right', 'Featured book on the right'], ['cover-left', 'Featured book on the left'], ['centered', 'Centered introduction']],
  catalogDensity: [['airy', 'Roomy book cards'], ['compact', 'Compact bookshelf']],
  showSeries: [['show', 'Show series on homepage'], ['hide', 'Hide series on homepage']],
  showAuthor: [['show', 'Show author on homepage'], ['hide', 'Hide author on homepage']],
  showNewsletter: [['show', 'Show newsletter on homepage'], ['hide', 'Hide newsletter on homepage']],
} as const;

const palettes = {
  olive: ['#f5f2eb', '#242a25', '#53594f', '#666d61', '#354434', '#eeece3', '#faf8f2', '#d9d9cd', '#dce0cf', '#48583e', '#a8b296', '#344735', '#191f1b', '#202822', '#3d493c', '#efeee4', '#c9cebf', '#aab49f', '#d9e0c4'],
  ink: ['#f4f3ef', '#252b33', '#4f5965', '#616b76', '#293f57', '#e9ecee', '#fafaf7', '#d4d9dd', '#dce4e9', '#35495b', '#a2b2c0', '#24384c', '#191e25', '#222a33', '#414d5c', '#f1f2ee', '#c5ced8', '#a9b7c6', '#d3e2ef'],
  plum: ['#f5f0ed', '#352930', '#65515e', '#74626e', '#674454', '#eee4e7', '#fcf7f3', '#ded1d6', '#e8d9df', '#634554', '#bba0ae', '#513540', '#251b22', '#30232c', '#604552', '#f5eaf0', '#d8c5d0', '#c3aaba', '#eed3e1'],
  clay: ['#f7f1e9', '#372d28', '#68564c', '#79665a', '#794b38', '#eee3d7', '#fdf9f2', '#dfd1c3', '#e9d9c6', '#6c4937', '#c2a78e', '#654331', '#251e19', '#30271f', '#604f40', '#f4ede1', '#d8caba', '#c4af98', '#ecd4b6'],
} as const;
export function appearanceCss(palette: keyof typeof palettes) {
  const [bg, ink, copy, muted, accent, soft, card, border, feature, featureInk, featureBorder, panel, darkBg, darkCard, darkBorder, darkInk, darkCopy, darkMuted, darkAccent] = palettes[palette];
  const shared = `--feature-bg:${feature};--feature-ink:${featureInk};--feature-border:${featureBorder};--newsletter-bg:${panel};`;
  return `html[data-palette='${palette}']{${shared}--page-bg:${bg};--ink:${ink};--surface-strong:${ink};--surface-copy:${copy};--surface-muted:${muted};--surface-accent:${accent};--surface-soft:${soft};--card-bg:${card};--glass-bg:${bg};--card-border:${border};--glass-border:${border};--button-primary-bg:${accent};--button-primary-text:#fff;--button-primary-hover:${ink};--button-secondary-text:${accent};--button-secondary-border:${muted};--button-secondary-hover:${soft};--input-bg:${card};--input-border:${muted};--input-text:${ink};--input-placeholder:${muted};--tag-bg:${soft};--tag-text:${accent};--tag-border:${border};--format-bg:${card};--format-text:${accent};--format-border:${border};--nav-link-text:${copy};--nav-active-text:${ink}}html[data-palette='${palette}'][data-theme='dark']{--page-bg:${darkBg};--ink:${darkInk};--surface-strong:${darkInk};--surface-copy:${darkCopy};--surface-muted:${darkMuted};--surface-accent:${darkAccent};--surface-soft:${darkCard};--card-bg:${darkCard};--glass-bg:${darkBg};--card-border:${darkBorder};--glass-border:${darkBorder};--button-primary-bg:${darkAccent};--button-primary-text:${darkBg};--button-primary-hover:#fff;--button-secondary-text:${darkAccent};--button-secondary-border:${darkMuted};--button-secondary-hover:${darkCard};--input-bg:${darkCard};--input-border:${darkMuted};--input-text:${darkInk};--input-placeholder:${darkMuted};--tag-bg:${darkCard};--tag-text:${darkAccent};--tag-border:${darkBorder};--format-bg:${darkCard};--format-text:${darkAccent};--format-border:${darkBorder};--nav-link-text:${darkCopy};--nav-active-text:${darkInk}}`;
}
