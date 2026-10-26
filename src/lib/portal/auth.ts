export type PortalIdentity = {
  uid: string;
  email: string | null;
  siteId: 'jaclyn';
  role: 'owner' | 'editor' | 'viewer';
};
export type ControlFetcher = { fetch: typeof fetch };
export const portalOrigins = new Set([
  'https://taylorstechsolutions.com',
  'https://www.taylorstechsolutions.com',
  'https://taylorstechsite-5982d.web.app',
  'https://taylorstechsite-5982d.firebaseapp.com',
]);
export async function authorizePortal(
  request: Request,
  control?: ControlFetcher,
): Promise<PortalIdentity> {
  const authorization = request.headers.get('Authorization') ?? '';
  if (!/^Bearer [^\s]{1,8192}$/.test(authorization))
    throw new Response('Sign in through Taylor’s Tech Solutions.', {
      status: 401,
    });
  if (!control)
    throw new Response('The site editor connection is not configured.', {
      status: 503,
    });
  let response: Response;
  try {
    response = await control.fetch(
      'https://tts-control.karnestaylor.workers.dev/api/control/authorize?siteId=jaclyn',
      {
        headers: { Authorization: authorization },
        redirect: 'manual',
        signal: AbortSignal.timeout(8000),
      },
    );
  } catch (error) {
    console.error(
      'Portal authorization service unavailable:',
      error instanceof Error ? error.message : 'Unknown error',
    );
    throw new Response('Unable to verify site access. Please try again.', {
      status: 503,
    });
  }
  if (!response.ok)
    throw new Response(
      response.status === 401
        ? 'Please sign in again.'
        : 'You do not have access to this site.',
      {
        status:
          response.status === 401 ? 401 : response.status === 403 ? 403 : 503,
      },
    );
  const identity = (await response.json()) as PortalIdentity;
  if (
    !identity.uid ||
    typeof identity.uid !== 'string' ||
    identity.siteId !== 'jaclyn' ||
    !['owner', 'editor', 'viewer'].includes(identity.role)
  )
    throw new Response('Site access could not be verified.', { status: 403 });
  if (!['GET', 'HEAD'].includes(request.method) && identity.role === 'viewer')
    throw new Response('Your account has view-only access.', { status: 403 });
  return identity;
}
