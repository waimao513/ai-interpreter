export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const path = req.query.path;
  const target = 'https://dashscope.aliyuncs.com/' + path;

  const headers = {};
  if (req.headers.authorization) headers['Authorization'] = req.headers.authorization;
  if (req.headers['content-type']) headers['Content-Type'] = req.headers['content-type'];

  const fetchOptions = { method: req.method, headers: headers };
  if (req.method === 'POST') {
    fetchOptions.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
  }

  try {
    const resp = await fetch(target, fetchOptions);
    const data = await resp.arrayBuffer();
    res.setHeader('Content-Type', resp.headers.get('content-type') || 'application/json');
    res.status(resp.status);
    res.send(Buffer.from(data));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
