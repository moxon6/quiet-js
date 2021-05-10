import path from 'path';
import { fileURLToPath } from 'url';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  mode: 'production',
  optimization: {
    minimize: false,
  },
  entry: {
    index: './src/index.js',
    'quiet-worklet': './src/quiet-worklet.js',
  },
  output: {
    path: path.resolve(dirname, 'dist'),
    filename: '[name].js',
    library: ['Quiet', '[name]'],
    libraryTarget: 'umd',
    globalObject: 'this',
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
