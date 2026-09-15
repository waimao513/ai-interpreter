const https = require('https');
const url = require('url');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const parsed = url.parse(req.url, true);
  const targetPath = parsed.query.path || '';
  const targetUrl = 'https://dashscope.aliyuncs.com/' + targetPath;

  let body = '';
  for await (const chunk of req) {
    body += chunk;
  }

  const headers = {};
  if (req.headers.authorization) {
    headers['Authorization'] = req.headers.authorization;
  }
  if (req.headers['content-type']) {
    headers['Content-Type'] = req.headers['content-type'];
  }
  if (body) {
    headers['Content-Length'] = Buffer.byteLength(body);
  }

  const options = {
    method: req.method,
    headers: headers,
  };

  const proxyReq = https.request(targetUrl, options, (proxyRes) => {
    res.setHeader('Content-Type', proxyRes.headers['content-type'] || 'application/json');
    res.status(proxyRes.statusCode);
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (e) => {
    res.status(502).json({ error: e.message });
  });

  if (body) {
    proxyReq.write(body);
  }
  proxyReq.end();
};
