const http = require('http');

const server = http.createServer((req, res) => {
  const { method, url } = req;

  // @endpoint GET /health
  if (method === 'GET' && url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', service: 'identity-api' }));
    return;
  }

  // @endpoint GET /users
  if (method === 'GET' && url === '/users') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      users: [
        { id: '1', name: 'Alice', email: 'alice@example.com' },
        { id: '2', name: 'Bob', email: 'bob@example.com' }
      ]
    }));
    return;
  }

  // @endpoint GET /users/:id
  if (method === 'GET' && url.match(/^\/users\/[^/]+$/)) {
    const id = url.split('/')[2];
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      user: {
        id: id,
        name: 'Alice',
        email: 'alice@example.com'
      }
    }));
    return;
  }

  // @endpoint POST /users
  if (method === 'POST' && url === '/users') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      let parsed = {};
      try { parsed = JSON.parse(body); } catch (e) { parsed = {}; }
      const newUser = {
        id: Math.random().toString(36).substring(2, 10) + Date.now().toString(36),
        name: parsed.name || 'Unknown',
        email: parsed.email || 'unknown@example.com'
      };
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ user: newUser }));
    });
    return;
  }

  // Fallback 404
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Mock route not defined', method, url }));
});

const PORT = process.env.PORT || 4500;
server.listen(PORT, () => {});
