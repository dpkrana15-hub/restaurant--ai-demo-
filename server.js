const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.ANTHROPIC_API_KEY || '';

// MIME types
const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

function setCORS(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url);

  // CORS preflight
  if (req.method === 'OPTIONS') {
    setCORS(res);
    res.writeHead(204);
    res.end();
    return;
  }

  // API proxy endpoint
  if (req.method === 'POST' && parsed.pathname === '/api/generate') {
    setCORS(res);

    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      let payload;
      try { payload = JSON.parse(body); }
      catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
        return;
      }

      if (!API_KEY) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'ANTHROPIC_API_KEY not set on server' }));
        return;
      }

      const requestBody = JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        stream: true,
        system: 'You are an AI assistant helping a restaurant generate professional, warm, human-sounding content. Be specific and sensory. Avoid clichés. Output only the requested content — no preamble or explanation.',
        messages: [{ role: 'user', content: payload.prompt }]
      });

      const options = {
        hostname: 'api.anthropic.com',
        port: 443,
        path: '/v1/messages',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
          'anthropic-version': '2023-06-01',
          'Content-Length': Buffer.byteLength(requestBody)
        }
      };

      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*'
      });

      const apiReq = https.request(options, (apiRes) => {
        apiRes.on('data', chunk => res.write(chunk));
        apiRes.on('end', () => res.end());
      });

      apiReq.on('error', (e) => {
        res.write(`data: ${JSON.stringify({ error: e.message })}\n\n`);
        res.end();
      });

      apiReq.write(requestBody);
      apiReq.end();
    });
    return;
  }

  // Serve static files
  let filePath = parsed.pathname === '/' ? '/index.html' : parsed.pathname;
  filePath = path.join(__dirname, 'public', filePath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'text/plain' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`✅ Restaurant AI server running on port ${PORT}`);
});
