// @flow

import type { UpdateCMD, Model } from './types';

const changeModel = (model, update) => Object.assign({}, model, update);

const update = ({ CMD, data = {} }: UpdateCMD, model: Model) => {
  if (CMD === 'INIT') {
    return model;
  } else if (CMD === 'INITTED') {
    return changeModel(model, {
      hasInitiated: true,
    });
  } else if (CMD === 'SEARCH') {
    console.info(data.target.value);
    return model;
  }

  // eslint-disable-next-line no-console
  console.error('Unknown command', CMD);
  return model;
};

export default update;
