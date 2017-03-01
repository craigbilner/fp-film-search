import sinon from 'sinon';
import jsdom from 'jsdom';
import app from './src/app';
import model from './src/model';
import update from './src/update';
import view from './src/view';

let nodeUpdate = () => {
};
const opts = {};

describe('the app', () => {
  test('should not throw', () => {
    app(model, update, view, nodeUpdate, opts);
  });

  test('should add a search box to the DOM', (done) => {
    nodeUpdate = sinon.spy();

    app(model, update, view, nodeUpdate, opts);

    const [elId, html] = nodeUpdate.firstCall.args;

    jsdom.env(html, (err, w) => {
      expect(elId).toBe('root');

      const searchBoxes = w.document.querySelectorAll('#searchBox');

      expect(searchBoxes.length).toBe(1);

      done();
    });
  });

  test('should add a empty results to the DOM', (done) => {
    nodeUpdate = sinon.spy();

    app(model, update, view, nodeUpdate, opts);

    const [elId, html] = nodeUpdate.firstCall.args;

    jsdom.env(html, (err, w) => {
      expect(elId).toBe('root');

      const searchResults = w.document.querySelector('#searchResults');

      expect(searchResults.textContent.trim()).toBe('no results here!');

      done();
    });
  });
});
