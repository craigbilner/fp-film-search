const VERSION = 3;

this.addEventListener('install', event => event.waitUntil(
  caches
    .open(`v${VERSION}`)
    .then(cache => cache.addAll([
      '/dist/bundle.js',
      '/index.css',
    ]))
    .catch(e => console.error('Could not cache assets', e))
  )
);

this.addEventListener('fetch', event => event.respondWith(
  caches
    .match(event.request)
    .then(cr => cr || fetch(event.request)
      .then(fr =>
        caches
          .open(`v${VERSION}`)
          .then((cache) => {
            cache.put(event.request, fr.clone());
            // console.info('cached fetch response', event.request);
            return fr;
          })
      )
      .catch(e => console.error('fetch error', e)))
    .catch(e => console.error('cache match error', e))
));

this.addEventListener('activate', event => {
  const cacheWhitelist = [`v${VERSION}`];

  event.waitUntil(
    caches
      .keys()
      .then(keyList =>
        Promise.all(keyList.map((key) => {
          if (!cacheWhitelist.includes(key)) {
            return caches.delete(key);
          }
        }))
      )
  )
});
