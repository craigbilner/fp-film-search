const VERSION = 8;

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
