import replace from 'rollup-plugin-replace';
import flow from 'rollup-plugin-flow';

export default {
  entry: 'index.js',
  dest: 'dist/bundle.js',
  format: 'es',
  plugins: [
    replace({
      API_KEY: process.env.API_KEY,
    }),
    flow(),
  ],
};
