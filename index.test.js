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
});
