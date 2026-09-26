const http = require('http');
const fs = require('fs');
const path = require('path');
const root = 'C:/Users/USER/Desktop/moddownloader/moddownloader-website';
http.createServer((req, res) => {
  let f = decodeURIComponent(req.url.split('?')[0]);
  if (f === '/') f = '/index.html';
  const fp = path.join(root, f);
  fs.readFile(fp, (e, d) => {
    if (e) { res.writeHead(404); res.end('nf'); return; }
    const ext = path.extname(fp);
    const m = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.svg': 'image/svg+xml' };
    res.writeHead(200, { 'Content-Type': m[ext] || 'application/octet-stream' });
    res.end(d);
  });
}).listen(8765, '127.0.0.1', () => console.log('up'));
