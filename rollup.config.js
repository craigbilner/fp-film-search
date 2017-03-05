import flow from 'rollup-plugin-flow';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import hash from 'rollup-plugin-hash';
import postcss from 'rollup-plugin-postcss';

export default {
  entry: 'index.js',
  dest: 'public/bundle.js',
  format: 'es',
  plugins: [
    flow(),
    nodeResolve({ main: true }),
    commonjs(),
    hash({
      dest: 'public/bundle.[hash].js',
      replace: true,
      manifest: 'manifest.json',
      manifestKey: 'bundle',
    }),
    postcss(),
  ],
};
