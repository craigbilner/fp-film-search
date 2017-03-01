// @flow

import type {
  Model,
  Update,
  View,
  AppOpts,
  DOMEventsType,
  Event,
  HttpProps,
} from './types';

let newModel;
let appUpdate;
let appView;
let appNodeUpdate;

const nodeUpdate = doc => (id: string,
                           html: string,
                           de: DOMEventsType,
                           events?: Event[] = []): void => {
  const node = doc.getElementById(id);

  if (node) {
    node.innerHTML = html;
    events.forEach(({ CMD, type, elId }) => {
      const target = doc.getElementById(elId);

      if (target && de) {
        target.addEventListener(type, de(CMD));
      }
    });
  } else {
    // eslint-disable-next-line no-console
    console.error('unknown node', id);
  }
};

const makeUpdates = (htmlUpdates, DOMEvents) =>
  htmlUpdates.forEach(({ elId, html, events }) =>
    appNodeUpdate(elId, html, DOMEvents, events));

const DOMEvents = eventCMD => (evt) => {
  newModel = appUpdate({
    CMD: eventCMD,
    data: evt,
  }, newModel);

  makeUpdates(appView(newModel), DOMEvents);
};

// eslint-disable-next-line no-undef
const getEnv = () => typeof global !== 'undefined' ? global : window;

export const http = ({ OK, ERR, url } : HttpProps) =>
  getEnv().fetch(url)
    .then((resp) => {
      if (resp.ok) {
        return resp.json();
      }

      throw new Error(resp.statusText);
    })
    .then((data) => {
      newModel = appUpdate({ CMD: OK, data }, newModel);
      makeUpdates(appView(newModel), DOMEvents);
    })
    .catch((e) => {
      newModel = appUpdate({ CMD: ERR, data: e }, newModel);
      makeUpdates(appView(newModel), DOMEvents);
    });

const app = (model: Model,
             update: Update,
             view: View,
             doc: Document, // eslint-disable-line no-undef
             rootElement: ?HTMLElement, // eslint-disable-line no-undef
             opts: AppOpts = {}) => {
  if (!rootElement) {
    return;
  }

  // eslint-disable-next-line no-param-reassign
  rootElement.innerHTML = '<div id="app"></div>';

  appUpdate = update;
  appView = view;
  appNodeUpdate = nodeUpdate(doc);
  const modelWithKey = Object.assign({}, model, {
    AUTH_KEY: opts.key,
  });

  newModel = appUpdate({ CMD: 'INIT' }, modelWithKey);
  makeUpdates(appView(newModel), DOMEvents);
  newModel = appUpdate({ CMD: 'INITTED' }, newModel);
  makeUpdates(appView(newModel), DOMEvents);
};

export default app;
