// @flow

import type {
  Model,
  Update,
  View,
  NodeUpdate,
  AppOpts,
} from './types';

const makeUpdates = (htmlUpdates, nodeUpdate, DOMEvents) =>
  htmlUpdates.forEach(({ elId, html, events }) => nodeUpdate(elId, html, DOMEvents, events));

const app = (model: Model,
             update: Update,
             view: View,
             nodeUpdate: NodeUpdate,
             opts: AppOpts = {}) => {
  const modelWithKey = Object.assign({}, model, {
    AUTH_KEY: opts.key,
  });

  let newModel;

  const DOMEvents = eventCMD => (evt) => {
    newModel = update({
      CMD: eventCMD,
      data: evt,
    }, newModel);

    makeUpdates(view(newModel), nodeUpdate, DOMEvents);
  };

  newModel = update({ CMD: 'INIT' }, modelWithKey);
  makeUpdates(view(newModel), nodeUpdate, DOMEvents);
  newModel = update({ CMD: 'INITTED' }, newModel);
  makeUpdates(view(newModel), nodeUpdate, DOMEvents);
};

export default app;
