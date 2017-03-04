// @flow

import type { Model } from './types';

const toMovieCard = movie => `
  <div class="movie-card">
    ${movie.title}
  </div>
`;

const noResults = 'could not find any results :-(';

const view = (model: Model) => {
  if (!model.hasInitiated) {
    return [{
      elId: 'app',
      html: `
        <div class="film-search">
            <input id="searchBox" type="search" />
            <div id="searchResults" class="search-results">
                ${noResults}
            </div>
        </div>
      `,
      events: [{
        CMD: 'SEARCH',
        type: 'keyup',
        elId: 'searchBox',
      }],
    }];
  } else if (model.searchFailed) {
    return [{
      elId: 'searchResults',
      html: `<div class="search-results_fail">
                Could not fetch results, try again...?
             </div>
      `,
    }];
  } else if (model.movies.list.length) {
    return [{
      elId: 'searchResults',
      html: model.movies.list.map(toMovieCard).join(''),
    }];
  }

  return [{
    elId: 'searchResults',
    html: noResults,
  }];
};

export default view;
