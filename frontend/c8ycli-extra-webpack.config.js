
const CopyPlugin = require('copy-webpack-plugin');

module.exports = config;

function config(env) {
  'use strict';

  return {
    plugins: [
      new CopyPlugin([
        { from: './assets', to: 'assets' },
      ])
    ]
  };
}
