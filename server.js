// Simple HTTP server using Node.js
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);
  
  // Normalize URL (remove query string and handle root)
  let filePath = path.join(__dirname, req.url.split('?')[0]);
  if (filePath === path.join(__dirname, '/')) {
    filePath = path.join(__dirname, '/index.html');
  }
  
  // Get file extension for MIME type
  const ext = path.extname(filePath);
  
  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // File not found - serve 404 page
      res.writeHead(404, {'Content-Type': 'text/html'});
      return fs.readFile(path.join(__dirname, '404.html'), (err, data) => {
        if (err) {
          res.end('404 Not Found');
        } else {
          res.end(data);
        }
      });
    }
    
    // File exists, serve it with proper MIME type
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, {'Content-Type': contentType});
    
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    
    fileStream.on('error', () => {
      res.writeHead(500, {'Content-Type': 'text/plain'});
      res.end('Internal Server Error');
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Press Ctrl+C to stop the server`);
});
