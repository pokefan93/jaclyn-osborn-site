export function withBase(path = '') {
  if (!path) {
    return import.meta.env.BASE_URL;
  }

  if (/^(https?:|mailto:|tel:|#)/.test(path)) {
    return path;
  }

  const base = import.meta.env.BASE_URL || '/';
  const url = new URL(path.replace(/^\/+/, ''), `https://example.com${base}`);

  return `${url.pathname}${url.search}${url.hash}`;
}
