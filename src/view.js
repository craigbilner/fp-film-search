// @flow

import type { Model } from './types';

const toMovieCard = model => ({ posterPath }) => {
  const {
    baseUrl,
    posterSizes,
  } = model.images;
  const postUrl = `${baseUrl}${posterSizes[2]}${posterPath}`;

  return `
    <div class="movie-card">
      <img src="${postUrl}" />
    </div>
  `;
};

const noResults = 'could not find any results :-(';

const view = (model: Model) => {
  if (!model.hasInitiated) {
    return [{
      elId: 'app',
      html: `
        <div class="film-search">
            <input id="searchBox" type="search" class="film-search__search-box" />
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
      html: `<div class="search-results__fail">
                Could not fetch results, try again...?
             </div>
      `,
    }];
  } else if (model.movies.list.length) {
    return [{
      elId: 'searchResults',
      html: model.movies.list.map(toMovieCard(model)).join(''),
    }];
  }

  return [{
    elId: 'searchResults',
    html: noResults,
  }];
};

export default view;
