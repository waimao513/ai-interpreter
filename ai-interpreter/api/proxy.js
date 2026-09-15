export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const path = req.query.path || '';
  const url = 'https://dashscope.aliyuncs.com/' + path;

  const headers = {};
  for (const [key, value] of Object.entries(req.headers)) {
    const lower = key.toLowerCase();
    if (lower !== 'host' && lower !== 'origin' && lower !== 'referer') {
      headers[key] = value;
    }
  }

  let body = null;
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', async () => {
      body = Buffer.concat(chunks);
      try {
        const response = await fetch(url, {
          method: req.method,
          headers: headers,
          body: body.length > 0 ? body : undefined,
        });
        res.setHeader('Content-Type', response.headers.get('content-type') || 'application/octet-stream');
        res.status(response.status);
        const buffer = Buffer.from(await response.arrayBuffer());
        res.send(buffer);
      } catch (e) {
        res.status(502).json({ error: e.message });
      }
    });
  } else {
    (async () => {
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: headers,
        });
        res.setHeader('Content-Type', response.headers.get('content-type') || 'application/octet-stream');
        res.status(response.status);
        const buffer = Buffer.from(await response.arrayBuffer());
        res.send(buffer);
      } catch (e) {
        res.status(502).json({ error: e.message });
      }
    })();
  }
}
