// @flow

import type {
  Model,
  Update,
  View,
  NodeUpdate,
  AppOpts,
} from './types';

const makeUpdates = (nodeUpdate, view, update) => (CMD, model) => {
  const htmlUpdates = view(update(CMD, model));

  htmlUpdates.forEach(({ elId, html }) => nodeUpdate(elId, html));
};

const app = (model: Model,
             update: Update,
             view: View,
             nodeUpdate: NodeUpdate,
             opts: AppOpts = {}) => {
  const modelWithKey = Object.assign({}, model, {
    AUTH_KEY: opts.key,
  });

  const updateDOM = makeUpdates(nodeUpdate, view, update);

  updateDOM({ CMD: 'INIT' }, modelWithKey);
  updateDOM({ CMD: 'INITTED' }, modelWithKey);
};

export default app;
