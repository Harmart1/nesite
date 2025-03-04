/**
 * NorthernEdge Legal Solutions Service Worker
 * Provides offline functionality and performance improvements
 */

const CACHE_NAME = 'northernedge-cache-v1';

// Resources that should be pre-cached
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/css/elegant-design-system.css',
  '/css/elegant-navigation.css',
  '/css/typography-animations.css',
  '/css/accessibility-enhancements.css',
  '/js/visual-integration.js',
  '/images/northernedge-logo.svg',
  '/images/northernedge-logo-white.svg',
  '/favicon/favicon.ico',
  '/offline.html',
  '/404.html'
];

// Resources that should never be cached
const NEVER_CACHE = [
  '/api/',
  '/admin/',
  '/wp-admin/'
];

// Install event - Pre-cache critical assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Pre-caching resources');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - Clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(name => name !== CACHE_NAME)
            .map(name => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Helper function to determine if a URL should be cached
function shouldCache(url) {
  const parsedUrl = new URL(url);
  
  // Don't cache dynamic API calls or admin pages
  for (const pattern of NEVER_CACHE) {
    if (parsedUrl.pathname.startsWith(pattern)) {
      return false;
    }
  }
  
  // Don't cache URLs with query parameters (except safe ones)
  if (parsedUrl.search && !parsedUrl.search.match(/^\?(?:v=|version=|lang=|locale=)/)) {
    return false;
  }
  
  // Only cache same-origin resources
  if (parsedUrl.origin !== self.location.origin) {
    return false;
  }
  
  // Cache static assets and HTML files
  return (
    parsedUrl.pathname.match(/\.(css|js|png|jpg|jpeg|svg|webp|woff2?)$/) ||
    parsedUrl.pathname.match(/\.html$/) ||
    parsedUrl.pathname === '/' ||
    parsedUrl.pathname.endsWith('/')
  );
}

// Helper function to determine if a request is for a page
function isPageRequest(request) {
  const url = new URL(request.url);
  
  // If the Accept header includes text/html, it's likely a page request
  const acceptHeader = request.headers.get('Accept');
  return (
    request.mode === 'navigate' ||
    (acceptHeader && acceptHeader.includes('text/html')) ||
    url.pathname === '/' ||
    url.pathname.endsWith('/') ||
    url.pathname.endsWith('.html')
  );
}

// Helper function to handle navigation requests
async function handleNavigationRequest(request) {
  // Try to get from network first
  try {
    const networkResponse = await fetch(request);
    
    // If successful, cache a copy and return network response
    if (networkResponse.ok && shouldCache(request.url)) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // If network fails, try to get from cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If not in cache either, serve the offline page
    return caches.match('/offline.html');
  }
}

// Helper function to handle asset requests
async function handleAssetRequest(request) {
  // Check cache first for assets
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // If not in cache, get from network
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok && shouldCache(request.url)) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Failed to fetch asset:', request.url);
    throw error;
  }
}

// Fetch event - Stale-while-revalidate strategy
self.addEventListener('fetch', event => {
  const request = event.request;
  
  // Skip non-GET requests and requests to other domains
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) {
    return;
  }
  
  // Special handling for navigation requests
  if (isPageRequest(request)) {
    event.respondWith(handleNavigationRequest(request));
    return;
  }
  
  // For other assets, try cache first, fallback to network
  event.respondWith(handleAssetRequest(request));
});

// Create an offline fallback page
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});
