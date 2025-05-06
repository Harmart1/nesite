require('dotenv').config(); // Load environment variables from .env file

// Simple HTTP server using Node.js
const http = require('http');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer'); // Added nodemailer
const querystring = require('querystring'); // Added querystring for form parsing

// IMPORTANT: Store email credentials securely using environment variables
// Do not hardcode them here!
const EMAIL_USER = process.env.EMAIL_USER; // Your email address (e.g., from Gmail, SendGrid)
const EMAIL_PASS = process.env.EMAIL_PASS; // Your email password or app-specific password
const RECIPIENT_EMAIL = 'tharmar@northernedgelegal.com'; // Email to send submissions to

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

  // Handle POST request for contact form
  if (req.method === 'POST' && req.url === '/send-contact-email') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString(); // convert Buffer to string
    });
    req.on('end', () => {
      const formData = querystring.parse(body);

      // Basic validation (ensure required fields are not empty)
      if (!formData.Name || !formData.Email || !formData.Service || !formData.Message || !formData.PrivacyConsent) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Bad Request: Missing required form fields.');
        return;
      }

      // Configure Nodemailer transporter
      // NOTE: Replace 'smtp.example.com' with your actual SMTP host (e.g., 'smtp.gmail.com')
      // Ensure EMAIL_USER and EMAIL_PASS environment variables are set.
      if (!EMAIL_USER || !EMAIL_PASS) {
        console.error('ERROR: EMAIL_USER or EMAIL_PASS environment variables not set.');
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error: Email configuration missing.');
        return;
      }
      
      const transporter = nodemailer.createTransport({
        host: 'smtp.ionos.com', // IONOS SMTP host
        port: 587, // IONOS SMTP port (TLS/STARTTLS)
        secure: false, // Use STARTTLS
        auth: {
          // These MUST be set via environment variables
          // export EMAIL_USER='tharmar@northernedgelegal.com'
          // export EMAIL_PASS='MMnn#8877' <--- VERY INSECURE TO HARDCODE
          user: EMAIL_USER, 
          pass: EMAIL_PASS, 
        },
      });

      // Email content
      const mailOptions = {
        from: `"Website Contact Form" <${EMAIL_USER}>`, // Sender address (must be related to auth user)
        to: RECIPIENT_EMAIL, // List of receivers
        replyTo: formData.Email, // Set Reply-To to the user's email
        subject: formData.Subject || 'Website Contact Form Submission', // Subject line
        text: `New contact form submission:\n\nName: ${formData.Name}\nEmail: ${formData.Email}\nPhone: ${formData.Phone || 'Not provided'}\nService Needed: ${formData.Service}\nMessage: ${formData.Message}\nPrivacy Consent: ${formData.PrivacyConsent === 'on' ? 'Agreed' : 'Not Agreed'}`, // Plain text body
        html: `<p>New contact form submission:</p>
               <ul>
                 <li><strong>Name:</strong> ${formData.Name}</li>
                 <li><strong>Email:</strong> ${formData.Email}</li>
                 <li><strong>Phone:</strong> ${formData.Phone || 'Not provided'}</li>
                 <li><strong>Service Needed:</strong> ${formData.Service}</li>
                 <li><strong>Message:</strong></li>
               </ul>
               <p>${formData.Message.replace(/\n/g, '<br>')}</p>
               <p><strong>Privacy Consent:</strong> ${formData.PrivacyConsent === 'on' ? 'Agreed' : 'Not Agreed'}</p>` // HTML body
      };

      // Send mail
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error: Could not send email.');
        } else {
          console.log('Email sent: ' + info.response);
          // Redirect to a thank-you page on success
          res.writeHead(302, { 'Location': '/thank-you.html' });
          res.end();
        }
      });
    });
    return; // End processing for this request
  }

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
