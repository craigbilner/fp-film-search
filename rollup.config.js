import replace from 'rollup-plugin-replace';
import flow from 'rollup-plugin-flow';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  entry: 'index.js',
  dest: 'dist/bundle.js',
  format: 'es',
  plugins: [
    replace({
      API_KEY: process.env.API_KEY,
    }),
    flow(),
    nodeResolve({ main: true }),
    commonjs(),
  ],
};
