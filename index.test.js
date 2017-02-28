import sinon from 'sinon';
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

  test('should add test to the DOM', () => {
    nodeUpdate = sinon.spy();

    app(model, update, view, nodeUpdate, opts);

    const expected = [
      'root',
      '<div>tests</div>',
    ];

    expect(nodeUpdate.firstCall.args).toEqual(expect.arrayContaining(expected));
  });
});
