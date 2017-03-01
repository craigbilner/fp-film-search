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

const changeModel = (model, update) => Object.assign({}, model, update);

const update = ({ CMD, data = {} }: UpdateCMD, model: Model) => {
  if (CMD === 'INIT') {
    return model;
  } else if (CMD === 'INITTED') {
    return changeModel(model, {
      hasInitiated: true,
    });
  } else if (CMD === 'SEARCH') {
    http({
      OK: 'SEARCH_SUCCESS',
      ERR: 'SEARCH_FAIL',
      url: makeURL(model.AUTH_KEY, data.target.value),
    });
    return model;
  } else if (CMD === 'SEARCH_SUCCESS') {
    console.info(data);
    return model;
  } else if (CMD === 'SEARCH_FAIL') {
    console.error(data);
    return model;
  }

  // eslint-disable-next-line no-console
  console.error('Unknown command', CMD);
  return model;
};

export default update;
