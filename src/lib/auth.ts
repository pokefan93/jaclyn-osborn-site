import { createRemoteJWKSet, jwtVerify } from 'jose';

const keysets = new Map<string, ReturnType<typeof createRemoteJWKSet>>();
export async function verifyAccess(
  request: Request,
  team: string,
  audience: string,
) {
  if (!team || !audience) return false;
  try {
    const issuer = new URL(team);
    if (
      issuer.protocol !== 'https:' ||
      !issuer.hostname.endsWith('.cloudflareaccess.com') ||
      issuer.pathname !== '/'
    )
      return false;
    const token = request.headers.get('Cf-Access-Jwt-Assertion');
    if (!token) return false;
    const origin = issuer.origin;
    let keys = keysets.get(origin);
    if (!keys) {
      keys = createRemoteJWKSet(new URL('/cdn-cgi/access/certs', origin));
      keysets.set(origin, keys);
    }
    await jwtVerify(token, keys, {
      issuer: origin,
      audience,
      algorithms: ['RS256'],
    });
    return true;
  } catch {
    return false;
  }
}
