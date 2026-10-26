import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { contentSchema, getSiteContent } from '../../../lib/content';
import { jsonResponse, errorResponse } from '../../../lib/api';

export const GET: APIRoute = async () =>
  jsonResponse({ ok: true, data: await getSiteContent() });
export const PUT: APIRoute = async ({ request }) => {
  try {
    const parsed = contentSchema.safeParse(await request.json());
    if (!parsed.success)
      return errorResponse(
        parsed.error.issues
          .map((i) => `${i.path.join('.')}: ${i.message}`)
          .join('\n'),
      );
    await env.DB.prepare(
      "INSERT INTO site_settings (key,value) VALUES ('site_content',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=CURRENT_TIMESTAMP",
    )
      .bind(JSON.stringify(parsed.data))
      .run();
    return jsonResponse({ ok: true, data: await getSiteContent() });
  } catch (error) {
    console.error('Content save failed', error);
    return errorResponse('Could not save. Please try again.', 500);
  }
};
