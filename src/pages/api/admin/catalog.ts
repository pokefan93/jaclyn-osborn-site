import type { APIRoute } from 'astro';
import { errorResponse, jsonResponse } from '../../../lib/api';
import { getAdminCatalogSnapshot } from '../../../lib/catalog/repository';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const data = await getAdminCatalogSnapshot();
    return jsonResponse({ ok: true, data });
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : 'Could not load the catalog.',
      500,
    );
  }
};
