import app from './src/app';

describe('the app', () => {
  test('should not throw', () => {
    const model = {};
    const update = () => {};
    const view = () => {};
    const element = {};

    app(model, update, view, element);
  });
});
