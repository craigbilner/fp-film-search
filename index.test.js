import sinon from 'sinon';
import jsdom from 'jsdom';
import app from './src/app';
import model from './src/model';
import update from './src/update';
import view from './src/view';

const opts = {
  key: 'TEST',
};

describe('the app', () => {
  test('should not throw', () => {
    app(model, update, view, opts);
  });

  test('should add a search box to the DOM', (done) => {
    jsdom.env('<div id="root"></div>', (err, w) => {
      const doc = w.document;

      app(model, update, view, doc, doc.getElementById('root'), opts);

      const searchBoxes = doc.querySelectorAll('#searchBox');

      expect(searchBoxes.length).toBe(1);

      done();
    });
  });

  test('should add a empty results to the DOM', (done) => {
    jsdom.env('<div id="root"></div>', (err, w) => {
      const doc = w.document;

      app(model, update, view, doc, doc.getElementById('root'), opts);

      const searchResults = doc.querySelector('#searchResults');

      expect(searchResults.textContent.trim()).toBe('no results here!');

      done();
    });
  });

  test('should fetch the expected query', (done) => {
    jsdom.env('<div id="root"></div>', (err, w) => {
      const doc = w.document;

      global.fetch = sinon.spy();

      app(model, update, view, doc, doc.getElementById('root'), opts);

      const sb = doc.querySelector('#searchBox');
      sb.value = 'jack';
      const e = doc.createEvent('HTMLEvents');
      e.initEvent('keyup', false, true);
      sb.dispatchEvent(e);

      const expectedURL = 'https://api.themoviedb.org/3/search/multi' +
        '?api_key=TEST' +
        '&language=en-US' +
        '&query=jack' +
        '&page=1' +
        '&include_adult=false';

      const [actual] = global.fetch.firstCall.args;

      expect(actual).toBe(expectedURL);

      done();
    });
  });

  test('should populate the DOM with the returned movies', (done) => {
    jsdom.env('<div id="root"></div>', (err, w) => {
      const doc = w.document;

      global.fetch = () => Promise.resolve({
        ok: true,
        json() {
          return Promise.resolve({
            page: 1,
            results: [
              {
                poster_path: '/rv6LVjTHswpRHeQr0s33McrXJor.jpg',
                popularity: 1.129689,
                id: 61129,
                overview: 'The class system in Thailand today',
                backdrop_path: '/8JbkUs00D9sonFXk1YQRr6cNBQ2.jpg',
                vote_average: 3.75,
                media_type: 'movie',
                first_air_date: '2014-04-29',
                origin_country: [
                  'TH',
                ],
                genre_ids: [
                  10766,
                  18,
                ],
                original_language: 'en',
                vote_count: 2,
                name: 'Mam Ja',
                original_name: 'แหม่มจ๋า',
              },
            ],
            total_results: 38211,
            total_pages: 1911,
          });
        },
      });

      app(model, update, view, doc, doc.getElementById('root'), opts);

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

  test('should populate the DOM with error message on fail', (done) => {
    jsdom.env('<div id="root"></div>', (err, w) => {
      const doc = w.document;

      global.fetch = () => Promise.reject({
        message: 'an error',
      });

      app(model, update, view, doc, doc.getElementById('root'), opts);

      const sb = doc.querySelector('#searchBox');
      sb.value = 'jack';
      const e = doc.createEvent('HTMLEvents');
      e.initEvent('keyup', false, true);
      sb.dispatchEvent(e);

      setTimeout(() => {
        const cards = doc.querySelectorAll('.movie-card');
        const searchResults = doc.querySelector('.search-results_fail');

        expect(cards.length).toBe(0);
        expect(searchResults.textContent.trim()).toBe('Could not fetch results, try again...?');

        done();
      }, 0);
    });
  });
});
