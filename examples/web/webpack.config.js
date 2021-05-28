import path from 'path';

export default {
  mode: 'production',
  optimization: {
    minimize: true,
  },
  entry: {
    index: path.resolve('index.js'),
  },
  output: {
    path: path.resolve('./dist'),
    filename: '[name].js',
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
