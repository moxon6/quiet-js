import path from 'path';
import { fileURLToPath } from 'url';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  mode: 'production',
  optimization: {
    minimize: true,
  },
  entry: {
    index: path.resolve(dirname, 'index.js'),
  },
  output: {
    path: path.resolve(dirname, 'dist'),
    filename: '[name].js',
  },
  resolve: {
    alias: {
      '@moxon6/quiet-js': path.resolve(dirname, '../../'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },

};
