// @flow

import type { Model } from './types';

const dateFormatter = new window.Intl.DateTimeFormat('en-GB', {
  month: 'long',
  year: 'numeric',
});

const formatDate = d =>
  `${dateFormatter.format(d)}`;

const toMovieCard = model => ({ posterPath, releaseDate, voteAverage: vote }) => {
  const {
    baseUrl,
    posterSizes,
  } = model.images;
  const postUrl = `${baseUrl}${posterSizes[2]}${posterPath}`;

  return `
    <div class="movie-card">
      <div class="movie-card__img">
        <img src="${postUrl}" />
      </div>
      <div class="movie-card__details">
        <div class="movie-card__detail">
          <div class="movie-card__value">${formatDate(releaseDate)}</div>
        </div>
        <div class="movie-card__vote">${vote}</div>
      </div>
    </div>
  `;
};

const noResults = 'could not find any results :-(';

const view = (model: Model) => {
  if (!model.hasInitiated) {
    return [
      {
        elId: 'app',
        html: `
        <div class="film-search">
          <div class="search-input">
            <input id="searchBox" type="search" class="search-input__search-box" autofocus />
            <div id="totalResults" class="search-input__count"></div>
          </div>
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
      },
      {
        elId: 'totalResults',
        html: '0',
      },
    ];
  } else if (model.searchFailed) {
    return [
      {
        elId: 'searchResults',
        html: `<div class="search-results__fail">
                Could not fetch results, try again...?
             </div>
      `,
      },
      {
        elId: 'totalResults',
        html: '0',
      },
    ];
  } else if (model.movies.list.length) {
    return [
      {
        elId: 'searchResults',
        html: model.movies.list.map(toMovieCard(model)).join(''),
      },
      {
        elId: 'totalResults',
        html: `${model.movies.totalResults}`,
      },
    ];
  }

  return [
    {
      elId: 'searchResults',
      html: noResults,
    },
    {
      elId: 'totalResults',
      html: '0',
    },
  ];
};

export default view;
