import sinon from 'sinon';
import jsdom from 'jsdom';
import app from './src/app';
import model from './src/model';
import update from './src/update';
import view from './src/view';

const initFetch = (ok = true) => () => Promise.resolve({
  ok,
  json() {
    return Promise.resolve({
      images: {
        base_url: 'base',
        secure_base_url: 'sbase',
        backdrop_sizes: [],
        logo_sizes: [],
        poster_sizes: [],
        profile_sizes: [],
        still_sizes: [],
      },
    });
  },
});

const movieFetch = () => Promise.resolve({
  ok: true,
  json() {
    return Promise.resolve({
      page: 1,
      results: [
        {
          adult: false,
          backdrop_path: '/ezXodpP429qK0Av89pVNlaXWJkQ.jpg',
          genre_ids: [80, 18, 53],
          id: 75780,
          media_type: 'movie',
          original_language: 'en',
          original_title: 'Jack Reacher',
          overview: 'In an innocent heartland city...',
          popularity: 7.47127,
          poster_path: '/38bmEXmuJuInLs9dwfgOGCHmZ7l.jpg',
          release_date: '2012-12-20',
          title: 'Jack Reacher',
          video: false,
          vote_average: 6.3,
          vote_count: 2524,
        },
      ],
      total_results: 38211,
      total_pages: 1911,
    });
  },
});

describe('the app', () => {
  test('should add itself to the DOM on successful config fetch', (done) => {
    jsdom.env('<div id="root"></div>', (err, w) => {
      const doc = w.document;
      global.fetch = initFetch();

      app(model, update, view, doc, doc.getElementById('root'))
        .then(() => {
          const appEl = doc.querySelectorAll('#app');

          expect(appEl.length).toBe(1);

          done();
        });
    });
  });

  test('should add itself to the DOM with error on config fetch fail', (done) => {
    jsdom.env('<div id="root"></div>', (err, w) => {
      const doc = w.document;
      global.fetch = initFetch(false);

      app(model, update, view, doc, doc.getElementById('root'))
        .then(() => {
          const appEl = doc.querySelectorAll('.app--fail');

          expect(appEl.length).toBe(1);

          done();
        });
    });
  });

  test('should add a search box to the DOM', (done) => {
    jsdom.env('<div id="root"></div>', (err, w) => {
      const doc = w.document;
      global.fetch = initFetch();

      app(model, update, view, doc, doc.getElementById('root'))
        .then(() => {
          const searchBoxes = doc.querySelectorAll('#searchBox');

          expect(searchBoxes.length).toBe(1);

          done();
        });
    });
  });

  test('should add a empty results to the DOM', (done) => {
    jsdom.env('<div id="root"></div>', (err, w) => {
      const doc = w.document;
      global.fetch = initFetch();

      app(model, update, view, doc, doc.getElementById('root'))
        .then(() => {
          const searchResults = doc.querySelector('#searchResults');

          expect(searchResults.textContent.trim()).toBe('could not find any results :-(');

          done();
        });
    });
  });

  test('should fetch the expected query', (done) => {
    jsdom.env('<div id="root"></div>', (err, w) => {
      const doc = w.document;
      global.fetch = initFetch();

      app(model, update, view, doc, doc.getElementById('root'))
        .then(() => {
          global.fetch = sinon.stub().returns(Promise.resolve());

          const sb = doc.querySelector('#searchBox');
          sb.value = 'jack';
          const e = doc.createEvent('HTMLEvents');
          e.initEvent('keyup', false, true);
          sb.dispatchEvent(e);

          const expectedURL = '/find/jack';

          const [actual] = global.fetch.firstCall.args;

          expect(actual).toBe(expectedURL);

          done();
        });
    });
  });

  test('should populate the DOM with the returned movies', (done) => {
    jsdom.env('<div id="root"></div>', (err, w) => {
      const doc = w.document;
      global.fetch = initFetch();

      app(model, update, view, doc, doc.getElementById('root'))
        .then(() => {
          global.fetch = movieFetch;

          const sb = doc.querySelector('#searchBox');
          sb.value = 'jack';
          const e = doc.createEvent('HTMLEvents');
          e.initEvent('keyup', false, true);
          sb.dispatchEvent(e);

          setTimeout(() => {
            const cards = doc.querySelectorAll('.movie-card');

            expect(cards.length).toBe(1);

            done();
          }, 200);
        });
    });
  });

  test('should populate the DOM with error message on fail', (done) => {
    jsdom.env('<div id="root"></div>', (err, w) => {
      const doc = w.document;
      global.fetch = initFetch();

      app(model, update, view, doc, doc.getElementById('root'))
        .then(() => {
          global.fetch = () => Promise.reject({
            message: 'an error',
          });

          const sb = doc.querySelector('#searchBox');
          sb.value = 'jack';
          const e = doc.createEvent('HTMLEvents');
          e.initEvent('keyup', false, true);
          sb.dispatchEvent(e);

          setTimeout(() => {
            const cards = doc.querySelectorAll('.movie-card');
            const searchResults = doc.querySelector('.search-results__fail');

            expect(cards.length).toBe(0);
            expect(searchResults.textContent.trim()).toBe('Could not fetch results, try again...?');

            done();
          }, 0);
        });
    });
  });
});
