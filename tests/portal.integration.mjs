import test from 'node:test';
import assert from 'node:assert/strict';
// Built production worker + LOCAL test control service. Never accepts a remote URL.
const base = 'http://127.0.0.1:8787';
async function call(
  path,
  method = 'GET',
  body,
  role = 'owner',
  origin = 'https://taylorstechsolutions.com',
) {
  const res = await fetch(base + '/api/portal/' + path + '/', {
    method,
    headers: {
      Authorization: 'Bearer local-test-' + role,
      Origin: origin,
      'Content-Type': 'application/json',
      Connection: 'close',
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const bytes = await res.arrayBuffer();
  return new Response(res.status === 204 ? null : bytes, {
    status: res.status,
    headers: res.headers,
  });
}
test('portal enforces identity, tenant, roles and origin in the production bundle', async () => {
  const noAuth = await fetch(base + '/api/portal/settings/');
  assert.equal(noAuth.status, 401);
  await noAuth.text();
  assert.equal(
    (await call('settings', 'GET', undefined, 'expired')).status,
    401,
  );
  assert.equal(
    (await call('settings', 'GET', undefined, 'other-site')).status,
    403,
  );
  assert.equal((await call('settings', 'PUT', {}, 'viewer')).status, 403);
  assert.equal(
    (await call('books/1', 'DELETE', undefined, 'editor')).status,
    403,
  );
  const viewer = await call('settings', 'GET', undefined, 'viewer');
  assert.equal(viewer.status, 200);
  assert.equal(viewer.headers.get('Cache-Control'), 'no-store');
  assert.equal(
    viewer.headers.get('Access-Control-Allow-Origin'),
    'https://taylorstechsolutions.com',
  );
  assert.equal(
    (await call('settings', 'PUT', {}, 'owner', 'https://unrelated.invalid'))
      .status,
    403,
  );
  const preflight = await call('settings', 'OPTIONS');
  assert.equal(preflight.status, 204);
  const standalone = await fetch(base + '/admin/');
  assert.equal(standalone.status, 401);
  await standalone.text();
});
test('portal saves page copy and FAQs to the public website immediately', async () => {
  const settings = await (await call('settings')).json();
  const faqs = await (await call('faqs')).json();
  try {
    const save = await call('settings', 'PUT', {
      ...settings,
      heroTitle: 'Portal saved <headline>',
    });
    assert.equal(save.status, 200, await save.text());
    assert.match(
      await (await fetch(base + '/')).text(),
      /Portal saved &lt;headline&gt;/,
    );
    assert.equal(
      (
        await call('settings', 'PUT', {
          ...settings,
          announcementUrl: 'javascript:alert(1)',
        })
      ).status,
      400,
    );
    assert.equal(
      (
        await call('faqs', 'PUT', [
          { question: 'Portal test question', answer: 'Persisted answer' },
        ])
      ).status,
      200,
    );
    assert.match(
      await (await fetch(base + '/faq/')).text(),
      /Persisted answer/,
    );
  } finally {
    assert.equal((await call('settings', 'PUT', settings)).status, 200);
    assert.equal((await call('faqs', 'PUT', faqs)).status, 200);
  }
});
test('portal book saves preserve multiple payment links, prices and reading order; hide is reflected in sitemap', async () => {
  const books = await (await call('books')).json();
  const original = books.find((b) => b.slug === 'galen');
  assert.ok(original);
  try {
    const updated = {
      ...original,
      releaseDate: '2021-04-14',
      seriesOrder: 2.5,
      sortPriority: -50,
      purchase: {
        ...original.purchase,
        displayPrice: '$12.00',
        directSaleFormats: [
          {
            label: 'Payhip ebook',
            format: 'ebook',
            purchaseMode: 'payhip',
            purchaseUrl: 'https://payhip.com/b/local-verification',
          },
          {
            label: 'Signed paperback',
            format: 'paperback',
            purchaseMode: 'external_retailer',
            purchaseUrl:
              'https://shop.jaclynosbornbooks.com/local-verification',
          },
        ],
      },
    };
    const save = await call('books/' + original.id, 'PUT', updated);
    assert.equal(save.status, 200, await save.text());
    const saved = (await (await call('books')).json()).find(
      (b) => b.id === original.id,
    );
    assert.equal(saved.seriesOrder, 2.5);
    assert.equal(saved.purchase.directSaleFormats.length, 2);
    assert.equal(saved.purchase.displayPrice, '$12.00');
    const adminBase='http://127.0.0.1:4321';
    const admin=(await (await fetch(adminBase+'/api/admin/catalog/')).json()).data.books.find(b=>String(b.id)===original.id);
    const legacySave=await fetch(adminBase+'/api/admin/books/'+original.id+'/',{method:'PUT',headers:{Origin:adminBase,'Content-Type':'application/json'},body:JSON.stringify({...admin,stripePaymentLink:'https://payhip.com/b/updated-verification'})});
    assert.equal(legacySave.status,200,await legacySave.text());
    const shared=(await (await call('books')).json()).find(b=>b.id===original.id);
    assert.equal(shared.purchase.directSaleFormats[0].purchaseUrl,'https://payhip.com/b/updated-verification');
    assert.equal(shared.purchase.directSaleFormats.length,2);
    assert.equal(shared.releaseDate,'2021-04-14');
    const html = await (await fetch(base + '/books/galen/')).text();
    assert.match(html, /\$12\.00/);
    assert.match(html, /payhip.com\/b\/updated-verification/);
    assert.equal(
      (await call('books/' + original.id, 'PUT', { ...saved, visible: false }))
        .status,
      200,
    );
    assert.equal((await fetch(base + '/books/galen/')).status, 404);
    assert.doesNotMatch(
      await (await fetch(base + '/sitemap.xml')).text(),
      /books\/galen\//,
    );
    assert.equal(
      (
        await call('books/' + original.id, 'PUT', {
          ...saved,
          purchase: {
            ...saved.purchase,
            directSaleFormats: [
              {
                label: 'Bad link',
                purchaseMode: 'payhip',
                purchaseUrl: 'javascript:alert(1)',
              },
            ],
          },
        })
      ).status,
      400,
    );
  } finally {
    const restored = await call('books/' + original.id, 'PUT', original);
    assert.equal(restored.status, 200, await restored.text());
  }
});
test('portal can create and remove a new book without changing existing book URLs', async () => {
  const original = (await (await call('books')).json())[0];
  let id;
  try {
    const r = await call('books', 'POST', {
      ...original,
      slug: 'local-portal-test',
      title: 'Local portal test',
    });
    const b = await r.json();
    assert.equal(r.status, 201, JSON.stringify(b));
    id = b.id;
    assert.equal((await fetch(base + '/books/local-portal-test/')).status, 200);
    assert.equal(
      (
        await call('books/' + id, 'PUT', {
          ...b,
          title: 'Renamed local portal test',
          slug: 'changed-address',
        })
      ).status,
      200,
    );
    assert.equal((await fetch(base + '/books/local-portal-test/')).status, 200);
  } finally {
    if (id) assert.equal((await call('books/' + id, 'DELETE')).status, 200);
  }
});
test('portal series updates reach the reading guide', async () => {
  const original = (await (await call('series')).json())[0];
  try {
    assert.equal(
      (
        await call('series', 'PUT', {
          ...original,
          description: 'Portal reading guide test',
        })
      ).status,
      200,
    );
    assert.match(
      await (await fetch(base + '/series/')).text(),
      /Portal reading guide test/,
    );
  } finally {
    assert.equal((await call('series', 'PUT', original)).status, 200);
  }
});
