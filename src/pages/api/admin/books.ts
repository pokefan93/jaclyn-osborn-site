import type { APIRoute } from 'astro';
import { errorResponse, jsonResponse } from '../../../lib/api';
import { createBook } from '../../../lib/catalog/repository';
import {
  adminBookInputSchema,
  getValidationMessage,
} from '../../../lib/catalog/validation';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const parsed = adminBookInputSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(getValidationMessage(parsed.error), 400);
    }

    const book = await createBook(parsed.data);
    return jsonResponse({ ok: true, data: book }, { status: 201 });
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : 'Could not create the book.',
      400,
    );
  }
};
