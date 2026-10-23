import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { jsonResponse, errorResponse } from '../../../lib/api';
export const POST: APIRoute = async ({ request }) => {
  try {
    const form = await request.formData();
    const file = form.get('image');
    if (!(file instanceof File) || file.size > 1_000_000)
      return errorResponse('Choose a JPG, PNG, or WebP image under 1 MB.');
    const bytes = new Uint8Array(await file.arrayBuffer());
    const jpeg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
    const png = [137, 80, 78, 71, 13, 10, 26, 10].every(
      (n, i) => bytes[i] === n,
    );
    const webp =
      new TextDecoder().decode(bytes.slice(0, 4)) === 'RIFF' &&
      new TextDecoder().decode(bytes.slice(8, 12)) === 'WEBP';
    const type = jpeg
      ? 'image/jpeg'
      : png
        ? 'image/png'
        : webp
          ? 'image/webp'
          : null;
    if (!type) return errorResponse('This file is not a supported image.');
    const id = crypto.randomUUID();
    await env.DB.prepare(
      'INSERT INTO media (id,filename,content_type,data) VALUES (?,?,?,?)',
    )
      .bind(id, file.name.slice(0, 200), type, bytes)
      .run();
    return jsonResponse(
      { ok: true, url: `/api/media/${id}/` },
      { status: 201 },
    );
  } catch {
    return errorResponse('Upload failed. Please try again.', 500);
  }
};
