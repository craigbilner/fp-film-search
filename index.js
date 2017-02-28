// @flow

import app from './src/app';
import model from './src/model';
import update from './src/update';
import view from './src/view';

app(model, update, view, document.getElementById('root'));
