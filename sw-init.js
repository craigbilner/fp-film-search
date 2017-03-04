if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('./sw.js')
    .then(reg =>
      console.info('SW registration succeeded', reg)) // eslint-disable-line no-console
    .catch(error =>
      console.error(`SW registration failed with ${error}`)); // eslint-disable-line no-console
}
