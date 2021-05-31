const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  plugins: [
    new CopyPlugin({
      patterns: [
        'index.html',
      ],
    }),
  ],
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
