import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { seriesSchema } from '../../../lib/series';
import { slugify } from '../../../lib/catalog/shared';
import { jsonResponse, errorResponse } from '../../../lib/api';
export const GET: APIRoute = async () => {
  const { results } = await env.DB.prepare(
    'SELECT id,name,lane,tagline,description,entry_point AS entryPoint,visible,sort_priority AS sortPriority FROM series ORDER BY sort_priority,name',
  ).all();
  return jsonResponse({ok:true, data:results.map(row => ({...row, visible:Boolean(row.visible)}))});
};
export const PUT: APIRoute = async ({ request }) => {
  try {
    const parsed = seriesSchema.safeParse(await request.json());
    if (!parsed.success) return errorResponse(parsed.error.issues[0].message);
    const s = parsed.data;
    if (s.id) {
      const result = await env.DB.prepare(
        'UPDATE series SET name=?,lane=?,tagline=?,description=?,entry_point=?,visible=?,sort_priority=?,updated_at=CURRENT_TIMESTAMP WHERE id=?',
      )
        .bind(
          s.name,
          s.lane,
          s.tagline,
          s.description,
          s.entryPoint,
          Number(s.visible),
          s.sortPriority,
          s.id,
        )
        .run();
      if (!result.meta.changes) return errorResponse('Series not found.', 404);
    } else {
      const slug = slugify(s.name);
      if (!slug)
        return errorResponse(
          'Please use a name containing letters or numbers.',
        );
      if (
        await env.DB.prepare('SELECT id FROM series WHERE slug=?')
          .bind(slug)
          .first()
      )
        return errorResponse('A series with that name already exists.', 409);
      await env.DB.prepare(
        'INSERT INTO series (slug,name,lane,tagline,description,entry_point,visible,sort_priority) VALUES (?,?,?,?,?,?,?,?)',
      )
        .bind(
          slug,
          s.name,
          s.lane,
          s.tagline,
          s.description,
          s.entryPoint,
          Number(s.visible),
          s.sortPriority,
        )
        .run();
    }
    return jsonResponse({ ok: true });
  } catch {
    return errorResponse('Could not save this series.', 500);
  }
};
