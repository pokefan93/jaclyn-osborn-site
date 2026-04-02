import type { APIRoute } from 'astro';
import { errorResponse, jsonResponse } from '../../../../lib/api';
import { deleteBook, updateBook } from '../../../../lib/catalog/repository';
import {
  adminBookInputSchema,
  getValidationMessage,
} from '../../../../lib/catalog/validation';

export const prerender = false;

function parseBookId(value: string | undefined) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export const PUT: APIRoute = async ({ params, request }) => {
  const bookId = parseBookId(params.id);

  if (!bookId) {
    return errorResponse('A valid book id is required.', 400);
  }

  try {
    const body = await request.json();
    const parsed = adminBookInputSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(getValidationMessage(parsed.error), 400);
    }

    const book = await updateBook(bookId, parsed.data);
    return jsonResponse({ ok: true, data: book });
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : 'Could not update the book.',
      400,
    );
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  const bookId = parseBookId(params.id);

  if (!bookId) {
    return errorResponse('A valid book id is required.', 400);
  }

  try {
    await deleteBook(bookId);
    return jsonResponse({ ok: true });
  } catch (error) {
    return errorResponse(
      error instanceof Error ? error.message : 'Could not delete the book.',
      400,
    );
  }
};
