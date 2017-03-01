// @flow

import app from './src/app';
import model from './src/model';
import update from './src/update';
import view from './src/view';

const nodeUpdate = (id, html, cb, events = []) => {
  const node = document.getElementById(id);

  if (node) {
    node.innerHTML = html;
    events.forEach(({ CMD, type, elId }) => {
      const target = document.getElementById(elId);

      if (target && cb) {
        target.addEventListener(type, cb(CMD));
      }
    });
  } else {
    // eslint-disable-next-line no-console
    console.error('unknown node', id);
  }
};

app(model, update, view, nodeUpdate, {
  key: 'API_KEY',
});
