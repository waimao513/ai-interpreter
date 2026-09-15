export const config = { runtime: 'edge' };

export default async function handler(req) {
  const url = new URL(req.url);
  const path = url.searchParams.get('path') || '';
  const target = 'https://dashscope.aliyuncs.com/' + path;

  const headers = new Headers();
  for (const [key, value] of req.headers.entries()) {
    const lower = key.toLowerCase();
    if (lower !== 'host' && lower !== 'origin' && lower !== 'referer') {
      headers.set(key, value);
    }
  }

  const options = { method: req.method, headers: headers };

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    options.body = await req.text();
  }

  const response = await fetch(target, options);

  const respHeaders = new Headers(response.headers);
  respHeaders.set('Access-Control-Allow-Origin', '*');

  return new Response(response.body, {
    status: response.status,
    headers: respHeaders,
  });
}
