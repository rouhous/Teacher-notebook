const CACHE = 'teacher-notebook-shell-v1';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('teacher-notebook-shell-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (!url.pathname.startsWith(new URL(self.registration.scope).pathname)) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then(response => {
      if (response.ok) {const copy=response.clone(); caches.open(CACHE).then(cache=>cache.put('./index.html',copy));}
      return response;
    }).catch(async () => (await caches.match('./index.html')) || Response.error()));
    return;
  }
  event.respondWith(caches.match(request).then(hit => hit || fetch(request)));
});
