export function jsonResponse(payload: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  headers.set('content-type', 'application/json; charset=utf-8');

  return new Response(JSON.stringify(payload), {
    ...init,
    headers,
  });
}

export function errorResponse(message: string, status = 400) {
  return jsonResponse(
    {
      ok: false,
      error: message,
    },
    { status },
  );
}
