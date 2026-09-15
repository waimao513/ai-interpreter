export default async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
        'Access-Control-Allow-Headers': '*',
      },
    });
  }

  const url = new URL(request.url);
  const path = url.searchParams.get('path') || '';
  const target = 'https://dashscope.aliyuncs.com/' + path;

  const headers = new Headers();
  for (const [key, value] of request.headers.entries()) {
    const lower = key.toLowerCase();
    if (lower !== 'host' && lower !== 'origin' && lower !== 'referer') {
      headers.set(key, value);
    }
  }

  const options = { method: request.method, headers: headers };
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    options.body = await request.text();
  }

  const response = await fetch(target, options);

  const respHeaders = new Headers(response.headers);
  respHeaders.set('Access-Control-Allow-Origin', '*');

  return new Response(response.body, {
    status: response.status,
    headers: respHeaders,
  });
};

export const config = {
  path: "/api/proxy",
};
