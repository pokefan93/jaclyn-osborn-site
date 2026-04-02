import type { APIRoute } from 'astro';
import { errorResponse, jsonResponse } from '../../../../lib/api';
import { reorderBook } from '../../../../lib/catalog/repository';
import {
  getValidationMessage,
  reorderBookSchema,
} from '../../../../lib/catalog/validation';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const parsed = reorderBookSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(getValidationMessage(parsed.error), 400);
    }

    const book = await reorderBook(parsed.data);
    return jsonResponse({ ok: true, data: book });
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : 'Could not reorder the book.',
      400,
    );
  }
};
