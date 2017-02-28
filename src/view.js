// @flow

import type { Model } from './types';

const view = (model: Model) => {
  if (!model.hasInitiated) {
    return [{
      elId: 'root',
      html: '<div>tests</div>',
    }];
  }

  return [];
};

export default view;
