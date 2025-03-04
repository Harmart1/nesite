/**
 * Sitemap Generator
 * This script generates a sitemap.xml file for search engines
 * Run this script using Node.js: node sitemap-generator.js
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const writeFileAsync = promisify(fs.writeFile);
const readDirAsync = promisify(fs.readdir);
const statAsync = promisify(fs.stat);

// Configuration
const config = {
  baseUrl: 'https://www.northernedgelegal.com',
  rootDir: __dirname, // Current directory 
  outputFile: path.join(__dirname, 'sitemap.xml'),
  excludedPaths: [
    'node_modules',
    'images',
    'css',
    'js',
    'fonts',
    'favicon',
    'videos'
  ],
  excludedExtensions: [
    '.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.ico', 
    '.mp4', '.webm', '.pdf', 
    '.css', '.scss', '.less', 
    '.js', '.json', '.map',
    '.md', '.markdown',
    '.gitignore', '.DS_Store'
  ],
  defaultPriority: 0.5,
  defaultChangeFreq: 'weekly',
  priorityMapping: {
    '/index.html': 1.0,
    '/practice-areas.html': 0.9,
    '/contact.html': 0.8,
    '/about.html': 0.8,
    '/blog/index.html': 0.7
  },
  changeFreqMapping: {
    '/index.html': 'daily',
    '/blog/': 'daily',
    '/practice-areas.html': 'weekly'
  }
};

// Check if a file is an HTML file
const isHtmlFile = (filePath) => {
  return path.extname(filePath).toLowerCase() === '.html';
};

// Check if a directory or file should be excluded
const shouldExclude = (pathName) => {
  const base = path.basename(pathName);
  
  // Check if it's an excluded directory
  if (config.excludedPaths.includes(base)) {
    return true;
  }
  
  // Check if it's an excluded file extension
  const ext = path.extname(pathName).toLowerCase();
  if (config.excludedExtensions.includes(ext)) {
    return true;
  }
  
  // Exclude hidden files
  if (base.startsWith('.')) {
    return true;
  }
  
  return false;
};

// Get all HTML files
async function getAllHtmlFiles(dir, baseDir = dir) {
  let results = [];
  
  try {
    const items = await readDirAsync(dir);
    
    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stat = await statAsync(itemPath);
      
      if (shouldExclude(itemPath)) {
        continue;
      }
      
      if (stat.isDirectory()) {
        const subResults = await getAllHtmlFiles(itemPath, baseDir);
        results = [...results, ...subResults];
      } else if (isHtmlFile(itemPath)) {
        // Get relative path from base directory
        const relativePath = path.relative(baseDir, itemPath);
        results.push('/' + relativePath.replace(/\\/g, '/'));
      }
    }
  } catch (err) {
    console.error(`Error reading directory ${dir}:`, err);
  }
  
  return results;
}

// Get priority for a URL
function getPriority(url) {
  for (const pattern in config.priorityMapping) {
    if (url.includes(pattern)) {
      return config.priorityMapping[pattern];
    }
  }
  return config.defaultPriority;
}

// Get change frequency for a URL
function getChangeFreq(url) {
  for (const pattern in config.changeFreqMapping) {
    if (url.includes(pattern)) {
      return config.changeFreqMapping[pattern];
    }
  }
  return config.defaultChangeFreq;
}

// Format current date as YYYY-MM-DD
function formatDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Generate sitemap XML content
async function generateSitemap() {
  try {
    const htmlFiles = await getAllHtmlFiles(config.rootDir);
    const today = formatDate();
    
    // Sort by priority (descending)
    htmlFiles.sort((a, b) => getPriority(b) - getPriority(a));
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // Add each URL to sitemap
    for (const file of htmlFiles) {
      // Convert /index.html to / for root URL
      let url = file;
      if (url.endsWith('/index.html')) {
        url = url.slice(0, -10);
      }
      
      // Make sure URL doesn't end with /
      if (url !== '/' && url.endsWith('/')) {
        url = url.slice(0, -1);
      }
      
      // Add URL entry to sitemap
      xml += '  <url>\n';
      xml += `    <loc>${config.baseUrl}${url}</loc>\n`;
      xml += `    <lastmod>${today}</lastmod>\n`;
      xml += `    <changefreq>${getChangeFreq(file)}</changefreq>\n`;
      xml += `    <priority>${getPriority(file)}</priority>\n`;
      xml += '  </url>\n';
    }
    
    xml += '</urlset>';
    
    // Write sitemap to file
    await writeFileAsync(config.outputFile, xml, 'utf8');
    console.log(`Sitemap generated successfully: ${config.outputFile}`);
    
    return htmlFiles.length; // Return number of URLs added
  } catch (err) {
    console.error('Error generating sitemap:', err);
    throw err;
  }
}

// Run the generator
generateSitemap()
  .then(urlCount => {
    console.log(`Added ${urlCount} URLs to sitemap.`);
  })
  .catch(err => {
    console.error('Sitemap generation failed:', err);
    process.exit(1);
  });
