// Enhanced Simple HTTP Server
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;
console.log(`Starting enhanced server on port ${PORT}...`);

// Extended MIME types
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
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'font/otf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
  '.webp': 'image/webp'
};

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);
  
  // Handle directory requests to serve index.html
  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './index.html';
  }
  
  // Clean up URL parameters
  filePath = filePath.split('?')[0];
  
  const extname = path.extname(filePath);
  let contentType = MIME_TYPES[extname] || 'application/octet-stream';
  
  // Read file with improved error handling
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT' || err.code === 'EISDIR') {
        // Try to find an index.html in directory
        if (!extname) {
          const indexPath = path.join(filePath, 'index.html');
          fs.readFile(indexPath, (err2, content2) => {
            if (err2) {
              // Try 404.html
              fs.readFile('./404.html', (err3, content3) => {
                if (err3) {
                  res.writeHead(404, {'Content-Type': 'text/html'});
                  res.end('<h1>404 Not Found</h1><p>The requested resource could not be found.</p>');
                } else {
                  res.writeHead(404, {'Content-Type': 'text/html'});
                  res.end(content3);
                }
              });
            } else {
              res.writeHead(200, {'Content-Type': 'text/html'});
              res.end(content2);
            }
          });
          return;
        }
        
        // Not a directory, just a missing file
        fs.readFile('./404.html', (err2, content2) => {
          if (err2) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end('<h1>404 Not Found</h1><p>The requested resource could not be found.</p>');
          } else {
            res.writeHead(404, {'Content-Type': 'text/html'});
            res.end(content2);
          }
        });
      } else {
        // Server error
        console.error(`Server error: ${err.code} for ${filePath}`);
        res.writeHead(500);
        res.end(`<h1>Server Error</h1><p>${err.code}</p>`);
      }
    } else {
      // Add caching headers for efficiency
      const headers = {
        'Content-Type': contentType,
        'Cache-Control': 'max-age=86400' // Cache for 1 day
      };
      
      res.writeHead(200, headers);
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log('Press Ctrl+C to stop');
});
