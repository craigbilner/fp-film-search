// @flow

const model = {
  hasInitiated: false,
  AUTH_KEY: '',
  searchFailed: false,
  searchTerm: '',
  images: {
    baseUrl: '',
    secureBaseUrl: '',
    backdropSizes: [],
    logoSizes: [],
    posterSizes: [],
    profileSizes: [],
    stillSizes: [],
  },
  movies: {
    page: 0,
    list: [],
    totalPages: 0,
    totalResults: 0,
  },
};

export default model;
