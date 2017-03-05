// @flow

import debounce from 'lodash.debounce';
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

export const http = (function http() {
  let httpQueue = [];

  const performUpdates = (url, CMD, data) => {
    if (url === httpQueue[httpQueue.length - 1]) {
      newModel = appUpdate({ CMD, data }, newModel);
      makeUpdates(appView(newModel), DOMEvents);
      httpQueue = [];
    }
  };

  return debounce(({ OK, ERR, url } : HttpProps) => {
    httpQueue.push(url);

    getEnv()
      .fetch(url)
      .then((resp) => {
        if (resp.ok) {
          return resp.json();
        }

        throw new Error(resp.statusText);
      })
      .then((data) => {
        performUpdates(url, OK, data);
      })
      .catch((e) => {
        performUpdates(url, ERR, e);
      });
  }, 100, {
    leading: true,
  });
}());

const app = (model: Model,
             update: Update,
             view: View,
             doc: Document, // eslint-disable-line no-undef
             rootElement: ?HTMLElement, // eslint-disable-line no-undef
             opts: AppOpts = {}) => {
  appUpdate = update;
  appView = view;
  appNodeUpdate = nodeUpdate(doc);

  return getEnv()
    .fetch(`https://api.themoviedb.org/3/configuration?api_key=${opts.key || ''}`)
    .then((resp) => {
      if (!resp.ok) {
        throw new Error(resp.statusText);
      }

      return resp.json();
    })
    .then((data) => {
      const {
        base_url: baseUrl,
        secure_base_url: secureBaseUrl,
        backdrop_sizes: backdropSizes,
        logo_sizes: logoSizes,
        poster_sizes: posterSizes,
        profile_sizes: profileSizes,
        still_sizes: stillSizes,
      } = data.images;

      newModel = Object.assign({}, model, {
        AUTH_KEY: opts.key,
        images: {
          baseUrl,
          secureBaseUrl,
          backdropSizes,
          logoSizes,
          posterSizes,
          profileSizes,
          stillSizes,
        },
      });

      if (rootElement) {
        // eslint-disable-next-line no-param-reassign
        rootElement.innerHTML = '<div id="app" class="app"></div>';
      }

      newModel = appUpdate({ CMD: 'INIT' }, newModel);
      makeUpdates(appView(newModel), DOMEvents);
      newModel = appUpdate({ CMD: 'INITTED' }, newModel);
      makeUpdates(appView(newModel), DOMEvents);
    })
    .catch((e) => {
      if (rootElement) {
        // eslint-disable-next-line no-param-reassign
        rootElement.innerHTML =
          '<div id="app" class="app--fail">themovieDB seems to be down</div>';
      }

      return e;
    });
};

export default app;
