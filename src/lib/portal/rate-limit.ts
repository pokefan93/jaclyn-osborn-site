export type EditorRateLimiter = { limit(options: {key: string}): Promise<{success: boolean}> };

export async function enforceEditorLimit(limiter: EditorRateLimiter | undefined, key: string) {
  if (!limiter) throw new Response('Editor protection is unavailable. Please try again.', {status:503});
  let result: {success:boolean};
  try { result = await limiter.limit({key}); }
  catch { throw new Response('Editor protection is temporarily unavailable. Please try again.', {status:503}); }
  if (!result.success) throw new Response('Too many editor requests. Wait a minute and try again.', {
    status:429,headers:{'Retry-After':'60'},
  });
}

export async function editorActorKey(kind: 'ip' | 'user', value: string) {
  const digest = await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value));
  return 'jaclyn:editor:v1:'+kind+':'+Array.from(new Uint8Array(digest),byte=>byte.toString(16).padStart(2,'0')).join('');
}
