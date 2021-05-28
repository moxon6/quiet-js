import path from 'path';
import CopyPlugin from 'copy-webpack-plugin';

export default {
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
    publicPath: process.env.REPO_NAME || '/',
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
