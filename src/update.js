// @flow

import type { UpdateCMD, Model } from './types';
import { http } from './app';

/* eslint-disable prefer-template */
const makeURL = (AUTH_KEY, term) =>
'https://api.themoviedb.org/3/search/multi' +
'?api_key=' + AUTH_KEY +
'&language=en-US' +
'&query=' + term +
'&page=1' +
'&include_adult=false';
/* eslint-disable prefer-template */

const stringToDate = (s) => {
  if (!s) {
    return null;
  }

  const [y, m, d] = s.split('-');

  return new Date(y, parseInt(m, 10) - 1, d);
};

const movieToModel = m => ({
  adult: m.adult,
  backdropPath: m.backdrop_path || '',
  genreIds: m.genre_ids,
  id: m.id,
  mediaType: m.media_type,
  originalLanguage: m.original_language,
  originalTitle: m.original_title,
  overview: m.overview,
  popularity: m.popularity,
  posterPath: m.poster_path || '',
  releaseDate: stringToDate(m.release_date),
  title: m.title,
  video: m.video,
  voteAverage: m.vote_average,
  voteCount: m.vote_count,
});

const changeModel = (model, update) => Object.assign({}, model, update);

// eslint-disable-next-line camelcase
const byMovie = ({ media_type }) => media_type === 'movie';

const addMovies = (model, { page, results, total_pages, total_results }) =>
  changeModel(model, {
    searchFailed: false,
    movies: {
      page,
      list: results.filter(byMovie).map(movieToModel),
      totalPages: total_pages,
      totalResults: total_results,
    },
  });

const update = ({ CMD, data = {} }: UpdateCMD, model: Model) => {
  if (CMD === 'INIT') {
    return model;
  } else if (CMD === 'INITTED') {
    return changeModel(model, {
      hasInitiated: true,
    });
  } else if (CMD === 'SEARCH') {
    if (data.target.value && (data.target.value !== model.searchTerm)) {
      http({
        OK: 'SEARCH_SUCCESS',
        ERR: 'SEARCH_FAIL',
        url: makeURL(model.AUTH_KEY, data.target.value),
      });

      return changeModel(model, {
        searchTerm: data.target.value,
      });
    } else if (data.target.value) {
      return model;
    }

    return changeModel(model, {
      searchFailed: false,
      movies: {
        page: 0,
        list: [],
        totalPages: 0,
        totalResults: 0,
      },
    });
  } else if (CMD === 'SEARCH_SUCCESS') {
    return addMovies(model, data);
  } else if (CMD === 'SEARCH_FAIL') {
    return changeModel(model, {
      searchFailed: true,
    });
  }

  // eslint-disable-next-line no-console
  console.error('Unknown command', CMD);
  return model;
};

export default update;
