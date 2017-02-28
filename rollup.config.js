import replace from 'rollup-plugin-replace';

export default {
  entry: 'index.js',
  dest: 'dist/bundle.js',
  format: 'es',
  plugins: [
    replace({
      API_KEY: process.env.API_KEY,
    }),
  ],
};
