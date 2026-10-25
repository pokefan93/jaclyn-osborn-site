const domain = 'https://authorjaclynosborn.com';
const aliases = new Set([
  'www.authorjaclynosborn.com',
  'jaclyn-osborn-site.karnestaylor.workers.dev',
]);

export function canonicalRedirectUrl(request: Request, site?: URL) {
  // Activate only in a build made for the verified custom domain.
  if (site?.origin !== domain || !['GET', 'HEAD'].includes(request.method)) return;
  const current = new URL(request.url);
  if (!aliases.has(current.hostname) || /^\/(?:api|admin)(?:\/|$)/.test(current.pathname)) return;
  const destination = new URL(domain);
  destination.pathname = current.pathname;
  destination.search = current.search;
  return destination.toString();
}
