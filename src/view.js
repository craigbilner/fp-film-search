// @flow

import type { Model } from './types';

const view = (model: Model) => {
  if (!model.hasInitiated) {
    return [{
      elId: 'root',
      html: `
        <div className="app">
            <input id="searchBox" type="search" />
            <div id="searchResults" className="search-results">
                no results here!
            </div>
        </div>
      `,
      events: [{
        CMD: 'SEARCH',
        type: 'keyup',
        elId: 'searchBox',
      }],
    }];
  }

  return [];
};

export default view;
