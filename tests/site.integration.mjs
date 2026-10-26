import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Deliberately fixed to loopback: these tests must never write to production.
const base = 'http://127.0.0.1:4321';
const request = async (path, method = 'GET', body) => {
  const res = await fetch(base + path, {
    method,
    headers: {
      Origin: base,
      'Content-Type': 'application/json',
      Connection: 'close',
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return new Response(await res.arrayBuffer(), {
    status: res.status,
    headers: res.headers,
  });
};

test('public pages expose crawlable content, metadata and a working book sitemap', async () => {
  for (const path of [
    '/',
    '/books/',
    '/series/',
    '/about/',
    '/contact/',
    '/faq/',
    '/newsletter/',
  ]) {
    const response = await request(path);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, path);
    assert.match(html, /rel="canonical"/);
    assert.match(html, /property="og:image"/);
    assert.match(html, /application\/ld\+json/);
    assert.doesNotMatch(html, /fonts\.googleapis/);
    assert.doesNotMatch(html, /buy\.stripe\.com\/test_/);
  }
  const xml = await (await request('/sitemap.xml')).text();
  assert.match(xml, /books\/galen\//);
  assert.doesNotMatch(xml, /\/admin\//);
  for (const match of xml.matchAll(/<loc>[^<]+(\/books\/[^<]+)<\/loc>/g)) {
    const response = await request(match[1]);
    assert.equal(response.status, 200, match[1]);
  }
  assert.equal((await request('/books/not-a-real-book/')).status, 404);
});

test('content save persists, renders safely, and rejects unsafe URLs and cross-origin writes', async () => {
  const original = (await (await request('/api/admin/content/')).json()).data;
  try {
    const payload = {
      ...original,
      heroTitle: 'Local test <script>alert(1)</script>',
      newsletterUrl: 'https://example.com/signup',
    };
    const save = await request('/api/admin/content/', 'PUT', payload);
    assert.equal(save.status, 200);
    assert.equal((await save.json()).data.heroTitle, payload.heroTitle);
    const reopened = (await (await request('/api/admin/content/')).json()).data;
    assert.equal(reopened.arcEmail, original.arcEmail);
    assert.deepEqual(reopened.directSales, original.directSales);
    const home = await (await request('/')).text();
    assert.match(home, /Local test &lt;script&gt;/);
    assert.doesNotMatch(home, /<script>alert\(1\)<\/script>/);
    assert.match(home, /href="https:\/\/example.com\/signup"/);
    assert.equal(
      (
        await request('/api/admin/content/', 'PUT', {
          ...original,
          newsletterUrl: 'javascript:alert(1)',
        })
      ).status,
      400,
    );
    const csrf = await fetch(base + '/api/admin/content/', {
      method: 'PUT',
      headers: {
        Origin: 'https://other.example',
        'Content-Type': 'application/json',
        Connection: 'close',
      },
      body: JSON.stringify(original),
    });
    await csrf.text();
    assert.equal(csrf.status, 403);
  } finally {
    assert.equal(
      (await request('/api/admin/content/', 'PUT', original)).status,
      200,
    );
  }
});

test('book edits persist descriptions and filters; hidden books leave public pages and sitemap', async () => {
  const book = (
    await (await request('/api/admin/catalog/')).json()
  ).data.books.find((b) => b.slug === 'galen');
  assert.ok(book);
  const path = `/api/admin/books/${book.id}/`;
  try {
    const updated = {
      ...book,
      shortBlurb: 'Local integration test blurb',
      description: 'Local integration test full description',
      genres: ['paranormal'],
      formats: ['ebook'],
    };
    assert.equal((await request(path, 'PUT', updated)).status, 200);
    assert.match(
      await (await request('/books/galen/')).text(),
      /Local integration test full description/,
    );
    const saved = (
      await (await request('/api/admin/catalog/')).json()
    ).data.books.find((b) => b.id === book.id);
    assert.deepEqual(saved.genres, ['paranormal']);
    assert.deepEqual(saved.formats, ['ebook']);
    assert.equal(
      (await request(path, 'PUT', { ...updated, visible: false })).status,
      200,
    );
    assert.equal((await request('/books/galen/')).status, 404);
    assert.doesNotMatch(
      await (await request('/sitemap.xml')).text(),
      /books\/galen\//,
    );
    assert.equal(
      (
        await request(path, 'PUT', {
          ...book,
          amazonLink: 'javascript:alert(1)',
        })
      ).status,
      400,
    );
  } finally {
    assert.equal((await request(path, 'PUT', book)).status, 200);
  }
});

test('image upload stores and serves exact bytes, rejects non-images', async () => {
  const bytes = await readFile('public/images/social.jpg');
  const form = new FormData();
  form.set(
    'image',
    new File([bytes], 'local-test.jpg', { type: 'image/jpeg' }),
  );
  const response = await fetch(base + '/api/admin/media/', {
    method: 'POST',
    headers: { Origin: base },
    body: form,
  });
  assert.equal(response.status, 201);
  const { url } = await response.json();
  const image = await request(url);
  assert.equal(image.headers.get('content-type'), 'image/jpeg');
  assert.deepEqual(Buffer.from(await image.arrayBuffer()), bytes);
  const bad = new FormData();
  bad.set(
    'image',
    new File(['<svg onload="alert(1)"></svg>'], 'fake.png', {
      type: 'image/png',
    }),
  );
  assert.equal(
    (
      await fetch(base + '/api/admin/media/', {
        method: 'POST',
        headers: { Origin: base },
        body: bad,
      })
    ).status,
    400,
  );
});

test('series edits persist and can be hidden without losing book records', async () => {
  const original = (await (await request('/api/admin/series/')).json()).data[0];
  try {
    assert.equal(
      (
        await request('/api/admin/series/', 'PUT', {
          ...original,
          description: 'Local series test description',
          visible: false,
        })
      ).status,
      200,
    );
    const saved = (
      await (await request('/api/admin/series/')).json()
    ).data.find((s) => s.id === original.id);
    assert.equal(saved.description, 'Local series test description');
    assert.equal(saved.visible, false);
    assert.doesNotMatch(
      await (await request('/series/')).text(),
      /Local series test description/,
    );
    assert.equal((await request('/books/galen/')).status, 200);
    assert.equal(
      (await request('/api/admin/series/', 'PUT', { ...original, name: '' }))
        .status,
      400,
    );
  } finally {
    assert.equal(
      (await request('/api/admin/series/', 'PUT', original)).status,
      200,
    );
  }
});
