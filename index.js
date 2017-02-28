// @flow

import app from './src/app';
import model from './src/model';
import update from './src/update';
import view from './src/view';

const nodeUpdate = (id, html) => {
  const node = document.getElementById(id);

  if (node) {
    node.innerHTML = html;
  } else {
    // eslint-disable-next-line no-console
    console.error('unknown node', id);
  }
};

app(model, update, view, nodeUpdate, {
  key: 'API_KEY',
});
