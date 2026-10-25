import test from 'node:test';
import assert from 'node:assert/strict';
import { canonicalRedirectUrl } from '../src/lib/canonical.ts';

test('custom-domain redirects preserve page paths and queries while keeping API clients on their existing origin', () => {
  const site = new URL('https://authorjaclynosborn.com');
  const request = (path, method = 'GET') => new Request('https://jaclyn-osborn-site.karnestaylor.workers.dev' + path, { method });
  assert.equal(canonicalRedirectUrl(request('/books/galen/?from=newsletter'), site), 'https://authorjaclynosborn.com/books/galen/?from=newsletter');
  assert.equal(canonicalRedirectUrl(new Request('https://www.authorjaclynosborn.com/series/'), site), 'https://authorjaclynosborn.com/series/');
  for (const path of ['/api/portal/me/', '/api/media/image-id', '/api/admin/books/', '/admin/']) {
    assert.equal(canonicalRedirectUrl(request(path), site), undefined);
  }
  assert.equal(canonicalRedirectUrl(request('/books/', 'POST'), site), undefined);
  assert.equal(canonicalRedirectUrl(request('/books/'), new URL('https://jaclyn-osborn-site.karnestaylor.workers.dev')), undefined);
  assert.equal(canonicalRedirectUrl(new Request('https://authorjaclynosborn.com/books/'), site), undefined);
  assert.equal(canonicalRedirectUrl(new Request('http://authorjaclynosborn.com/login/'), site), 'https://authorjaclynosborn.com/login/');
  assert.equal(canonicalRedirectUrl(new Request('http://authorjaclynosborn.com/api/portal/settings/', { method: 'PUT' }), site), 'https://authorjaclynosborn.com/api/portal/settings/');
});
