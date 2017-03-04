// @flow

import app from './src/app';
import model from './src/model';
import update from './src/update';
import view from './src/view';
import './sw-init';

app(model, update, view, document, document.getElementById('root'), {
  key: 'API_KEY',
});
