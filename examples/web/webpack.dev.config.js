const path = require('path');
const config = require('./webpack.config');

module.exports = {
  ...config,
  mode: 'development',
  optimization: {
    minimize: false,
  },
  resolve: {
    alias: {
      '@moxon6/quiet-js': path.resolve(__dirname, '../../dist'),
    },
  },
};
